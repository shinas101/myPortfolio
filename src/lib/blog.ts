import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// ============================================================================
// 1. DOMAIN MODELS & TYPES
// ============================================================================

export type BlogPostMeta = {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    readTime: string;
};

export type BlogPost = BlogPostMeta & {
    content: string;
    html: string;
};

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    mtimeMs?: number;
}

type LogLevel = "debug" | "info" | "warn" | "error";

// ============================================================================
// 2. CONFIGURATION & CONSTANTS
// ============================================================================

const BLOG_CONFIG = {
    postsDirectory: path.join(process.cwd(), "posts"),
    wordsPerMinute: 200,
    fileExtension: ".md",
    safeSlugPattern: /^[a-zA-Z0-9_-]+$/,
    // 1 hour in production, 5 seconds in development for instant HMR feedback
    cacheTtlMs: process.env.NODE_ENV === "production" ? 1000 * 60 * 60 : 5000,
} as const;

// ============================================================================
// 3. LOGGING SUBSYSTEM
// ============================================================================

class Logger {
    private readonly prefix: string;
    private readonly enabled: boolean;

    constructor(prefix = "[BlogService]") {
        this.prefix = prefix;
        // Suppress general info logs in test runner unless explicit DEBUG is requested
        this.enabled = process.env.NODE_ENV !== "test" || Boolean(process.env.DEBUG);
    }

    private format(level: LogLevel, message: string, meta?: unknown): string {
        const timestamp = new Date().toISOString();
        const base = `${timestamp} [${level.toUpperCase()}] ${this.prefix} ${message}`;
        return meta !== undefined ? `${base} | ${JSON.stringify(meta)}` : base;
    }

    debug(message: string, meta?: unknown): void {
        if (this.enabled && process.env.DEBUG) {
            console.debug(this.format("debug", message, meta));
        }
    }

    info(message: string, meta?: unknown): void {
        if (this.enabled && process.env.NODE_ENV === "development") {
            console.info(this.format("info", message, meta));
        }
    }

    warn(message: string, meta?: unknown): void {
        if (this.enabled) {
            console.warn(this.format("warn", message, meta));
        }
    }

    error(message: string, error?: unknown): void {
        if (this.enabled) {
            const errDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error;
            console.error(this.format("error", message, errDetails));
        }
    }
}

const logger = new Logger();

// ============================================================================
// 4. UTILITIES & METRIC COMPUTATION
// ============================================================================

export class BlogUtils {
    /**
     * High-performance, zero-allocation word counter.
     * Evaluates characters in a single pass without allocating intermediate string arrays.
     */
    static countWords(text: string): number {
        let count = 0;
        let inWord = false;
        const len = text.length;

        for (let i = 0; i < len; i++) {
            const code = text.charCodeAt(i);
            // Whitespace boundary: ASCII <= 32 (space, tab, LF, CR, FF)
            if (code <= 32) {
                inWord = false;
            } else if (!inWord) {
                inWord = true;
                count++;
            }
        }

        return count;
    }

    /**
     * Calculates human-readable reading time (e.g., "3 min read").
     */
    static calculateReadTime(text: string, wordsPerMinute = BLOG_CONFIG.wordsPerMinute): string {
        const words = this.countWords(text);
        const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
        return `${minutes} min read`;
    }

    /**
     * Validates slug against path traversal and unsupported characters.
     */
    static isValidSlug(slug: unknown): slug is string {
        return (
            typeof slug === "string" && slug.length > 0 && slug.length <= 128 && BLOG_CONFIG.safeSlugPattern.test(slug)
        );
    }

    /**
     * Formats date into standardized human-readable strings (e.g. "Aug 10, 2025").
     * Safely handles Date objects, ISO strings, timestamps, or unparseable input.
     */
    static formatDate(date: unknown): string {
        if (!date) return "";
        try {
            const parsed = date instanceof Date ? date : new Date(date as string | number);
            const timestamp = parsed.getTime();
            if (Number.isNaN(timestamp)) {
                return String(date);
            }
            return parsed.toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return String(date);
        }
    }

    /**
     * Normalizes frontmatter tag array safely.
     */
    static normalizeTags(tags: unknown): string[] {
        if (!Array.isArray(tags)) return [];
        return tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0);
    }

    /**
     * Generates a fallback title from the slug if title is missing.
     */
    static formatFallbackTitle(slug: string): string {
        return slug.replace(/[-_]+/g, " ").trim();
    }

    /**
     * Sorts posts chronologically with newest posts first.
     */
    static sortPostsNewestFirst(posts: BlogPostMeta[]): BlogPostMeta[] {
        return [...posts].sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            const timeA = new Date(a.date).getTime();
            const timeB = new Date(b.date).getTime();
            if (Number.isNaN(timeA)) return 1;
            if (Number.isNaN(timeB)) return -1;
            return timeB - timeA;
        });
    }
}

