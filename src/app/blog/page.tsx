import Link from "next/link";
import { getAllPosts } from "../../lib/blog";

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="w-full max-w-[50rem] border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] px-5 py-7 sm:p-10 md:p-12 shadow-2xl backdrop-blur-[2px] transform-gpu transition-colors duration-300">
            <header className="flex flex-col gap-3">
                <p className="font-geistMono text-[13px] sm:text-[14px] lowercase leading-relaxed tracking-[0.02em] opacity-60">
                    observations & engineering.
                    <span
                        aria-hidden="true"
                        className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
                    />
                </p>
                <h1 className="font-brodine text-[30px] sm:text-[38px] lg:text-[46px] font-bold tracking-tight text-foreground">
                    Writing
                </h1>
                <p className="font-geistSans text-[15px] sm:text-[16px] text-[var(--muted-color)] leading-relaxed max-w-[36rem]">
                    Notes, system architectures, and deep-dives on real-time systems, AI/ML models, and Python
                    automation.
                </p>
            </header>

            {posts.length === 0 ? (
                <div className="mt-12 sm:mt-16 py-10 sm:py-12 border border-dashed border-[color-mix(in_srgb,var(--foreground-color)_15%,transparent)] text-center font-geistMono">
                    <p className="text-[14px] opacity-70">No posts found.</p>
                    <p className="text-[12px] opacity-40 mt-1">
                        Add a{" "}
                        <code className="bg-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)] px-1.5 py-0.5">
                            .md
                        </code>{" "}
                        file in the{" "}
                        <code className="bg-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)] px-1.5 py-0.5">
                            posts/
                        </code>{" "}
                        directory to publish.
                    </p>
                </div>
            ) : (
                <div className="mt-10 sm:mt-12 flex flex-col divide-y divide-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] border-y border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]">
                    {posts.map((post) => (
                        <article key={post.slug} className="py-6 sm:py-8 group">
                            <Link href={`/blog/${post.slug}`} prefetch={true} className="block outline-none">
                                <div className="flex items-center gap-2.5 font-geistMono text-[12px] opacity-50 mb-2">
                                    <time dateTime={post.date}>{post.date}</time>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="font-brodine text-[20px] sm:text-[23px] lg:text-[26px] font-semibold text-foreground underline decoration-[color-mix(in_srgb,var(--foreground-color)_25%,transparent)] decoration-1 underline-offset-[5px] transition-all duration-150 group-hover:decoration-foreground leading-snug">
                                    {post.title}
                                </h2>
                                {post.description && (
                                    <p className="mt-2 font-geistSans text-[14px] sm:text-[15px] text-[var(--muted-color)] leading-relaxed line-clamp-2">
                                        {post.description}
                                    </p>
                                )}
                                {post.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
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
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
