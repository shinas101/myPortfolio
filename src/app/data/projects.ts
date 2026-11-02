export type Project = {
    /** URL segment for the project's own page. */
    slug: string;
    index: string;
    name: string;
    description: string;
    tech: string[];
    year: string;
    github?: string;
    live?: string;
    /** Small raster preview, rendered from the original artwork. */
    thumb: string;
    /** A project with its own page on the site; its tiles link there instead of out. */
    page?: {
        tagline: string;
        overview: string;
        highlights: { label: string; detail: string }[];
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

/** Inline text with optional links or emphasis. */
export type Prose = (string | { text: string; href: string } | { text: string; strong: true })[];

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
            "Real-time clinical voice platform combining WebRTC streaming, interruptible speech, GPT-4o triage, semantic patient memory, and resilient data storage.",
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
        github: "https://github.com/shinas101/Ai-Receptionist",
        thumb: "/projects/clinical-voice-ai/clinical-voice-ai-preview.webp",
        page: {
            tagline:
                "A real-time WebRTC voice agent for clinical intake, appointment scheduling, and safety-aware triage.",
            overview:
                "LiveKit streams audio to async Python workers; GPT-4o tools, pgvector memory, and resilient storage support clinical workflows.",
            highlights: [
                { label: "Audio transport", detail: "LiveKit + WebRTC stream caller audio to async Python workers." },
                {
                    label: "Interruption handling",
                    detail: "Silero VAD detects speech and cancels active TTS when callers interrupt.",
                },
                {
                    label: "Clinical routing",
                    detail: "GPT-4o function calls handle scheduling and triage; red flags trigger emergency guidance.",
                },
                {
                    label: "Semantic memory",
                    detail: "pgvector retrieves caller context from 1,536-dimensional PostgreSQL embeddings.",
                },
                {
                    label: "Database resilience",
                    detail: "asyncpg pools PostgreSQL connections; SQLite buffers writes during outages.",
                },
                {
                    label: "Ingress security",
                    detail: "Docker + Nginx provide TLS 1.3, CORS, rate limits, and automated SAN certificates.",
                },
            ],
            poster: "/projects/clinical-voice-ai/clinical-voice-ai-hero.webp",
            cover: "/projects/clinical-voice-ai/clinical-voice-ai-cover.webp",
            share: "/projects/clinical-voice-ai/clinical-voice-ai-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "Streaming and interruption handling",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Audio pipeline", strong: true },
                        " — LiveKit routes WebRTC streams to async workers; Silero VAD cancels TTS on interruption.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Caller memory",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Retrieval", strong: true },
                        " — pgvector searches 1,536-dimensional PostgreSQL embeddings for verified caller context.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Persistence and ingress",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Resilience", strong: true },
                        " — asyncpg pools PostgreSQL; SQLite buffers writes. Nginx applies TLS, CORS, and rate limits.",
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
            "News aggregation and local summarization system with parallel feed extraction, bilingual NLP pipelines, SQLite SWR caching, and an embeddable Next.js interface.",
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
        github: "https://github.com/shinas101/NewsFlashcard",
        live: "https://newsflashcard.shinas.dev/",
        thumb: "/projects/news-flashcard/news-flashcard-cover.webp",
        page: {
            tagline:
                "A full-stack news reader with local English and Malayalam summarization and a tactile 3D card interface.",
            overview:
                "FastAPI aggregates publisher feeds and runs local English/Malayalam summarization; SQLite WAL backs a static Next.js reader and embed.",
            highlights: [
                {
                    label: "Feed ingestion",
                    detail: "FastAPI fetches 10+ publisher feeds concurrently with selectolax and BeautifulSoup4.",
                },
                {
                    label: "Link normalization",
                    detail: "A Google News batchexecute decoder resolves redirects to canonical article URLs.",
                },
                {
                    label: "Local summarization",
                    detail: "PyTorch T5-small summarizes English; tuned Luhn extraction handles Malayalam.",
                },
                {
                    label: "Caching",
                    detail: "SQLite WAL serves stale articles while background tasks refresh feeds.",
                },
                {
                    label: "Frontend and embed",
                    detail: "Next.js 15 renders swipeable 3D cards; FastAPI serves the static app and widget.",
                },
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
                    src: "https://newsflashcard.shinas.dev/embed?lang=en&theme=dark",
                    title: "News FlipCard Widget",
                    height: 540,
                },
                {
                    kind: "heading",
                    text: "Interactive card interface",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Card UI", strong: true },
                        " — Next.js renders a swipeable 3D stack and embeddable reader.",
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
                    text: "Bilingual local summarization",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Offline NLP", strong: true },
                        " — PyTorch T5-small summarizes English; Luhn extraction summarizes Malayalam.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Feed ingestion, caching, and deployment",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Ingestion", strong: true },
                        " — Concurrent feed parsing normalizes publisher URLs before caching.",
                    ],
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Serving", strong: true },
                        " — SQLite WAL supports stale-while-revalidate; FastAPI hosts the API and static export.",
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
            "Document-question-answering pipeline combining PDF parsing, hybrid OCR, multimodal embeddings, FAISS retrieval, and streamed cited responses.",
        tech: ["FastAPI", "Google Gemini 2.5", "LangChain", "FAISS", "PyMuPDF", "pytesseract", "SSE", "Python"],
        year: "2025",
        github: "https://github.com/shinas101/pdf-rag-chatbot",
        thumb: "/projects/pdf-chatbot/pdf-chatbot-preview.webp",
        page: {
            tagline:
                "A multimodal retrieval-augmented generation pipeline for asking cited questions about PDF documents.",
            overview:
                "FastAPI parses PDFs, applies local or vision OCR, indexes text and image context in FAISS, and streams cited answers over SSE.",
            highlights: [
                {
                    label: "PDF parsing",
                    detail: "PyMuPDF extracts text and figures; scanned pages are rasterized at 300 DPI.",
                },
                {
                    label: "Hybrid OCR",
                    detail: "pytesseract handles local OCR; Gemini 2.5 Flash Vision covers difficult scans.",
                },
                {
                    label: "Multimodal retrieval",
                    detail: "LangChain + FAISS index text and figure captions for Gemini responses.",
                },
                {
                    label: "Page citations",
                    detail: "Page metadata links retrieved chunks to source pages.",
                },
                {
                    label: "Streaming API",
                    detail: "FastAPI streams tokens over SSE and provides summary and FAQ actions.",
                },
                {
                    label: "Temporary files",
                    detail: "PDFs, figures, and indexes are cleared on reset or server startup.",
                },
            ],
            poster: "/projects/pdf-chatbot/pdf-chatbot-hero.webp",
            cover: "/projects/pdf-chatbot/pdf-chatbot-cover.webp",
            share: "/projects/pdf-chatbot/pdf-chatbot-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "PDF parsing and hybrid OCR",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "OCR pipeline", strong: true },
                        " — PyMuPDF extracts pages; pytesseract falls back to Gemini Vision for scanned content.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Multimodal retrieval and cited streaming",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Retrieval", strong: true },
                        " — FAISS indexes text and figure captions with page metadata for cited answers.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Temporary document lifecycle",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Lifecycle", strong: true },
                        " — Temporary files and indexes are removed on reset or server startup.",
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
            "Embedded indoor monitoring prototype combining UWB ranging, ESP32 telemetry, Python activity classification, and Telegram alerts.",
        tech: ["Python", "ESP32", "UWB Transceivers", "Machine Learning", "Telegram API"],
        year: "2024",
        github: "https://github.com/shinas101",
        thumb: "/projects/kairos/kairos-preview.webp",
        page: {
            tagline: "A privacy-preserving embedded sensing pipeline for indoor activity and fall detection.",
            overview:
                "ESP32/UWB telemetry feeds Python activity classification; fall events trigger caregiver alerts through Telegram.",
            highlights: [
                {
                    label: "Sensing",
                    detail: "UWB transceivers capture indoor movement and ranging data without cameras.",
                },
                { label: "Embedded telemetry", detail: "ESP32 devices collect and forward UWB sensor data." },
                { label: "Signal processing", detail: "Python filters noise and derives positioning features." },
                {
                    label: "Activity classification",
                    detail: "Machine-learning models classify movement and detect fall-like patterns.",
                },
                { label: "Caregiver alerts", detail: "Telegram API sends notifications for detected events." },
            ],
            poster: "/projects/kairos/kairos-hero.webp",
            cover: "/projects/kairos/kairos-header.webp",
            share: "/projects/kairos/kairos-og.jpg",
            story: [
                {
                    kind: "heading",
                    text: "Signal processing for indoor tracking",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Signal pipeline", strong: true },
                        " — UWB + ESP32 telemetry is filtered and classified by Python models.",
                    ],
                },
                {
                    kind: "heading",
                    text: "Embedded inference and event notifications",
                },
                {
                    kind: "text",
                    parts: [
                        { text: "Event response", strong: true },
                        " — Fall-like activity triggers a Telegram alert to caregivers.",
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

/** Where a project's tile or button leads: its own page, its outside link, or nowhere. */
export const projectHref = (p: Project) => (p.page ? `/projects/${p.slug}` : (p.live ?? p.github));

export const isExternal = (href: string) => /^https?:/.test(href);
