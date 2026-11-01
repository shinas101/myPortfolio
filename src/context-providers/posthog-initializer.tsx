"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

function PostHogPageViewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname || !posthogKey) return;
        let url = window.origin + pathname;
        if (searchParams?.toString()) {
            url += `?${searchParams.toString()}`;
        }
        posthog.capture("$pageview", { $current_url: url });
    }, [pathname, searchParams]);

    return null;
}

export function PostHogInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!posthogKey) {
            if (process.env.NODE_ENV === "development") {
                console.warn(
                    "[PostHog] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set. Analytics are disabled. Add it to .env.local to test."
                );
            }
            return;
        }

        const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

        posthog.init(posthogKey, {
            api_host: apiHost,
            ui_host: "https://us.posthog.com",
            person_profiles: "identified_only",
            capture_pageview: false, // Handled dynamically on route changes by PostHogPageViewTracker
            capture_pageleave: true,
            capture_exceptions: true,
            debug: process.env.NODE_ENV === "development",
        });
    }, []);

    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageViewTracker />
            </Suspense>
            {children}
        </PHProvider>
    );
}
