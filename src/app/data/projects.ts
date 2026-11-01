export type Project = {
    /** URL segment for the project's own page. */
    slug: string;
    index: string;
    name: string;
    description: string;
    tech: string[];
    year: string;
    /** Omit to show the project without sending anyone anywhere. */
    link?: string;
    /** Small raster preview, rendered from the original artwork. */
    thumb: string;
    /** A project with its own page on the site; its tiles link there instead of out. */
    page?: {
        tagline: string;
        /** The write-up under the tagline, so the page doesn't repeat it. */
        about: Prose;
        /** Omit for a project without a demo; the poster then stands alone as the lead image. */
        video?: string;
        poster: string;
        /** Wide banner across the top of the page, like a Notion cover. */
        cover?: string;
        /** 1200×630 card for link previews when the page is shared. */
        share?: string;
        /** How the project got here, as prose with the clips placed between paragraphs. */
        story?: StoryBlock[];
    };
};

/** Plain text with inline links. */
export type Prose = (string | { text: string; href: string })[];

/** A paragraph is plain text with inline links; a clip is a short muted video. */
export type StoryBlock =
    | { kind: "heading"; text: string }
    | { kind: "text"; parts: Prose }
    | { kind: "clip"; src: string; poster?: string; label: string }
    | { kind: "image"; src: string; alt: string; width: number; height: number }
    | { kind: "embed"; src: string; title: string; height?: number }
    /** `start` is the panel open before anyone interacts; lead with the strongest shot. */
    | { kind: "gallery"; title?: string; shots: Shot[]; start?: number };

/** A captioned still of the product, shown on its own or in a gallery grid. */
export type Shot = {
    /** Tight crop of the UI, for the swipeable cards on small screens. */
    src: string;
    /** The full 16:9 frame, for the accordion panels on desktop. */
    frame: string;
    alt: string;
    title: string;
    caption: string;
    width: number;
    height: number;
};

