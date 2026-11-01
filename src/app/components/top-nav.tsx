"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { label: "home", href: "/" },
    { label: "projects", href: "/projects" },
    { label: "blog", href: "/blog" },
];

const ITEM = "transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 outline-none px-1.5 py-1";

type TopNavProps = {
    /** The nav is sitting over a dark cover image, so it uses light text whatever the theme. */
    overCover?: boolean;
};

export default function TopNav({ overCover = false }: TopNavProps) {
    const pathname = usePathname();
    // A project's own page still counts as being in projects.
    const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
        <nav
            aria-label="Main"
            // Named for view transitions, so the nav stays in place instead of fading out with the rest of the page.
            className={`fixed inset-x-0 top-0 z-30 flex items-center justify-center pt-6 sm:pt-8 font-geistMono text-[16px] sm:text-[14px] md:text-[13px] lowercase transition-colors duration-200 [view-transition-name:site-nav] ${
                overCover ? "text-dark-foreground" : "text-foreground"
            }`}
        >
            <div className="flex items-center justify-center gap-6 sm:gap-8">
                {LINKS.map(({ label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active(href) ? "page" : undefined}
                        className={`${ITEM} ${active(href) ? "opacity-100" : "opacity-50"}`}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
