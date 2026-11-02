import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { PostHogInitializer } from "../context-providers/posthog-initializer";
import type { ReactNode } from "react";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const fontBrodine = localFont({
    src: [
        { path: "./fonts/brodine-regular.otf", weight: "400", style: "normal" },
        { path: "./fonts/brodine-italic.otf", weight: "400", style: "italic" },
    ],
    variable: "--font-brodine",
});

const fontGeistSans = localFont({
    src: [
        { path: "./fonts/geist-sans-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/geist-sans-latin-500-normal.woff2", weight: "500" },
    ],
    variable: "--font-geist-sans",
});

const fontGeistMono = localFont({
    src: "./fonts/geist-mono-latin-400-normal.woff2",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    // Share images need absolute URLs, so relative ones resolve against the live site.
    metadataBase: new URL("https://github.com/shinas101"),
    title: "Shinas Samoon",
    description: "Software Engineer Portfolio — AI/ML, Python & Full-Stack Development",
    twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.variable} ${fontBrodine.variable} ${fontGeistMono.variable} ${fontGeistSans.variable} scroll-smooth overflow-x-clip bg-background text-foreground`}
            >
                <PostHogInitializer>{children}</PostHogInitializer>
            </body>
            <Analytics />
        </html>
    );
}