export const projects: Project[] = [
    {
        index: "01",
        slug: "clinical-voice-ai",
        name: "ABC Health Care — Clinical Voice AI",
        description:
            "Production-grade WebRTC virtual receptionist platform with LiveKit Agents, Silero VAD barge-in interruption, OpenAI GPT-4o clinical triage guardrails, 1536-d pgvector patient memory, and resilient dual-database failover.",
        tech: [
            "LiveKit Agents",
            "WebRTC",
            "Silero VAD",
            "OpenAI GPT-4o",
            "PostgreSQL",
            "pgvector",
            "aiohttp",
            "Nginx",
            "Docker",
        ],
        year: "2025",
        link: "https://github.com/shinas101/Ai-Receptionist",
        thumb: "/projects/clinical-voice-ai/clinical-voice-ai-preview.webp",
        page: {
            tagline: "Voice-driven clinical receptionist & medical triage platform with semantic patient memory.",
            about: [
                "Architected a production-grade, voice-driven virtual receptionist (Mia) and clinical scheduling system built with LiveKit Agents over WebRTC, delivering sub-second audio turnaround times without third-party SaaS silos.",
                "Integrated Silero VAD (Voice Activity Detection) running locally in streaming frames for instant human speech barge-in, immediately canceling in-flight text-to-speech when patients interrupt.",
                "Enforced clinical safety triage guardrails using prompt-engineered GPT-4o function calling: detects acute red-flag symptoms (chest pain, stroke signs) and halts booking to direct callers to emergency dispatch (112 / 108 / 911).",
                "Constructed 1536-dimensional semantic patient memory stored in PostgreSQL with pgvector, enabling the assistant to recall caller history, recurring medical preferences, and scheduling patterns via cosine similarity search.",
                "Architected a zero-configuration dual-database failover engine leveraging asyncpg connection pooling for PostgreSQL 16 with automatic fallback to an in-process SQLite buffer (clinic.db) to ensure continuous uptime during network disruptions.",
                "Hardened containerized infrastructure behind an Nginx ingress proxy featuring TLS 1.3 encryption, leaky-bucket rate limiting (2 req/s token minting, 10 req/s CRUD), dynamic CORS enforcement, and automated SAN SSL generation.",
            ],
            poster: "/projects/clinical-voice-ai/clinical-voice-ai-hero.webp",
            cover: "/projects/clinical-voice-ai/clinical-voice-ai-cover.webp",
            share: "/projects/clinical-voice-ai/clinical-voice-ai-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "Real-Time Telephony & Sub-Second Latency Pipeline",
                },
                {
                    kind: "text",
                    parts: [
                        "Medical receptionist workflows demand uninterrupted uptime and conversational voice cadence. By streaming WebRTC audio directly to LiveKit SFU workers and coupling Silero VAD with OpenAI GPT-4o function calling, Mia achieves sub-second conversational latency and never talks over patients.",
                    ],
                },
                {
                    kind: "heading",
                    text: "1536-Dimensional Semantic Memory with pgvector",
                },
                {
                    kind: "text",
                    parts: [
                        "Conversations automatically generate semantic patient profile memories stored as 1536-dimensional vector embeddings. When returning callers verify their phone number, historical clinical context and scheduling preferences are retrieved via vector cosine similarity and injected into the LLM context window.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Zero-Configuration Dual-Database Failover",
                },
                {
                    kind: "text",
                    parts: [
                        "To prevent lost patient records or dropped bookings during network drops, the backend leverages asyncpg connection pooling for PostgreSQL 16 with automated schema migrations and seamlessly switches to an embedded SQLite datastore (clinic.db) if the primary datastore becomes unreachable.",
                    ],
                },
            ],
        },
    },
    {
        index: "02",
        slug: "news-flashcard",
        name: "News FlipCard",
        description:
            "Tactile 3D card-stack news reader with 100% local NLP summarization (PyTorch T5-small & Luhn algorithm), SQLite WAL SWR caching, and universal embed support.",
        tech: [
            "FastAPI",
            "Python",
            "PyTorch",
            "Hugging Face T5",
            "Next.js 15",
            "TypeScript",
            "SQLite WAL",
            "Selectolax",
        ],
        year: "2025",
        link: "https://news-flashcard-9ad00f891023.herokuapp.com",
        thumb: "/projects/news-flashcard/news-flashcard-cover.webp",
        page: {
            tagline: "Tactile 3D card-stack news reader powered by zero-API-cost local NLP summarization.",
            about: [
                "Architected a high-performance news aggregation and summarization engine that curates breaking national (English) and regional (Malayalam) headlines with zero external LLM API dependency.",
                "Engineered a dual-pipeline NLP summarizer: an in-process, thread-safe PyTorch singleton running Hugging Face's google-t5/t5-small for English headlines, paired with a tuned Luhn frequency-scoring algorithm for morphological Malayalam text extraction.",
                "Implemented a resilient Stale-While-Revalidate (SWR) cache backed by SQLite in Write-Ahead Logging (WAL) mode (redis_cache.db), delivering sub-millisecond cached responses while background worker tasks asynchronously revalidate feeds.",
                "Constructed a multi-source parallel scraping orchestrator utilizing selectolax and BeautifulSoup4, complete with a Google News batchexecute URL decoder to resolve canonical publisher links across 10+ major outlets.",
                "Designed an immersive 3D card stack interface in Next.js 15 featuring realistic paper rim highlights, fanning deck physics, swipe-to-draw gestures, and an interactive embeddable widget engine.",
            ],
            poster: "/projects/news-flashcard/news-flashcard-hero.webp",
            cover: "/projects/news-flashcard/news-flashcard-cover.webp",
            share: "/projects/news-flashcard/news-flashcard-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "Interactive Live FlipCard Demo",
                },
                {
                    kind: "embed",
                    src: "https://news-flashcard-9ad00f891023.herokuapp.com/embed?lang=en&theme=dark",
                    title: "News FlipCard Widget",
                    height: 540,
                },
                {
                    kind: "heading",
                    text: "Tactile 3D Card Stack Illusion",
                },
                {
                    kind: "text",
                    parts: [
                        "Rather than presenting another generic vertical newsfeed, News FlipCard simulates a physical deck of matte burgundy cards (#9e3547) rendered with warm film-grain paper textures, multi-sided paper rim highlights, and cast drop-shadows. The deck responds smoothly to drag, swipe, and click gestures across both desktop trackpads and mobile touchscreens.",
                    ],
                },
                {
                    kind: "image",
                    src: "/projects/news-flashcard/news-flashcard-mobile.webp",
                    alt: "News FlipCard Mobile 3D Card Stack View",
                    width: 461,
                    height: 813,
                },
                {
                    kind: "heading",
                    text: "Zero-API-Cost Local NLP Summarization",
                },
                {
                    kind: "text",
                    parts: [
                        "Unlike conventional AI wrappers that incur per-token cloud costs and rate limits with external LLMs, News FlipCard executes all summarization locally on the server:",
                    ],
                },
                {
                    kind: "text",
                    parts: [
                        "• English Pipeline: A thread-safe singleton PyTorch inference worker executing Hugging Face's google-t5/t5-small to distill long-form reports into 60-word briefs while stripping wire service tags (PTI, ANI, Reuters).",
                    ],
                },
                {
                    kind: "text",
                    parts: [
                        "• Malayalam Pipeline: High-speed extractive summarization utilizing a tuned Luhn frequency-scoring algorithm optimized for complex Malayalam Unicode morphology.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Resilient Scraping, SWR Caching & Single-Dyno Deployment",
                },
                {
                    kind: "text",
                    parts: [
                        "Feed ingestion runs asynchronously across 10+ sources (Manorama, Mathrubhumi, Asianet, The Hindu, Times of India, NDTV, and Indian Express) with connection pooling and automated fallback parser engines (selectolax and BeautifulSoup4). Google News redirect tokens are resolved via a custom batchexecute URL decoder.",
                    ],
                },
                {
                    kind: "text",
                    parts: [
                        "A Stale-While-Revalidate (SWR) cache layer implemented in SQLite WAL mode (redis_cache.db) guarantees instantaneous page loads while worker threads refresh articles in the background. The entire application is packaged as a unified single-dyno ASGI service where FastAPI directly mounts and serves the Next.js 15 static export with zero CORS latency.",
                    ],
                },
            ],
        },
    },
    {
        index: "03",
        slug: "pdf-chatbot",
        name: "PDFChatbot — Multimodal PDF RAG & Vision OCR",
        description:
            "Multimodal RAG and 2-tier Vision OCR intelligence engine with PyMuPDF figure extraction, Google Gemini 2.5 Flash, FAISS vector indexing, and SSE token streaming.",
        tech: ["FastAPI", "Google Gemini 2.5", "LangChain", "FAISS", "PyMuPDF", "pytesseract", "SSE", "Python"],
        year: "2025",
        link: "https://github.com/shinas101/pdf-rag-chatbot",
        thumb: "/projects/pdf-chatbot/pdf-chatbot-preview.webp",
        page: {
            tagline: "Multimodal PDF RAG & 2-tier Vision OCR engine with real-time SSE token streaming.",
            about: [
                "Constructed a production-grade multimodal RAG pipeline combining LangChain, Google Gemini 2.5 Flash, and FAISS to query digital and scanned PDFs with pinpoint page citations.",
                "Engineered a 2-tier hybrid OCR engine: fast local OCR via pytesseract with an automatic fallback to Gemini 2.5 Flash multimodal vision OCR for noisy, scanned documents.",
                "Extracted embedded figures, diagrams, and tables at native 300 DPI using PyMuPDF (fitz), powering an HD figure lightbox with pan, zoom, and direct asset download.",
                "Implemented Server-Sent Events (SSE) via FastAPI for asynchronous token streaming with interactive citation badges and document intelligence actions (one-click executive summary and FAQ generation).",
            ],
            poster: "/projects/pdf-chatbot/pdf-chatbot-hero.webp",
            cover: "/projects/pdf-chatbot/pdf-chatbot-cover.webp",
            share: "/projects/pdf-chatbot/pdf-chatbot-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "2-Tier Hybrid OCR & Page Decomposition",
                },
                {
                    kind: "text",
                    parts: [
                        "Enterprise PDFs often arrive as noisy scans or complex multi-column layouts where simple text extractors fail. The system decomposes incoming documents with PyMuPDF, rasterizes pages at 300 DPI, and routes scanned segments through a 2-tier OCR pipeline combining local Tesseract with Gemini 2.5 Flash vision understanding.",
                    ],
                },
                {
                    kind: "heading",
                    text: "FAISS Vector Indexing & Real-Time SSE Streaming",
                },
                {
                    kind: "text",
                    parts: [
                        "Text chunks and visual captions are embedded with models/gemini-embedding-001 and indexed in FAISS with exact page metadata. Queries stream responses token-by-token over Server-Sent Events (SSE) via FastAPI, rendering live markdown alongside clickable (Page X) citation badges and retrieved diagram embeds.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Ephemeral Privacy & Document Intelligence",
                },
                {
                    kind: "text",
                    parts: [
                        "Designed for strict data privacy, the architecture enforces ephemeral storage—automatically purging uploaded PDFs, extracted figures, and vector stores on session clear or server startup, while offering one-click executive summaries and automated FAQ generation.",
                    ],
                },
            ],
        },
    },
    {
        index: "04",
        slug: "uwb-elderly-care",
        name: "UWB Elderly Care Monitoring",
        description:
            "Real-time indoor activity monitoring and fall detection system utilizing UWB transceivers, ESP32 microcontrollers, Python ML, and Telegram emergency notifications.",
        tech: ["Python", "ESP32", "UWB Transceivers", "Machine Learning", "Telegram API"],
        year: "2024",
        link: "https://github.com/shinas101",
        thumb: "/projects/kairos/kairos-preview.webp",
        page: {
            tagline: "Real-time UWB activity tracking and emergency fall detection for elderly care.",
            about: [
                "Developed a real-time indoor monitoring system using Ultra-Wideband (UWB) transceivers, ESP32 microcontrollers, and custom Python ML models for activity classification and fall detection.",
                "Designed data preprocessing pipelines to filter signal noise and calculate high-accuracy micro-positioning metrics in indoor environments.",
                "Integrated Telegram APIs for automated immediate emergency alerts to caregivers when abnormal movement patterns or falls are detected.",
            ],
            poster: "/projects/kairos/kairos-hero.webp",
            cover: "/projects/kairos/kairos-header.webp",
            share: "/projects/kairos/kairos-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "Privacy-Preserving Indoor Tracking",
                },
                {
                    kind: "text",
                    parts: [
                        "Unlike camera-based systems that compromise privacy, UWB RF transceivers track indoor micro-movements accurately without optical surveillance, respecting user privacy in home environments.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Embedded Intelligence & Telegram Alerts",
                },
                {
                    kind: "text",
                    parts: [
                        "Motion vector streams processed on ESP32 microcontrollers trigger classification models, instantly dispatching actionable alerts and telemetry to caregivers over Telegram.",
                    ],
                },
            ],
        },
    },
];

const SEASONS = ["Winter", "Spring", "Summer", "Fall"];
// "Fall 2026" sorts after "Spring 2026"; year ranges like "2024–2025" sort by their end year.
const when = (p: Project) => {
    const [season, rawYear] = p.year.includes(" ") ? p.year.split(" ") : ["", p.year];
    const year = Number(rawYear.split(/[-–—]/).pop()?.trim()) || 0;
    return year * 4 + Math.max(0, SEASONS.indexOf(season));
};

/** Newest first; projects from the same season keep their order above. */
export const projectsByDate = [...projects].sort((a, b) => when(b) - when(a));

/** sessionStorage key for the last project page viewed, so the strip can return to it. */
export const LAST_PROJECT_KEY = "projects-last-viewed";

/** Where a project's tile or button leads: its own page, its outside link, or nowhere. */
export const projectHref = (p: Project) => (p.page ? `/projects/${p.slug}` : p.link);

export const isExternal = (href: string) => /^https?:/.test(href);
