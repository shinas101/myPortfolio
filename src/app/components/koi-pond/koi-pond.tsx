"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { cn } from "../../../lib/utils";
import { KoiRenderer } from "./renderer";
import { World, type Box } from "./world";

export type PondStats = { koi: number; pellets: number };

const STEP = 1 / 60;
const MAX_STEPS = 4;
const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], [data-koi-ignore]";
// Content over the pond carries this attribute; koi steer around it and fade beneath it.
const AVOID_TARGETS = "[data-koi-avoid]";
// Re-measure the content boxes this often, in frames, to follow layout shifts and entrance animations.
const MEASURE_EVERY_FRAMES = 30;
// Content boxes closer than this merge, so koi aren't squeezed into the slot between them.
const MERGE_GAP_PX = 160;

function mergeNearby(boxes: Box[]) {
    const merged: Box[] = [];
    boxes.sort((p, q) => p.top - q.top);
    for (const b of boxes) {
        const near = merged.find(
            (m) => b.top - m.bottom < MERGE_GAP_PX && b.left - m.right < MERGE_GAP_PX && m.left - b.right < MERGE_GAP_PX
        );
        if (!near) {
            merged.push({ ...b });
            continue;
        }
        near.left = Math.min(near.left, b.left);
        near.right = Math.max(near.right, b.right);
        near.bottom = Math.max(near.bottom, b.bottom);
    }
    return merged;
}

