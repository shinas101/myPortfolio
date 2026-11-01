import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs } from "../../../lib/blog";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="w-full max-w-[50rem] border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] px-5 py-7 sm:p-10 md:p-12 shadow-2xl backdrop-blur-[2px] transform-gpu transition-colors duration-300">
            <div className="mb-6 sm:mb-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 font-geistMono text-[13px] opacity-60 hover:opacity-100 transition-opacity"
                >
                    ← all posts
                </Link>
            </div>

            <article>
                <header className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 font-geistMono text-[12px] sm:text-[13px] opacity-50 tabular-nums mb-3">
                        <time dateTime={post.date}>{post.date}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>

                    <h1 className="font-playfairDisplay text-[26px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-bold leading-[1.18] tracking-tight text-foreground">
                        {post.title}
                    </h1>

                    {post.description && (
                        <p className="mt-4 font-geistSans text-[15px] sm:text-[17px] text-[var(--muted-color)] leading-relaxed italic">
                            {post.description}
                        </p>
                    )}

                    {post.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="font-geistMono text-[11px] px-2.5 py-0.5 bg-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)] opacity-70"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <hr className="mt-8 border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)]" />
                </header>

                {/* Rendered Markdown Content */}
                <div
                    className="blog-prose"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                />

                {/* Article Footer */}
                <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-geistMono text-[13px]">
                        <div>
                            <p className="opacity-90 font-medium">Written by Shinas Samoon</p>
                            <p className="opacity-50 text-[12px] mt-0.5">Software Engineer — AI/ML & Python</p>
                        </div>
                        <Link
                            href="/blog"
                            className="opacity-60 hover:opacity-100 transition-opacity underline decoration-1 underline-offset-4"
                        >
                            ← Back to writing
                        </Link>
                    </div>
                </footer>
            </article>
        </div>
    );
}
