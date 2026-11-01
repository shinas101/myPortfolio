"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Cited from "./citation";
import PixelIcon, { type PixelIconName } from "./pixel-icon";
import TechIcon, { type TechIconName } from "./tech-icon";

const SOCIALS: { label: string; href: string; icon: TechIconName }[] = [
    { label: "github", href: "https://github.com/shinas101", icon: "github" },
    { label: "linkedin", href: "https://www.linkedin.com/in/shinas-samoon", icon: "linkedin" },
    { label: "email", href: "mailto:shinassamooncvd@gmail.com", icon: "email" },
    { label: "resume", href: "/resume.pdf", icon: "resume" },
];

const UNDERLINE =
    "underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

interface SkillItem {
    id: string;
    title: string;
    icon: PixelIconName;
    summary: string;
    tags: string[];
}

const SKILLS: SkillItem[] = [
    {
        id: "ai-ml",
        title: "AI/ML & Intelligent Systems",
        icon: "robot",
        summary: "Multimodal RAG architectures, real-time voice agents, and prompt evaluation pipelines.",
        tags: ["LangChain", "PyTorch", "Gemini 2.5", "LiveKit Voice", "FAISS", "Scikit-Learn"],
    },
    {
        id: "backend",
        title: "Backend & Distributed Systems",
        icon: "database",
        summary: "High-throughput asynchronous APIs, resilient connection pooling, and fault-tolerant failovers.",
        tags: ["FastAPI", "Async Python", "PostgreSQL", "Redis", "asyncpg", "REST APIs"],
    },
    {
        id: "automation",
        title: "Web Scraping & Data Pipelines",
        icon: "bug",
        summary:
            "Multi-source web extractors across 15+ streaming sources, rotating proxy evasion, and token resolution.",
        tags: ["Playwright", "BeautifulSoup", "RapidFuzz", "Proxy Pools", "Anti-Bot Evasion", "ETL"],
    },
    {
        id: "fullstack",
        title: "Full-Stack & Web Architecture",
        icon: "browser",
        summary:
            "Performant responsive web applications, Neo-Brutalist styles, interactive state, and fluid micro-interactions.",
        tags: ["Next.js", "React", "TypeScript", "TailwindCSS", "Motion", "Streamlit"],
    },
    {
        id: "hardware-iot",
        title: "Hardware, IoT & Embedded Systems",
        icon: "cog",
        summary:
            "Real-time indoor activity monitoring, UWB radar telemetry, sensor integration, and fall detection ML.",
        tags: ["ESP32", "ESP8266", "UWB Radar", "Arduino IDE", "Activity Classification", "Sensors"],
    },
    {
        id: "rag-agents",
        title: "RAG & Autonomous AI Agents",
        icon: "star",
        summary:
            "Document chunking pipelines, semantic vector search, Claude/Gemini integration, and grounded synthesis.",
        tags: ["RAG Chatbot", "FAISS", "Vector DBs", "Prompt Engineering", "Claude", "AI Agents"],
    },
    {
        id: "databases-caching",
        title: "Databases & Caching Layers",
        icon: "database",
        summary: "Multi-tier caching, TTL-based cache layers, relational schemas, and high-throughput document stores.",
        tags: ["MongoDB", "PostgreSQL", "Supabase", "Neon", "Redis Caching", "SQL"],
    },
    {
        id: "devops-testing",
        title: "Software Engineering & DevOps",
        icon: "box",
        summary: "Containerization, headless browser test suites, automated CI/CD workflows, and API profiling.",
        tags: ["Docker", "Linux / Bash", "pytest", "Postman", "Git / GitHub", "SDLC"],
    },
];

interface ToolItem {
    name: string;
    category: string;
    icon: TechIconName;
    detail: string;
}

