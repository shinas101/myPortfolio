import Link from "next/link";
import { getAllPosts } from "../../lib/blog";

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="w-full max-w-[50rem] border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] px-5 py-7 sm:p-10 md:p-12 shadow-2xl backdrop-blur-[2px] transform-gpu transition-colors duration-300">
            {/* Header & Status Indicator */}
            <header className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-geistMono text-[12px] sm:text-[13px] tracking-wider uppercase text-amber-500/90 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span>Under Construction // Coming Soon</span>
                    <span
                        aria-hidden="true"
                        className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.1em] animate-blink bg-amber-500 motion-reduce:animate-none"
                    />
                </div>

                <h1 className="font-brodine text-[32px] sm:text-[40px] lg:text-[48px] font-bold tracking-tight text-foreground">
                    Engineering Writing
                </h1>

                <p className="font-geistSans text-[15px] sm:text-[16px] text-[var(--muted-color)] leading-relaxed max-w-[38rem]">
                    I am currently drafting comprehensive technical writeups and architecture deep-dives covering
                    real-time WebRTC voice pipelines, zero-API-cost local NLP summarization, and distributed caching
                    systems.
                </p>
            </header>

            {/* Coming Soon Hero Banner */}
            <div className="mt-8 p-6 sm:p-8 rounded border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_3%,transparent)] flex flex-col gap-4 font-geistMono">
                <div className="flex items-center justify-between gap-2 border-b border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] pb-3">
                    <span className="text-[12px] uppercase tracking-wider text-foreground/80 font-semibold">
                        Upcoming Technical Case Studies
                    </span>
                    <span className="text-[11px] text-amber-500/80 font-mono">Q1 2026</span>
                </div>

                <ul className="flex flex-col gap-3.5 text-[13px] sm:text-[14px] text-foreground/85">
                    <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold">01.</span>
                        <div>
                            <span className="text-foreground font-medium">
                                Real-Time Voice AI with LiveKit &amp; Silero VAD
                            </span>
                            <p className="text-[12px] text-[var(--muted-color)] mt-0.5">
                                Sub-second audio streaming, instant speech barge-in interruption, and pgvector patient
                                memory.
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold">02.</span>
                        <div>
                            <span className="text-foreground font-medium">Sub-Millisecond 302 Redirection Engines</span>
                            <p className="text-[12px] text-[var(--muted-color)] mt-0.5">
                                Caching high-frequency URL lookups with in-memory Redis, Drizzle ORM failovers, and
                                Better Auth.
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold">03.</span>
                        <div>
                            <span className="text-foreground font-medium">
                                Zero-API-Cost Edge Summarization via T5-Small
                            </span>
                            <p className="text-[12px] text-[var(--muted-color)] mt-0.5">
                                Local PyTorch inference, bilingual Luhn extraction for Malayalam, and SQLite WAL
                                caching.
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold">04.</span>
                        <div>
                            <span className="text-foreground font-medium">
                                Multimodal RAG with FAISS &amp; Gemini 2.5 Flash Vision
                            </span>
                            <p className="text-[12px] text-[var(--muted-color)] mt-0.5">
                                Extracting tables and diagrams at native 300 DPI with real-time SSE token streaming.
                            </p>
                        </div>
                    </li>
                </ul>

                <div className="mt-2 pt-4 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] flex flex-wrap items-center justify-between gap-3 text-[12px]">
                    <span className="text-[var(--muted-color)]">Want to explore active systems right now?</span>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/projects"
                            className="text-foreground hover:underline underline-offset-4 font-medium"
                        >
                            View Projects →
                        </Link>
                        <a
                            href="https://github.com/shinas101"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground/70 hover:text-foreground hover:underline underline-offset-4"
                        >
                            GitHub Profile ↗
                        </a>
                    </div>
                </div>
            </div>

            {/* Collapsible / Preview drafts section */}
            {posts.length > 0 && (
                <div className="mt-10 sm:mt-12 pt-8 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-geistMono text-[12px] uppercase tracking-wider text-[var(--muted-color)] font-semibold">
                            Preview Drafts &amp; Architecture Notes ({posts.length})
                        </h2>
                        <span className="text-[11px] font-mono text-[var(--muted-color)] opacity-60">draft state</span>
                    </div>

                    <div className="flex flex-col divide-y divide-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)]">
                        {posts.map((post) => (
                            <article key={post.slug} className="py-4 sm:py-5 group">
                                <Link href={`/blog/${post.slug}`} prefetch={true} className="block outline-none">
                                    <div className="flex items-center gap-2 font-geistMono text-[11px] opacity-50 mb-1.5">
                                        <time dateTime={post.date}>{post.date}</time>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="font-brodine text-[17px] sm:text-[19px] font-semibold text-foreground group-hover:underline underline-offset-4 leading-snug">
                                        {post.title}
                                    </h3>
                                    {post.description && (
                                        <p className="mt-1 font-geistSans text-[13px] text-[var(--muted-color)] leading-relaxed line-clamp-1">
                                            {post.description}
                                        </p>
                                    )}
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
