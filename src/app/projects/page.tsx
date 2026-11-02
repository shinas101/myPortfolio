"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { finishTransition, pushWithTransition } from "../../lib/view-transition";
import KoiPond from "../components/koi-pond/koi-pond";
import TopNav from "../components/top-nav";
import { TechIcon } from "../components/tech-icon";
import { isExternal, projectHref, projectsByDate, type Project } from "../data/projects";

export default function ProjectsRoute() {
    useEffect(() => {
        finishTransition();
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-background text-foreground">
            <KoiPond className="fixed inset-0 z-0 h-full w-full" />
            <TopNav />
            <main className="relative z-10 mx-auto mt-16 flex w-full max-w-[56rem] flex-col gap-8 border-x border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] px-5 py-7 shadow-2xl backdrop-blur-[2px] transition-colors duration-300 sm:mt-20 sm:px-8 sm:py-10">
                <header className="flex flex-col gap-3">
                    <p className="font-geistMono text-[13px] leading-relaxed tracking-[0.02em] opacity-60 sm:text-[14px]">
                        selected work &amp; experiments.
                    </p>
                    <h1 className="font-brodine text-[30px] font-bold tracking-tight text-foreground sm:text-[38px] lg:text-[46px]">
                        Projects
                    </h1>
                    <p className="max-w-[36rem] font-geistSans text-[15px] leading-relaxed text-[var(--muted-color)] sm:text-[16px]">
                        A collection of software, AI, and engineering projects.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {projectsByDate.map((project, index) => (
                        <ProjectCard key={project.slug} project={project} priority={index < 2} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function ProjectCard({ project, priority }: { project: Project; priority: boolean }) {
    const router = useRouter();
    const href = projectHref(project);
    const external = href !== undefined && isExternal(href);
    const label = external ? "visit project ↗" : "view case study →";
    const openProject = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (external || !href || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
            return;
        event.preventDefault();
        pushWithTransition(router, href);
    };

    return (
        <article className="group flex flex-col justify-between border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_3%,transparent)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] sm:p-4">
            <div>
                <ProjectLink href={href} external={external} label={project.name} onClick={openProject}>
                    <span className="relative mb-3 block aspect-[16/9] w-full overflow-hidden rounded border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-black/40">
                        <Image
                            src={project.thumb}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            quality={90}
                            fetchPriority={priority ? "high" : undefined}
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        {href && (
                            <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/20 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <span className="font-geistMono text-[11px] text-white/90">{label}</span>
                                <span className="font-geistMono text-[10px] text-white/70">{project.year}</span>
                            </span>
                        )}
                    </span>
                </ProjectLink>

                <div className="mb-2 flex items-start justify-between gap-2">
                    <ProjectLink
                        href={href}
                        external={external}
                        label={project.name}
                        onClick={openProject}
                        className="font-semibold leading-tight tracking-tight text-foreground hover:underline"
                    >
                        {project.name}
                    </ProjectLink>
                    <span className="shrink-0 font-geistMono text-[11px] text-[var(--muted-color)]">
                        {project.year}
                    </span>
                </div>

                <p className="mb-3 text-[12px] leading-relaxed text-foreground/70 sm:text-[12.5px]">
                    {project.description}
                </p>

                {(project.github || project.live) && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${project.name} source code on GitHub (opens in a new tab)`}
                                className="inline-flex items-center gap-1.5 border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_4%,transparent)] px-2.5 py-1 font-geistMono text-[10px] text-foreground/80 transition-colors hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_9%,transparent)] hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
                            >
                                <TechIcon name="github" size={12} useBrandColor={false} />
                                GitHub
                                <span aria-hidden="true">↗</span>
                            </a>
                        )}
                        {project.live && (
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${project.name} live project (opens in a new tab)`}
                                className="inline-flex items-center gap-1.5 border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_4%,transparent)] px-2.5 py-1 font-geistMono text-[10px] text-foreground/80 transition-colors hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_9%,transparent)] hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
                            >
                                Live project
                                <span aria-hidden="true">↗</span>
                            </a>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)] pt-2">
                {project.tech.map((technology) => (
                    <span
                        key={technology}
                        className="border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] px-2 py-0.5 font-geistMono text-[10px] opacity-80 transition-opacity group-hover:opacity-100 sm:text-[10.5px]"
                    >
                        {technology}
                    </span>
                ))}
            </div>
        </article>
    );
}

function ProjectLink({
    href,
    external,
    label,
    onClick,
    className,
    children,
}: {
    href?: string;
    external: boolean;
    label: string;
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
    children: React.ReactNode;
}) {
    if (!href) return <>{children}</>;

    const classes = className ?? "block outline-none focus-visible:underline";
    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}, opens in a new tab`}
                className={classes}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} aria-label={label} className={classes} onClick={onClick}>
            {children}
        </Link>
    );
}