const TOOLS_ROW_1: ToolItem[] = [
    { name: "Python", category: "Core", icon: "python", detail: "Async & Automation" },
    { name: "FastAPI", category: "Backend", icon: "fastapi", detail: "High-Throughput APIs" },
    { name: "Next.js", category: "Frontend", icon: "nextjs", detail: "App Router & SSR" },
    { name: "React", category: "Frontend", icon: "react", detail: "Component UI" },
    { name: "TypeScript", category: "Language", icon: "typescript", detail: "Type Systems" },
    { name: "PyTorch", category: "AI/ML", icon: "pytorch", detail: "Tensors & Neural Nets" },
    { name: "LangChain", category: "AI/RAG", icon: "langchain", detail: "RAG Pipelines" },
    { name: "Google Gemini", category: "AI/LLM", icon: "gemini", detail: "Multimodal Models" },
    { name: "Claude AI", category: "AI/LLM", icon: "claude", detail: "Agentic Reasoning" },
    { name: "PostgreSQL", category: "Database", icon: "postgresql", detail: "Relational & Vector" },
    { name: "MongoDB", category: "NoSQL", icon: "mongodb", detail: "Document Caching" },
    { name: "Redis", category: "Cache", icon: "redis", detail: "In-Memory & TTL" },
];

const TOOLS_ROW_2: ToolItem[] = [
    { name: "Docker", category: "DevOps", icon: "docker", detail: "Containers & CI/CD" },
    { name: "Playwright", category: "Scraping", icon: "playwright", detail: "Headless Evasion" },
    { name: "Selenium", category: "Scraping", icon: "selenium", detail: "Web Automation" },
    { name: "Supabase", category: "BaaS", icon: "supabase", detail: "Postgres & Auth" },
    { name: "Tailwind CSS", category: "Styling", icon: "tailwindcss", detail: "Design Systems" },
    { name: "ESP32", category: "IoT", icon: "esp32", detail: "Embedded & UWB" },
    { name: "Arduino", category: "IoT", icon: "arduino", detail: "Microcontrollers" },
    { name: "Streamlit", category: "UI/ML", icon: "streamlit", detail: "Rapid Prototyping" },
    { name: "Linux", category: "System", icon: "linux", detail: "CLI & Server Ops" },
    { name: "Git & GitHub", category: "Version", icon: "git", detail: "Workflows & Review" },
    { name: "Postman", category: "API Testing", icon: "postman", detail: "Endpoint Profiling" },
    { name: "pytest", category: "Testing", icon: "pytest", detail: "Unit & Integration" },
    { name: "Django", category: "Backend", icon: "django", detail: "Web Framework" },
    { name: "Flask", category: "Backend", icon: "flask", detail: "Microservices" },
    { name: "SQLite", category: "Database", icon: "sqlite", detail: "Local Failover" },
];

interface FrontProject {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    year: string;
    live?: string;
    github: string;
    tools: string[];
}

const FEATURED_PROJECTS: FrontProject[] = [
    {
        id: "clinical-voice-ai",
        name: "Clinical Voice AI (Mia)",
        slug: "clinical-voice-ai",
        description:
            "Voice-driven clinical receptionist with LiveKit WebRTC, Silero VAD barge-in, GPT-4o safety triage, pgvector semantic memory, and dual-database failover.",
        image: "/projects/clinical-voice-ai/clinical-voice-ai-hero.webp",
        year: "2025",
        github: "https://github.com/shinas101/Ai-Receptionist",
        tools: ["LiveKit", "WebRTC", "Silero VAD", "OpenAI GPT-4o", "PostgreSQL", "pgvector", "aiohttp", "Docker"],
    },
    {
        id: "news-flashcard",
        name: "News FlipCard",
        slug: "news-flashcard",
        description:
            "Tactile 3D card-stack news reader with 100% local NLP summarization (PyTorch T5-small & Luhn algorithm), SQLite WAL SWR caching, and universal embed support.",
        image: "/projects/news-flashcard/news-flashcard-cover.webp",
        year: "2025",
        live: "https://news-flashcard-9ad00f891023.herokuapp.com",
        github: "https://github.com/shinas101/NewsFlashcard",
        tools: ["FastAPI", "PyTorch", "HuggingFace T5", "Next.js 15", "SQLite WAL", "Selectolax"],
    },
    {
        id: "pdf-chatbot",
        name: "PDF RAG Chatbot",
        slug: "pdf-chatbot",
        description:
            "Multimodal RAG and 2-tier Vision OCR engine with PyMuPDF figure extraction, Google Gemini 2.5, FAISS vector index, and SSE streaming.",
        image: "/projects/pdf-chatbot/pdf-chatbot-hero.webp",
        year: "2025",
        github: "https://github.com/shinas101/pdf-rag-chatbot",
        tools: ["FastAPI", "Gemini 2.5", "LangChain", "FAISS", "PyMuPDF", "pytesseract", "SSE", "Python"],
    },
    {
        id: "uwb-elderly-care",
        name: "UWB Elderly Care Monitoring",
        slug: "uwb-elderly-care",
        description:
            "Real-time indoor activity monitoring and fall detection system utilizing UWB transceivers, ESP32 microcontrollers, Python ML, and Telegram emergency alerts.",
        image: "/projects/kairos/kairos-hero.webp",
        year: "2024",
        github: "https://github.com/shinas101",
        tools: ["Python", "ESP32", "UWB Radar", "Machine Learning", "Telegram API", "IoT"],
    },
];

