/** Sources for the landing page's @-mentions: what the hover card shows, plus where a click lands. */

export type Source = {
    key: string;
    /** Shown beside the mark in the card header. */
    name: string;
    /**
     * Optical size correction, default 1. A circular plate covers ~79% of the
     * area a square one does, so it reads small at the same dimensions.
     */
    iconScale?: number;
    /** Vendored favicon in /public/logos. Omit and the card falls back to a monogram. */
    icon?: string;
    /** Prominent line in the card — the title slot. */
    role: string;
    /** Leads the body line, the way a publication date does in a real citation. */
    dates: string;
    /** One line on the work itself. */
    summary: string;
    /** Where a click lands: an in-app path or an external URL. */
    href?: string;
    /** Keys of other sources this one rolls up; the card lists each of them instead of one role. */
    group?: string[];
};

export const SOURCES: Record<string, Source> = {
    ictk: {
        key: "ictk",
        name: "ICT Academy of Kerala",
        role: "AI/ML Intern",
        dates: "Jun–Jul 2025",
        summary: "Developed Python ML models, data preprocessing pipelines, and evaluation workflows.",
        href: "https://ictkerala.org/",
    },
    lbs: {
        key: "lbs",
        name: "L.B.S College of Engineering",
        role: "B.Tech in Electronics & Communication",
        dates: "Graduated",
        summary: "Kasaragod, Kerala. Graduated in Electronics & Communication Engineering (CGPA: 7.1).",
        href: "https://lbscek.ac.in/",
    },
    clinical: {
        key: "clinical",
        name: "Clinical Voice AI (Mia)",
        role: "Real-time Medical Voice & Receptionist Platform",
        dates: "2025",
        summary: "LiveKit WebRTC, Silero VAD barge-in, GPT-4o triage, and asyncpg PostgreSQL with pgvector semantic memory and SQLite failover.",
        href: "/projects/clinical-voice-ai",
    },
    flashnews: {
        key: "flashnews",
        name: "News FlipCard",
        role: "Tactile 3D Card-Stack News Reader",
        dates: "2025",
        summary: "100% local PyTorch T5-small & Luhn NLP summarization, SQLite WAL SWR caching, and unified FastAPI + Next.js 15 single-dyno architecture.",
        href: "/projects/news-flashcard",
    },
    pdfchatbot: {
        key: "pdfchatbot",
        name: "PDFChatbot",
        role: "Multimodal RAG & Vision OCR Engine",
        dates: "2025",
        summary: "Multimodal RAG with 2-tier OCR (Tesseract + Gemini 2.5 Vision), PyMuPDF figure extraction, and FAISS vector search.",
        href: "/projects/pdf-chatbot",
    },
    uwb: {
        key: "uwb",
        name: "Elderly Care Activity Monitoring",
        role: "Indoor UWB Activity & Fall Detection",
        dates: "2024",
        summary: "Real-time tracking system using UWB transceivers, ESP32, Python ML models, and Telegram emergency alerts.",
        href: "/projects/uwb-elderly-care",
    },
};
