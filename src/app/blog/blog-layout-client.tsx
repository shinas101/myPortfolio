"use client";

import React from "react";
import TopNav from "../components/top-nav";
import KoiPond from "../components/koi-pond/koi-pond";

export default function BlogLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            {/* The Koi Pond in the background */}
            <KoiPond className="fixed inset-0 h-full w-full pointer-events-none z-0" />

            {/* Navigation */}
            <TopNav />

            {/* Centered Blog Content Container */}
            <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start px-3 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8">
                {children}
            </main>
        </div>
    );
}