const Socials = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center gap-6 sm:gap-8 flex-wrap ${className || ""}`}>
        {SOCIALS.map(({ label, href, icon }) => (
            <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="group/social inline-flex items-center gap-2 text-foreground/75 hover:text-foreground focus-visible:text-foreground transition-colors duration-150 outline-none"
            >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center group-hover/social:scale-115 transition-transform duration-150">
                    <TechIcon name={icon} size={15} />
                </span>
                <span className={`${UNDERLINE} text-[13px] sm:text-[14px]`}>{label}</span>
            </a>
        ))}
    </div>
);

const FrontPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const isPastThreshold = scrollRef.current.scrollTop > 24;
        setScrolled((prev) => (prev !== isPastThreshold ? isPastThreshold : prev));
    }, []);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-6 overflow-hidden">
            <motion.div
                className="relative flex flex-col w-full max-w-[50rem] max-h-[calc(100dvh-5.5rem)] sm:max-h-[calc(100dvh-7rem)] border-x border-y-0 border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] backdrop-blur-[2px] transform-gpu transition-colors duration-300 font-geistMono text-[14px] sm:text-[15px] leading-[1.6] sm:leading-[max(22px,3vh)] text-foreground overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_48px,black_calc(100%-48px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_48px,black_calc(100%-48px),transparent_100%)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                {/* Scrollable interior */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="overflow-y-auto px-5 pt-12 pb-16 sm:px-9 sm:pt-14 sm:pb-20 md:px-11 thin-scrollbar flex flex-col gap-8"
                >
                    {/* Header & Bio Section */}
                    <section className="cited-prose flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                                <motion.span
                                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="text-amber-500/80 inline-flex"
                                ></motion.span>
                                <h1 className="text-[17px] sm:text-[19px] font-semibold text-foreground tracking-tight">
                                    Hi, I&apos;m Shinas Samoon.
                                </h1>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] opacity-75">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>Open to SWE &amp; AI/ML roles</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5 sm:gap-3 text-foreground/90">
                            <p>
                                Software Engineer with hands-on experience in Python development, automation, and AI/ML
                                applications.
                            </p>
                            <p>
                                Previously, AI/ML Intern @ <Cited source="ictk">ICT Academy of Kerala</Cited>.
                            </p>
                            <p>
                                B.Tech in ECE graduate from <Cited source="lbs">L.B.S College of Engineering</Cited>.
                                Building <Cited source="clinical">Clinical Voice AI</Cited>,{" "}
                                <Cited source="flashnews">News FlipCard</Cited>, and{" "}
                                <Cited source="pdfchatbot">PDFChatbot</Cited>.
                            </p>
                        </div>

                        <Socials className="mt-2 pt-1" />
                    </section>

                    {/* Divider */}
                    <div className="border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]" />

                    {/* Featured Projects Section */}
                    <section className="flex flex-col gap-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-foreground font-semibold text-[14px] sm:text-[15px]">
                                <motion.span
                                    whileHover={{ scale: 1.25, rotate: 12 }}
                                    className="inline-flex text-foreground"
                                >
                                    <PixelIcon name="rocket" size={17} />
                                </motion.span>
                                <h2>Featured Projects</h2>
                            </div>
                            <Link
                                href="/projects"
                                className="text-[11px] font-mono opacity-60 hover:opacity-100 flex items-center gap-1 transition-opacity"
                            >
                                <span>all projects (4)</span>
                                <span>→</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {FEATURED_PROJECTS.map((project) => {
                                const liveHref = project.live || project.github;
                                const githubHref = project.github;
                                const hasCustomLive = Boolean(project.live);

                                return (
                                    <motion.div
                                        key={project.id}
                                        whileHover={{ y: -2 }}
                                        className="group flex flex-col justify-between p-3.5 sm:p-4 border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_3%,transparent)] hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] transition-all duration-200"
                                    >
                                        <div>
                                            {/* Project Image */}
                                            <Link
                                                href={`/projects/${project.slug}`}
                                                className="relative block w-full aspect-[16/9] overflow-hidden rounded border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-black/40 mb-3 group/img cursor-pointer"
                                            >
                                                <Image
                                                    src={project.image}
                                                    alt={project.name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 50vw"
                                                    className="object-cover object-top transition-transform duration-300 group-hover/img:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-end justify-between p-2.5">
                                                    <span className="text-[11px] font-mono text-white/90 flex items-center gap-1">
                                                        <span>view case study</span>
                                                        <span>→</span>
                                                    </span>
                                                    <span className="text-[10px] font-mono text-white/70">
                                                        {project.year}
                                                    </span>
                                                </div>
                                            </Link>

                                            {/* Title & Live / GitHub Links */}
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <Link
                                                    href={`/projects/${project.slug}`}
                                                    className="font-semibold text-[14px] sm:text-[15px] tracking-tight leading-tight text-foreground hover:underline decoration-1 underline-offset-4"
                                                >
                                                    {project.name}
                                                </Link>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {/* Live Link (if given, else same as github) */}
                                                    <a
                                                        href={liveHref}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={
                                                            hasCustomLive
                                                                ? "Live Application"
                                                                : "GitHub Repository (Live link)"
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border border-[color-mix(in_srgb,var(--foreground-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_5%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] hover:border-foreground/40 text-foreground transition-all rounded outline-none"
                                                    >
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                                        </span>
                                                        <span>live</span>
                                                        <span className="text-[10px] opacity-60">↗</span>
                                                    </a>

                                                    {/* GitHub Link */}
                                                    <a
                                                        href={githubHref}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="View Source on GitHub"
                                                        className="inline-flex items-center justify-center h-6 w-6 rounded border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_4%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] text-foreground/80 hover:text-foreground transition-all"
                                                    >
                                                        <TechIcon name="github" size={13} />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Small Description */}
                                            <p className="text-[12px] sm:text-[12.5px] leading-relaxed opacity-70 mb-3">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Tools, Language, Framework Tags */}
                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)]">
                                            {project.tools.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] sm:text-[10.5px] font-mono px-2 py-0.5 border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] opacity-80 group-hover:opacity-100 transition-opacity"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]" />

                    {/* Skills Normal Grid Section */}
                    <section className="flex flex-col gap-3.5">
                        <div className="flex items-center gap-2 text-foreground font-semibold text-[14px] sm:text-[15px]">
                            <motion.span
                                whileHover={{ scale: 1.25, rotate: 10 }}
                                className="inline-flex text-foreground"
                            >
                                <PixelIcon name="code" size={18} />
                            </motion.span>
                            <h2>Skills &amp; Capabilities</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {SKILLS.map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    whileHover={{ y: -2 }}
                                    className="group flex flex-col justify-between p-3.5 sm:p-4 border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_3%,transparent)] hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] transition-all duration-200"
                                >
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <motion.div
                                                whileHover={{ scale: 1.25, rotate: [0, -8, 8, 0] }}
                                                transition={{ duration: 0.3 }}
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[color-mix(in_srgb,var(--foreground-color)_14%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_8%,transparent)] text-foreground"
                                            >
                                                <PixelIcon name={skill.icon} size={16} />
                                            </motion.div>
                                            <h3 className="font-semibold text-[13px] sm:text-[14px] tracking-tight leading-tight">
                                                {skill.title}
                                            </h3>
                                        </div>
                                        <p className="text-[12px] sm:text-[12.5px] leading-relaxed opacity-70 mb-3">
                                            {skill.summary}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {skill.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] sm:text-[10.5px] font-mono px-2 py-0.5 border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--background-color)_40%,transparent)] opacity-80 group-hover:opacity-100 transition-opacity"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Tools & Tech Stack Marquee Section (Using Native Icons) */}
                    <section className="flex flex-col gap-3.5 group/tools">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-foreground font-semibold text-[14px] sm:text-[15px]">
                                <motion.span
                                    whileHover={{ scale: 1.25, rotate: 180 }}
                                    transition={{ duration: 0.4 }}
                                    className="inline-flex text-foreground"
                                >
                                    <TechIcon name="git" size={17} />
                                </motion.span>
                                <h2>Tools &amp; Tech Stack</h2>
                            </div>
                            <span className="text-[11px] opacity-40 font-mono hidden sm:inline">hover to pause</span>
                        </div>

                        {/* Dual-row smooth slow marquee moving from right to left */}
                        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_28px,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_28px,black_calc(100%-28px),transparent_100%)] flex flex-col gap-2.5 py-1">
                            {/* Row 1 */}
                            <div className="flex w-max gap-2.5 animate-marquee-slow group-hover/tools:[animation-play-state:paused] hover:[animation-play-state:paused]">
                                {[...TOOLS_ROW_1, ...TOOLS_ROW_1].map((tool, index) => (
                                    <div
                                        key={`row1-${tool.name}-${index}`}
                                        className="group/tool flex items-center gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_3%,transparent)] hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] transition-all duration-200 shrink-0 select-none cursor-default"
                                    >
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_7%,transparent)] text-foreground group-hover/tool:scale-110 transition-transform duration-200">
                                            <TechIcon name={tool.icon} size={15} />
                                        </div>
                                        <div className="flex flex-col min-w-0 pr-1">
                                            <span className="font-semibold text-[12px] sm:text-[13px] tracking-tight leading-tight truncate">
                                                {tool.name}
                                            </span>
                                            <span className="text-[10px] sm:text-[10.5px] opacity-55 truncate leading-tight mt-0.5 font-mono">
                                                {tool.category} · {tool.detail}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Row 2 */}
                            <div className="flex w-max gap-2.5 animate-marquee-slow-alt group-hover/tools:[animation-play-state:paused] hover:[animation-play-state:paused]">
                                {[...TOOLS_ROW_2, ...TOOLS_ROW_2].map((tool, index) => (
                                    <div
                                        key={`row2-${tool.name}-${index}`}
                                        className="group/tool flex items-center gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_3%,transparent)] hover:border-[color-mix(in_srgb,var(--foreground-color)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)] transition-all duration-200 shrink-0 select-none cursor-default"
                                    >
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[color-mix(in_srgb,var(--foreground-color)_12%,transparent)] bg-[color-mix(in_srgb,var(--foreground-color)_7%,transparent)] text-foreground group-hover/tool:scale-110 transition-transform duration-200">
                                            <TechIcon name={tool.icon} size={15} />
                                        </div>
                                        <div className="flex flex-col min-w-0 pr-1">
                                            <span className="font-semibold text-[12px] sm:text-[13px] tracking-tight leading-tight truncate">
                                                {tool.name}
                                            </span>
                                            <span className="text-[10px] sm:text-[10.5px] opacity-55 truncate leading-tight mt-0.5 font-mono">
                                                {tool.category} · {tool.detail}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Project Highlights / Footer Quick Jump */}
                    <section className="flex flex-col gap-2 pt-1 border-t border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] opacity-75">
                            <span>Featured work:</span>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/projects"
                                    className={`${UNDERLINE} inline-flex items-center gap-1.5 opacity-80 hover:opacity-100`}
                                >
                                    <PixelIcon name="rocket" size={13} />
                                    <span>all projects (4)</span>
                                </Link>
                                <span className="opacity-30">/</span>
                                <Link
                                    href="/blog"
                                    className={`${UNDERLINE} inline-flex items-center gap-1.5 opacity-80 hover:opacity-100`}
                                >
                                    <PixelIcon name="keyboard" size={13} />
                                    <span>blog writing</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Animated scroll prompt indicator at bottom */}
                <AnimatePresence>
                    {!scrolled && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.25 }}
                            className="pointer-events-none absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-mono text-foreground/75 bg-[color-mix(in_srgb,var(--background-color)_85%,transparent)] px-3 py-1 rounded-full border border-[color-mix(in_srgb,var(--foreground-color)_14%,transparent)] shadow-sm backdrop-blur-sm z-30"
                        >
                            <span>scroll for projects, skills &amp; tools</span>
                            <motion.span
                                animate={{ y: [0, 2.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                            >
                                ↓
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FrontPage;
