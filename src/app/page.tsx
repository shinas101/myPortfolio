import FrontPage from "./components/front-page";
import HomePageEffects from "./components/home-page-effects";
import TopNav from "./components/top-nav";
import KoiPond from "./components/koi-pond/koi-pond";

export default function Home() {
    return (
        <div
            id="mainPage"
            className="relative h-[100dvh] w-full overflow-hidden bg-background text-foreground transition-colors duration-300"
        >
            <HomePageEffects />
            <KoiPond className="absolute inset-0 h-full w-full" />
            <TopNav />
            <main className="relative z-20 flex h-full flex-col">
                <FrontPage />
            </main>
        </div>
    );
}
