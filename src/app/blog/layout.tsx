import type { Metadata } from "next";
import BlogLayoutClient from "./blog-layout-client";

export const metadata: Metadata = {
    title: {
        default: "Blog — Shinas Samoon",
        template: "%s — Shinas Samoon",
    },
    description: "Technical writings, architectural deep-dives, and notes on AI/ML and software engineering.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <BlogLayoutClient>{children}</BlogLayoutClient>;
}
