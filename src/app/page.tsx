"use client";
import React, { useEffect } from "react";

import FrontPage from "./components/front-page";
import TopNav from "./components/top-nav";
import KoiPond from "./components/koi-pond/koi-pond";

export default function Home() {
    // The home page is a single screen: no scrolling and no overscroll bounce. Restored when leaving the page.
    useEffect(() => {
        const root = document.documentElement;
        const previous = { overflow: root.style.overflow, overscroll: root.style.overscrollBehavior };
        root.style.overflow = "hidden";
        root.style.overscrollBehavior = "none";
        return () => {
            root.style.overflow = previous.overflow;
            root.style.overscrollBehavior = previous.overscroll;
        };
    }, []);

    return (
        <div
            id="mainPage"
            className="relative h-[100dvh] w-full overflow-hidden bg-background text-foreground transition-colors duration-300"
        >
            <KoiPond className="absolute inset-0 h-full w-full" />
            <TopNav />
            <main className="relative z-20 flex h-full flex-col">
                <FrontPage />
            </main>
        </div>
    );
}
