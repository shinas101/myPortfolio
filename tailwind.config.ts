import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/icons/*.svg",
    ],
    prefix: "",

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        colors: {
            "light-foreground": "#262523",
            "light-background": "#f5f4f1",
            "dark-foreground": "#fff7f0",
            "dark-background": "#060c18",
            "text-hover": "#3c7cff",
            background: "var(--background-color)",
            foreground: "var(--foreground-color)",
        },
        extend: {
            keyframes: {
                blink: {
                    "0%, 49%": { opacity: "1" },
                    "50%, 100%": { opacity: "0" },
                },
            },
            animation: {
                blink: "blink 1.1s step-end infinite",
            },
            fontFamily: {
                inter: "var(--font-inter)",
                brodine: "var(--font-brodine)",
                geistMono: "var(--font-geist-mono)",
                geistSans: "var(--font-geist-sans)",
            },
        },
    },
    plugins: [
        plugin(({ addBase, theme }) => {
            addBase({
                ":root": {
                    "--background-color": theme("colors.dark-background"),
                    "--foreground-color": theme("colors.dark-foreground"),
                    "--muted-color": "color-mix(in srgb, var(--foreground-color) 50%, transparent)",
                },
                ".dark": {
                    "--background-color": theme("colors.dark-background"),
                    "--foreground-color": theme("colors.dark-foreground"),
                    "--muted-color": "color-mix(in srgb, var(--foreground-color) 50%, transparent)",
                },
            });
        }),
    ],
} satisfies Config;