class PondEngine {
    private world = new World();
    private renderer: KoiRenderer;
    private raf = 0;
    private scrollRaf = 0;
    private last = 0;
    private acc = 0;
    private frames = 0;
    private lastPointerTime = 0;
    private reported: PondStats = { koi: -1, pellets: -1 };
    private visible = true;
    private disposed = false;
    private canvasRect: DOMRect | null = null;
    private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    private resizeObserver = new ResizeObserver(() => this.resize());
    private intersectionObserver = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        this.schedule();
    });

    constructor(
        private canvas: HTMLCanvasElement,
        private onStats: (stats: PondStats) => void
    ) {
        this.renderer = new KoiRenderer(canvas);
        this.resizeObserver.observe(canvas);
        this.intersectionObserver.observe(canvas);
        this.reducedMotion.addEventListener("change", this.schedule);
        window.addEventListener("pointerdown", this.onPointerDown, { passive: true });
        window.addEventListener("pointermove", this.onPointerMove, { passive: true });
        window.addEventListener("click", this.onClick);
        window.addEventListener("scroll", this.onScroll, { passive: true });
        window.addEventListener("resize", this.onWindowResize, { passive: true });
        document.addEventListener("fullscreenchange", this.onWindowResize);
        document.documentElement.addEventListener("pointerleave", this.onPointerLeave);
        window.addEventListener("blur", this.onPointerLeave);
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.resize();
        this.schedule();
    }

    destroy() {
        this.disposed = true;
        cancelAnimationFrame(this.raf);
        cancelAnimationFrame(this.scrollRaf);
        this.resizeObserver.disconnect();
        this.intersectionObserver.disconnect();
        this.reducedMotion.removeEventListener("change", this.schedule);
        window.removeEventListener("pointerdown", this.onPointerDown);
        window.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("click", this.onClick);
        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onWindowResize);
        document.removeEventListener("fullscreenchange", this.onWindowResize);
        document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
        window.removeEventListener("blur", this.onPointerLeave);
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    setTheme(isLight: boolean) {
        this.renderer.setTheme(isLight);
        if (this.reducedMotion.matches) this.drawStill();
    }

    private resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvasRect = rect;
        if (rect.width < 1 || rect.height < 1) return;
        this.renderer.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 2));
        this.world.resize(rect.width, rect.height);
        this.measureContent();
        this.report();
        if (this.reducedMotion.matches) this.drawStill();
    }

    // Only call back when a count changes, so the page doesn't re-render every frame.
    private report() {
        const koi = this.world.koi.length;
        const pellets = this.world.pellets.length;
        if (koi === this.reported.koi && pellets === this.reported.pellets) return;
        this.reported = { koi, pellets };
        this.onStats(this.reported);
    }

    private schedule = () => {
        cancelAnimationFrame(this.raf);
        if (this.disposed || !this.visible) return;
        if (this.reducedMotion.matches) {
            this.drawStill();
            return;
        }
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.frame);
    };

    private measureContent() {
        const origin = this.canvasRect ?? (this.canvasRect = this.canvas.getBoundingClientRect());
        const measured = Array.from(document.querySelectorAll(AVOID_TARGETS), (el) => el.getBoundingClientRect())
            // The layout for the other screen size is display: none and measures as an empty box.
            .filter((b) => b.width > 0 && b.height > 0)
            .map((b) => ({
                left: b.left - origin.left,
                top: b.top - origin.top,
                right: b.right - origin.left,
                bottom: b.bottom - origin.top,
            }));
        const boxes = mergeNearby(measured);
        this.renderer.setDimBoxes(boxes);
        this.world.avoid = boxes;
    }

    private frame = (now: number) => {
        const dt = Math.min(0.1, (now - this.last) / 1000);
        this.last = now;
        this.acc += dt;
        let steps = 0;
        while (this.acc >= STEP && steps < MAX_STEPS) {
            this.world.step(STEP);
            this.acc -= STEP;
            steps++;
        }
        if (steps === MAX_STEPS) this.acc = 0;
        if (++this.frames % MEASURE_EVERY_FRAMES === 0) this.measureContent();
        this.renderer.render(this.world);
        this.report();
        this.raf = requestAnimationFrame(this.frame);
    };

    // Reduced motion: let the koi spread out, then hold a single frame.
    private drawStill() {
        if (this.world.time < 4) {
            for (let i = 0; i < 240; i++) this.world.step(STEP);
        }
        this.measureContent();
        this.renderer.render(this.world);
        this.report();
    }

    private onWindowResize = () => {
        this.resize();
    };

    private toLocal(e: MouseEvent) {
        const rect = this.canvasRect ?? (this.canvasRect = this.canvas.getBoundingClientRect());
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        const inside =
            e.clientX >= rect.left - 4 &&
            e.clientX <= rect.right + 4 &&
            e.clientY >= rect.top - 4 &&
            e.clientY <= rect.bottom + 4;
        return { x, y, inside };
    }

    private onPointerMove = (e: PointerEvent) => {
        const { x, y, inside } = this.toLocal(e);
        const p = this.world.pointer;
        if (this.lastPointerTime === 0) {
            this.lastPointerTime = e.timeStamp;
            p.x = x;
            p.y = y;
            p.active = inside;
            return;
        }
        const elapsed = Math.max(0.001, (e.timeStamp - this.lastPointerTime) / 1000);
        const speed = Math.hypot(x - p.x, y - p.y) / elapsed;
        p.speed += (Math.min(speed, 5000) - p.speed) * 0.65;
        this.lastPointerTime = e.timeStamp;
        p.x = x;
        p.y = y;
        p.active = inside;
    };

    private onPointerDown = (e: PointerEvent) => {
        if (this.reducedMotion.matches) return;
        if (e.composedPath().some((n) => n instanceof Element && n.matches(INTERACTIVE))) return;
        const { x, y, inside } = this.toLocal(e);
        if (!inside) return;
        const p = this.world.pointer;
        p.x = x;
        p.y = y;
        p.active = true;
        this.world.disturb(x, y, 0.4);
        this.renderer.touchWater(x, y, 18, 1.2);
        this.report();
    };

    // Clicks on water create a splash disturbance; links, buttons, and text selection are left alone.
    private onClick = (e: MouseEvent) => {
        if (this.reducedMotion.matches) return;
        if (e.composedPath().some((n) => n instanceof Element && n.matches(INTERACTIVE))) return;
        if (window.getSelection()?.toString()) return;
        const { x, y, inside } = this.toLocal(e);
        if (!inside) return;
        this.world.disturb(x, y, 0.5);
        this.renderer.touchWater(x, y, 22, 1.4);
        this.report();
    };

    private onScroll = () => {
        if (this.scrollRaf) return;
        this.scrollRaf = requestAnimationFrame(() => {
            this.canvasRect = this.canvas.getBoundingClientRect();
            this.measureContent();
            this.scrollRaf = 0;
        });
    };

    private onPointerLeave = () => {
        this.world.pointer.active = false;
        this.world.pointer.speed = 0;
    };

    private onVisibilityChange = () => {
        if (document.hidden) {
            cancelAnimationFrame(this.raf);
        } else {
            this.schedule();
        }
    };
}

type KoiPondProps = { className?: string; onStats?: (stats: PondStats) => void };

export default function KoiPond({ className, onStats }: KoiPondProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<PondEngine | null>(null);
    // An Effect Event, so a new callback doesn't tear down the engine.
    const emitStats = useEffectEvent((stats: PondStats) => onStats?.(stats));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const engine = new PondEngine(canvas, (stats) => emitStats(stats));
        engineRef.current = engine;
        return () => {
            engine.destroy();
            engineRef.current = null;
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none", className)} />;
}