function createPostMeta(slug: string, data: Record<string, unknown>, content: string): BlogPostMeta {
    return {
        slug,
        title:
            typeof data.title === "string" && data.title.trim().length > 0
                ? data.title
                : BlogUtils.formatFallbackTitle(slug),
        date: BlogUtils.formatDate(data.date) || (data.date ? String(data.date) : ""),
        description: typeof data.description === "string" ? data.description : "",
        tags: BlogUtils.normalizeTags(data.tags),
        readTime: BlogUtils.calculateReadTime(content),
    };
}

// ============================================================================
// 5. IN-MEMORY CACHING LAYER
// ============================================================================

export class BlogCache {
    private static postFullCache = new Map<string, CacheEntry<BlogPost>>();
    private static postMetaCache = new Map<string, CacheEntry<BlogPostMeta>>();
    private static slugsCache: CacheEntry<string[]> | null = null;
    private static allPostsCache: CacheEntry<BlogPostMeta[]> | null = null;

    static getSlugs(): string[] | null {
        if (!this.slugsCache) return null;
        if (Date.now() - this.slugsCache.timestamp > BLOG_CONFIG.cacheTtlMs) {
            this.slugsCache = null;
            return null;
        }
        return this.slugsCache.data;
    }

    static setSlugs(slugs: string[]): void {
        this.slugsCache = { data: slugs, timestamp: Date.now() };
    }

    static getFullPost(slug: string, currentMtimeMs?: number): BlogPost | null {
        const entry = this.postFullCache.get(slug);
        if (!entry) return null;
        if (currentMtimeMs !== undefined && entry.mtimeMs !== currentMtimeMs) {
            this.postFullCache.delete(slug);
            return null;
        }
        if (Date.now() - entry.timestamp > BLOG_CONFIG.cacheTtlMs) {
            this.postFullCache.delete(slug);
            return null;
        }
        return entry.data;
    }

    static setFullPost(slug: string, data: BlogPost, mtimeMs?: number): void {
        this.postFullCache.set(slug, { data, timestamp: Date.now(), mtimeMs });
    }

    static getPostMeta(slug: string, currentMtimeMs?: number): BlogPostMeta | null {
        const entry = this.postMetaCache.get(slug);
        if (!entry) return null;
        if (currentMtimeMs !== undefined && entry.mtimeMs !== currentMtimeMs) {
            this.postMetaCache.delete(slug);
            return null;
        }
        if (Date.now() - entry.timestamp > BLOG_CONFIG.cacheTtlMs) {
            this.postMetaCache.delete(slug);
            return null;
        }
        return entry.data;
    }

    static setPostMeta(slug: string, data: BlogPostMeta, mtimeMs?: number): void {
        this.postMetaCache.set(slug, { data, timestamp: Date.now(), mtimeMs });
    }

    static getAllPosts(): BlogPostMeta[] | null {
        if (!this.allPostsCache) return null;
        if (Date.now() - this.allPostsCache.timestamp > BLOG_CONFIG.cacheTtlMs) {
            this.allPostsCache = null;
            return null;
        }
        return this.allPostsCache.data;
    }

    static setAllPosts(posts: BlogPostMeta[]): void {
        this.allPostsCache = { data: posts, timestamp: Date.now() };
    }

    /**
     * Clears all cached in-memory blog items (useful for tests or on-demand revalidation).
     */
    static clear(): void {
        this.postFullCache.clear();
        this.postMetaCache.clear();
        this.slugsCache = null;
        this.allPostsCache = null;
        logger.debug("Blog cache cleared");
    }
}

// ============================================================================
// 6. MARKDOWN COMPILER ENGINE
// ============================================================================

class MarkdownEngine {
    private static isConfigured = false;

    private static configure(): void {
        if (this.isConfigured) return;
        marked.setOptions({
            gfm: true,
            breaks: true,
        });
        this.isConfigured = true;
    }

    static async compile(content: string, slug?: string): Promise<string> {
        this.configure();
        try {
            return await marked.parse(content);
        } catch (error) {
            logger.error(`Markdown rendering failed for post: ${slug ?? "unknown"}`, error);
            // Safe fallback to plain text rather than throwing unhandled runtime error
            return `<p>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
        }
    }
}

// ============================================================================
// 7. PUBLIC SERVICE API
// ============================================================================

/**
 * Returns all post slugs from the /posts directory.
 * Preserves public signature: export function getPostSlugs(): string[]
 */
export function getPostSlugs(): string[] {
    const cached = BlogCache.getSlugs();
    if (cached) {
        return cached;
    }

    if (!fs.existsSync(BLOG_CONFIG.postsDirectory)) {
        logger.warn(`Posts directory not found at: ${BLOG_CONFIG.postsDirectory}`);
        return [];
    }

    try {
        const files = fs.readdirSync(BLOG_CONFIG.postsDirectory);
        const slugs = files
            .filter((file) => file.endsWith(BLOG_CONFIG.fileExtension))
            .map((file) => file.replace(/\.md$/, ""));

        BlogCache.setSlugs(slugs);
        logger.debug(`Loaded ${slugs.length} post slug(s) from disk`);
        return slugs;
    } catch (error) {
        logger.error("Failed to read posts directory", error);
        return [];
    }
}

/**
 * Loads a single blog post by its slug, including frontmatter and rendered HTML.
 * Preserves public signature: export async function getPostBySlug(slug: string): Promise<BlogPost | null>
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!BlogUtils.isValidSlug(slug)) {
        logger.warn(`Invalid slug requested: ${String(slug)}`);
        return null;
    }

    const filePath = path.join(BLOG_CONFIG.postsDirectory, `${slug}${BLOG_CONFIG.fileExtension}`);

    let mtimeMs: number | undefined;
    try {
        if (!fs.existsSync(filePath)) {
            logger.debug(`Post file does not exist: ${filePath}`);
            return null;
        }
        const stats = fs.statSync(filePath);
        mtimeMs = stats.mtimeMs;
    } catch (error) {
        logger.error(`Failed to stat post file for slug '${slug}'`, error);
        return null;
    }

    // Check high-speed in-memory cache
    const cachedPost = BlogCache.getFullPost(slug, mtimeMs);
    if (cachedPost) {
        logger.debug(`Cache hit for post: ${slug}`);
        return cachedPost;
    }

    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);
        const meta = createPostMeta(slug, data, content);
        const html = await MarkdownEngine.compile(content, slug);
        const post: BlogPost = { ...meta, content, html };

        BlogCache.setFullPost(slug, post, mtimeMs);
        // Also seed metadata cache to accelerate subsequent list queries
        BlogCache.setPostMeta(slug, meta, mtimeMs);

        logger.debug(`Compiled and cached post: ${slug}`);
        return post;
    } catch (error) {
        logger.error(`Failed to load and parse post '${slug}'`, error);
        return null;
    }
}

/**
 * Loads metadata for all blog posts, sorted chronologically with newest first.
 * Preserves public signature: export async function getAllPosts(): Promise<BlogPostMeta[]>
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
    const cachedAll = BlogCache.getAllPosts();
    if (cachedAll) {
        logger.debug("Cache hit for getAllPosts");
        return cachedAll;
    }

    const slugs = getPostSlugs();
    const posts: BlogPostMeta[] = [];

    for (const slug of slugs) {
        if (!BlogUtils.isValidSlug(slug)) continue;

        const filePath = path.join(BLOG_CONFIG.postsDirectory, `${slug}${BLOG_CONFIG.fileExtension}`);
        let mtimeMs: number | undefined;

        try {
            if (!fs.existsSync(filePath)) continue;
            const stats = fs.statSync(filePath);
            mtimeMs = stats.mtimeMs;
        } catch {
            continue;
        }

        // Check if metadata is already cached
        const cachedMeta = BlogCache.getPostMeta(slug, mtimeMs);
        if (cachedMeta) {
            posts.push(cachedMeta);
            continue;
        }

        try {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data, content } = matter(fileContent);
            const meta = createPostMeta(slug, data, content);

            BlogCache.setPostMeta(slug, meta, mtimeMs);
            posts.push(meta);
        } catch (error) {
            logger.error(`Error reading frontmatter for slug: ${slug}`, error);
            // Fault isolation: skip corrupt post rather than crashing the entire blog list
            continue;
        }
    }

    const sortedPosts = BlogUtils.sortPostsNewestFirst(posts);
    BlogCache.setAllPosts(sortedPosts);

    logger.debug(`Loaded and sorted ${sortedPosts.length} post(s)`);
    return sortedPosts;
}

/**
 * Explicit helper to clear the blog cache on demand.
 */
export function clearBlogCache(): void {
    BlogCache.clear();
}
