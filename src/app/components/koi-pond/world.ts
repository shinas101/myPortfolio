export const TAU = Math.PI * 2;
export const KOI_NODES = 20;
export const RIPPLE_SPEED = 28;

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

export function smoothstep(e0: number, e1: number, x: number) {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
}

export function angleDiff(a: number, b: number) {
    let d = (b - a) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
}

// Deterministic integer hash to [0, 1), so textures stay pinned to the body.
export function hash3(x: number, y: number, z: number) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

export type Box = { left: number; top: number; right: number; bottom: number };

export type Variety = "kohaku" | "sanke" | "tancho" | "benigoi" | "yamabuki_ogon" | "asagi";

const VARIETY_WEIGHTS: [Variety, number][] = [
    ["kohaku", 2],
    ["sanke", 2],
    ["tancho", 1],
    ["benigoi", 2],
    ["yamabuki_ogon", 2],
    ["asagi", 2],
];
const TOTAL_WEIGHT = VARIETY_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

function pickVariety(): Variety {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const [variety, weight] of VARIETY_WEIGHTS) {
        r -= weight;
        if (r <= 0) return variety;
    }
    return "kohaku";
}

export interface Koi {
    id: number;
    variety: Variety;
    length: number;
    /** Spine positions, snout first: [x0, y0, x1, y1, ...]. */
    nodes: Float32Array;
    heading: number;
    speed: number;
    phase: number;
    /** Smoothed angular velocity, used to splay the fins into turns. */
    turn: number;
    wander: number;
    /** How strongly this koi swims over to the cursor. */
    curiosity: number;
    /** 0.5 deep and dim to 1 just under the surface. */
    depth: number;
    depthTarget: number;
    depthMax: number;
    nextDive: number;
    nextSurface: number;
    /** When a koi swimming near the surface next sends a small ring off its tail. */
    nextWake: number;
    /** Tail-beat intensity: koi swim in bursts of beats, then coast with the tail still. */
    beat: number;
    burstUntil: number;
    nextBurst: number;
    /** Phase of the pectoral fins, which scull gently while the koi coasts or hovers. */
    finPhase: number;
    /** 1 right after a fright, fading as the koi calms down. */
    startle: number;
    fleeX: number;
    fleeY: number;
    gulp: number;
}

export interface Ripple {
    x: number;
    y: number;
    born: number;
    strength: number;
}

export interface Swirl {
    x: number;
    y: number;
    vx: number;
    vy: number;
    spin: number;
    radius: number;
    strength: number;
    born: number;
}

export interface Lettuce {
    id: number;
    relX: number;
    relY: number;
    baseX: number;
    baseY: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    petals: number;
    angle: number;
    driftPhase: number;
}

interface LettucePreset {
    relX: number;
    relY: number;
    baseRadius: number;
    petals: number;
}

const LETTUCE_PRESETS: LettucePreset[] = [
    // Colony 1: Upper-Right open water cluster
    { relX: 0.82, relY: 0.16, baseRadius: 48, petals: 11 },
    { relX: 0.88, relY: 0.12, baseRadius: 36, petals: 9 },
    { relX: 0.77, relY: 0.22, baseRadius: 38, petals: 9 },
    { relX: 0.83, relY: 0.24, baseRadius: 28, petals: 8 },

    // Colony 2: Lower-Right corner cluster
    { relX: 0.85, relY: 0.78, baseRadius: 50, petals: 11 },
    { relX: 0.9, relY: 0.85, baseRadius: 35, petals: 9 },
    { relX: 0.79, relY: 0.83, baseRadius: 34, petals: 8 },

    // Colony 3: Upper-Left quiet cove
    { relX: 0.14, relY: 0.16, baseRadius: 44, petals: 10 },
    { relX: 0.19, relY: 0.21, baseRadius: 26, petals: 8 },
];

const push = { x: 0, y: 0 };

/** Sum of pushes away from every box within `margin` of (x, y), each scaled 0..1 by closeness. */
function repel(boxes: Box[], x: number, y: number, margin: number, out: { x: number; y: number }) {
    out.x = 0;
    out.y = 0;
    for (const b of boxes) {
        let ox = x - clamp(x, b.left, b.right);
        let oy = y - clamp(y, b.top, b.bottom);
        let d = Math.hypot(ox, oy);
        if (d > margin) continue;
        if (d < 1e-3) {
            // Inside the box: head for the nearest edge.
            const edges = [b.left - x, x - b.right, b.top - y, y - b.bottom];
            const nearest = edges.indexOf(Math.max(...edges));
            ox = nearest === 0 ? -1 : nearest === 1 ? 1 : 0;
            oy = nearest === 2 ? -1 : nearest === 3 ? 1 : 0;
            d = 0;
        }
        const len = Math.hypot(ox, oy) || 1;
        out.x += (ox / len) * (1 - d / margin);
        out.y += (oy / len) * (1 - d / margin);
    }
    return out;
}

export class World {
    width = 0;
    height = 0;
    time = 0;
    koi: Koi[] = [];
    lettuces: Lettuce[] = [];
    readonly pellets: never[] = [];
    readonly bites: never[] = [];
    ripples: Ripple[] = [];
    swirls: Swirl[] = [];
    pointer = { x: 0, y: 0, speed: 0, active: false };
    private prevPointer = { x: 0, y: 0, active: false };
    /** Page content the koi steer around, in canvas space. */
    avoid: Box[] = [];

    resize(width: number, height: number) {
        const first = this.width === 0;
        this.width = width;
        this.height = height;
        if (first) this.seed();
        else this.adaptToSize();
    }

    private seed() {
        const { width: W, height: H } = this;
        const minSide = Math.min(W, H);
        const baseLength = clamp(minSide * 0.45, 160, 390);
        const targetTotal = 10;
        const young = 2;
        const count = targetTotal - young;

        const ALL_VARIETIES: Variety[] = ["kohaku", "sanke", "tancho", "benigoi", "yamabuki_ogon", "asagi"];

        this.koi = [];
        for (let i = 0; i < targetTotal; i++) {
            const isYoung = i >= count;
            const length = baseLength * (isYoung ? rand(0.48, 0.62) : rand(0.68, 1));
            const depthMax = isYoung ? 0.9 : 1;
            const heading = rand(0, TAU);
            const x = rand(W * 0.1, W * 0.9);
            const y = rand(H * 0.1, H * 0.9);
            const nodes = new Float32Array(KOI_NODES * 2);
            const seg = length / (KOI_NODES - 1);
            for (let n = 0; n < KOI_NODES; n++) {
                nodes[n * 2] = x - Math.cos(heading) * seg * n;
                nodes[n * 2 + 1] = y - Math.sin(heading) * seg * n;
            }
            const variety = i < ALL_VARIETIES.length ? ALL_VARIETIES[i] : pickVariety();
            this.koi.push({
                id: i + 1,
                variety,
                length,
                nodes,
                heading,
                speed: 28,
                phase: rand(0, TAU),
                turn: 0,
                wander: 0,
                curiosity: rand(0.35, 1),
                depth: rand(0.68, depthMax),
                depthTarget: rand(0.68, depthMax),
                depthMax,
                nextDive: rand(6, 18),
                nextSurface: rand(3, 14),
                nextWake: rand(0, 2),
                beat: 0,
                burstUntil: 0,
                nextBurst: rand(0, 3),
                finPhase: rand(0, TAU),
                startle: 0,
                fleeX: 0,
                fleeY: 0,
                gulp: 0,
            });
        }

        const lettuceScale = clamp(Math.min(W, H) / 750, 0.7, 1.15);
        this.lettuces = LETTUCE_PRESETS.map((p, idx) => {
            const baseX = p.relX * W;
            const baseY = p.relY * H;
            return {
                id: idx + 1,
                relX: p.relX,
                relY: p.relY,
                baseX,
                baseY,
                x: baseX,
                y: baseY,
                vx: 0,
                vy: 0,
                radius: p.baseRadius * lettuceScale,
                petals: p.petals,
                angle: (idx * 1.618) % TAU,
                driftPhase: idx * 0.73,
            };
        });
    }

    private adaptToSize() {
        const { width: W, height: H } = this;
        const minSide = Math.min(W, H);
        const baseLength = clamp(minSide * 0.45, 160, 390);
        const targetTotal = 10;
        const young = 2;
        const count = targetTotal - young;

        const ALL_VARIETIES: Variety[] = ["kohaku", "sanke", "tancho", "benigoi", "yamabuki_ogon", "asagi"];

        while (this.koi.length < targetTotal) {
            const i = this.koi.length;
            const isYoung = i >= count;
            const length = baseLength * (isYoung ? rand(0.48, 0.62) : rand(0.68, 1));
            const depthMax = isYoung ? 0.9 : 1;
            const heading = rand(0, TAU);
            const x = rand(W * 0.05, W * 0.95);
            const y = rand(H * 0.05, H * 0.95);
            const nodes = new Float32Array(KOI_NODES * 2);
            const seg = length / (KOI_NODES - 1);
            for (let n = 0; n < KOI_NODES; n++) {
                nodes[n * 2] = x - Math.cos(heading) * seg * n;
                nodes[n * 2 + 1] = y - Math.sin(heading) * seg * n;
            }
            const variety = i < ALL_VARIETIES.length ? ALL_VARIETIES[i] : pickVariety();
            this.koi.push({
                id: i + 1,
                variety,
                length,
                nodes,
                heading,
                speed: 28,
                phase: rand(0, TAU),
                turn: 0,
                wander: 0,
                curiosity: rand(0.35, 1),
                depth: rand(0.68, depthMax),
                depthTarget: rand(0.68, depthMax),
                depthMax,
                nextDive: rand(6, 18),
                nextSurface: rand(3, 14),
                nextWake: rand(0, 2),
                beat: 0,
                burstUntil: 0,
                nextBurst: rand(0, 3),
                finPhase: rand(0, TAU),
                startle: 0,
                fleeX: 0,
                fleeY: 0,
                gulp: 0,
            });
        }

        const lettuceScale = clamp(Math.min(W, H) / 750, 0.7, 1.15);
        if (this.lettuces.length === 0) {
            this.lettuces = LETTUCE_PRESETS.map((p, idx) => {
                const baseX = p.relX * W;
                const baseY = p.relY * H;
                return {
                    id: idx + 1,
                    relX: p.relX,
                    relY: p.relY,
                    baseX,
                    baseY,
                    x: baseX,
                    y: baseY,
                    vx: 0,
                    vy: 0,
                    radius: p.baseRadius * lettuceScale,
                    petals: p.petals,
                    angle: (idx * 1.618) % TAU,
                    driftPhase: idx * 0.73,
                };
            });
        } else {
            for (let i = 0; i < this.lettuces.length; i++) {
                const l = this.lettuces[i];
                const p = LETTUCE_PRESETS[i];
                if (p) {
                    l.baseX = p.relX * W;
                    l.baseY = p.relY * H;
                    l.radius = p.baseRadius * lettuceScale;
                    l.x = clamp(l.x, l.radius * 0.5, W - l.radius * 0.5);
                    l.y = clamp(l.y, l.radius * 0.5, H - l.radius * 0.5);
                }
            }
        }
    }

    addSwirl(x: number, y: number, vx: number, vy: number, spin: number, radius = 55, strength = 0.5) {
        if (this.swirls.length > 25) {
            this.swirls.shift();
        }
        this.swirls.push({
            x,
            y,
            vx,
            vy,
            spin,
            radius,
            strength,
            born: this.time,
        });
    }

    /** Trigger a clean straight ballistic escape in a safe, non-danger direction. */
    private triggerFlee(k: Koi, dangerX: number, dangerY: number, intensity: number) {
        const hx = k.nodes[0];
        const hy = k.nodes[1];
        const awayX = hx - dangerX;
        const awayY = hy - dangerY;
        const awayAngle = Math.atan2(awayY, awayX);

        // Difference between current heading and vector pointing directly away from danger
        const diff = angleDiff(k.heading, awayAngle);

        let escapeAngle: number;
        // If already heading in a non-danger direction (within ~110 degrees of away vector),
        // bolt straight ahead in current heading with gentle deflection away from danger.
        if (Math.abs(diff) < Math.PI * 0.62) {
            escapeAngle = k.heading + diff * 0.25;
        } else {
            // Heading toward danger: veer cleanly into a non-danger direction (90-110 deg away)
            const turnDir = diff >= 0 ? 1 : -1;
            escapeAngle = k.heading + turnDir * (Math.PI * 0.6);
        }

        k.fleeX = Math.cos(escapeAngle);
        k.fleeY = Math.sin(escapeAngle);
        k.startle = 1.0;
        k.burstUntil = Math.max(k.burstUntil, this.time + 1.1 + Math.min(1.0, intensity * 0.6));
        k.beat = 1.0;

        const cruise = 26 + k.length * 0.045;
        // Fast straight burst!
        k.speed = Math.max(k.speed, cruise * (3.4 + Math.min(2.4, intensity * 1.4)));

        // Emit wake disturbance behind tail
        const tail = (KOI_NODES - 3) * 2;
        this.ripples.push({
            x: k.nodes[tail],
            y: k.nodes[tail + 1],
            born: this.time,
            strength: 0.3 + Math.min(0.3, intensity * 0.25),
        });
    }

    /** Create disturbance in the water; nearby fish startle and flee away from it. */
    disturb(x: number, y: number, strength = 0.5) {
        this.ripples.push({ x, y, born: this.time, strength });
        this.addSwirl(x, y, 0, 0, Math.random() > 0.5 ? 1 : -1, 65 + strength * 25, strength);
        const radius = 280 + strength * 140;
        for (const k of this.koi) {
            let minD = Math.hypot(k.nodes[0] - x, k.nodes[1] - y);
            for (let n = 2; n < KOI_NODES; n += 3) {
                const nd = Math.hypot(k.nodes[n * 2] - x, k.nodes[n * 2 + 1] - y);
                if (nd < minD) minD = nd;
            }
            if (minD < radius) {
                const boost = (1 - minD / radius) * strength;
                this.triggerFlee(k, x, y, boost * 1.5);
            }
        }
    }

    feed(x: number, y: number) {
        this.disturb(x, y, 0.6);
    }

    step(dt: number) {
        this.time += dt;
        const { pointer } = this;
        pointer.speed *= Math.exp(-dt * 8);

        // When pointer moves or drags across water, shed counter-rotating swirls & continuous ripples
        if (pointer.active) {
            if (this.prevPointer.active) {
                const pdx = pointer.x - this.prevPointer.x;
                const pdy = pointer.y - this.prevPointer.y;
                const pdist = Math.hypot(pdx, pdy);
                if (pdist > 8) {
                    const pspeed = pdist / Math.max(0.001, dt);
                    const speedNorm = Math.min(1.5, pspeed / 240);
                    const nx = -pdy / pdist;
                    const ny = pdx / pdist;
                    const flank = 24;

                    // Counter-rotating side eddy curls
                    this.addSwirl(
                        pointer.x + nx * flank,
                        pointer.y + ny * flank,
                        pdx * 0.3,
                        pdy * 0.3,
                        1,
                        48,
                        0.3 + speedNorm * 0.3
                    );
                    this.addSwirl(
                        pointer.x - nx * flank,
                        pointer.y - ny * flank,
                        pdx * 0.3,
                        pdy * 0.3,
                        -1,
                        48,
                        0.3 + speedNorm * 0.3
                    );
                    this.prevPointer.x = pointer.x;
                    this.prevPointer.y = pointer.y;
                }
            } else {
                this.prevPointer.x = pointer.x;
                this.prevPointer.y = pointer.y;
                this.prevPointer.active = true;
            }
        } else {
            this.prevPointer.active = false;
        }

        // Swirl dynamics: drift slightly with velocity and decay
        for (const s of this.swirls) {
            s.x += s.vx * dt * 0.4;
            s.y += s.vy * dt * 0.4;
            s.vx *= Math.exp(-dt * 1.5);
            s.vy *= Math.exp(-dt * 1.5);
        }

        for (const k of this.koi) this.stepKoi(k, dt);
        this.stepLettuce(dt);
        const t = this.time;
        this.swirls = this.swirls.filter((s) => t - s.born < 2.0);
        this.ripples = this.ripples.filter((r) => t - r.born < rippleLife(r));
    }

    private stepLettuce(dt: number) {
        const { width: W, height: H, time, pointer } = this;
        for (const letu of this.lettuces) {
            // Ambient floating drift around base anchor
            const driftX =
                Math.cos(time * 0.45 + letu.driftPhase) * 12 + Math.sin(time * 0.22 + letu.driftPhase * 1.7) * 6;
            const driftY =
                Math.sin(time * 0.4 + letu.driftPhase) * 10 + Math.cos(time * 0.18 + letu.driftPhase * 2.3) * 5;
            const targetX = letu.baseX + driftX;
            const targetY = letu.baseY + driftY;

            // Soft spring returning to anchor area (allows natural drifting when bumped)
            const springK = 0.85;
            letu.vx += (targetX - letu.x) * springK * dt;
            letu.vy += (targetY - letu.y) * springK * dt;

            // 1. PHYSICAL FISH INTERACTION across all fish and all spine nodes
            for (const k of this.koi) {
                for (let n = 0; n < KOI_NODES; n += 2) {
                    const nx = k.nodes[n * 2];
                    const ny = k.nodes[n * 2 + 1];
                    const dkx = letu.x - nx;
                    const dky = letu.y - ny;
                    const dist = Math.hypot(dkx, dky) || 1;

                    // Fish body thickness profile along the spine
                    const s = n / (KOI_NODES - 1);
                    const bodyW =
                        (s < 0.12
                            ? 0.11 * Math.sqrt(s / 0.12)
                            : s < 0.3
                              ? 0.11 + 0.025 * ((s - 0.12) / 0.18)
                              : 0.033 + 0.102 * (1 - (s - 0.3) / 0.44)) * k.length;
                    const interactR = letu.radius + bodyW + 18;

                    if (dist < interactR) {
                        const overlap = 1 - dist / interactR;
                        const dirX = dkx / dist;
                        const dirY = dky / dist;

                        // Surface proximity factor (koi near surface push strongest)
                        const depthFactor = clamp((k.depth - 0.4) / 0.6, 0.4, 1.0);

                        // A. Physical displacement: pushes plant away from fish body
                        const pushSpeed = (k.speed * 1.1 + 60) * overlap * depthFactor;
                        letu.vx += dirX * pushSpeed * dt * 4.5;
                        letu.vy += dirY * pushSpeed * dt * 4.5;

                        // B. Forward wake drag: fish motion drags water and floating plant along
                        const swimDx = Math.cos(k.heading);
                        const swimDy = Math.sin(k.heading);
                        const wakeSpeed = k.speed * 0.6 * overlap * depthFactor;
                        letu.vx += swimDx * wakeSpeed * dt * 3.5;
                        letu.vy += swimDy * wakeSpeed * dt * 3.5;

                        // C. Tail beat turbulence if near the rear
                        if (n >= 12 && k.beat > 0.2) {
                            const tailImpulse = k.beat * 75 * overlap * depthFactor;
                            letu.vx += (dirX + Math.sin(k.phase) * 0.4) * tailImpulse * dt;
                            letu.vy += (dirY - Math.cos(k.phase) * 0.4) * tailImpulse * dt;
                        }

                        // D. Angular spin when brushed
                        const torque = swimDx * dirY - swimDy * dirX;
                        letu.angle += torque * 2.5 * dt * overlap;
                    }
                }
            }

            // 2. RIPPLE INTERACTION (expanding wavefronts push floating plants)
            for (const rp of this.ripples) {
                const age = time - rp.born;
                const waveRadius = age * 52;
                const rdx = letu.x - rp.x;
                const rdy = letu.y - rp.y;
                const rdist = Math.hypot(rdx, rdy) || 1;
                const band = 32;
                const distToFront = Math.abs(rdist - waveRadius);

                if (distToFront < band) {
                    const falloff = 1 - distToFront / band;
                    const life = rippleLife(rp);
                    const lifeFade = Math.max(0, 1 - age / life);
                    const waveImpulse = rp.strength * lifeFade * falloff * 160;
                    letu.vx += (rdx / rdist) * waveImpulse * dt * 4.0;
                    letu.vy += (rdy / rdist) * waveImpulse * dt * 4.0;
                    letu.angle += Math.sin(age * 12 + letu.id) * 0.9 * dt * falloff * rp.strength;
                }
            }

            // 3. SWIRL & EDDY COUPLING (vortices from fish turns and pointer)
            for (const s of this.swirls) {
                const sdx = letu.x - s.x;
                const sdy = letu.y - s.y;
                const sdist = Math.hypot(sdx, sdy) || 1;
                if (sdist < s.radius + letu.radius) {
                    const closeness = 1 - sdist / (s.radius + letu.radius);
                    const tangX = (-sdy / sdist) * s.spin * s.strength * 55 * closeness;
                    const tangY = (sdx / sdist) * s.spin * s.strength * 55 * closeness;
                    letu.vx += tangX * dt;
                    letu.vy += tangY * dt;
                    letu.angle += s.spin * s.strength * 2.2 * dt * closeness;
                }
            }

            // 4. MOUSE / POINTER DEFLECTION
            if (pointer.active) {
                const pdx = letu.x - pointer.x;
                const pdy = letu.y - pointer.y;
                const pdist = Math.hypot(pdx, pdy) || 1;
                const pRadius = letu.radius + 36;
                if (pdist < pRadius) {
                    const pOverlap = 1 - pdist / pRadius;
                    const pushF = pOverlap * (90 + pointer.speed * 0.1);
                    letu.vx += (pdx / pdist) * pushF * dt * 4.0;
                    letu.vy += (pdy / pdist) * pushF * dt * 4.0;
                }
            }

            // Water viscosity / hydrodynamic drag
            letu.vx *= Math.pow(0.88, dt * 60);
            letu.vy *= Math.pow(0.88, dt * 60);

            letu.x += letu.vx * dt;
            letu.y += letu.vy * dt;

            // Keep within pond perimeter
            letu.x = clamp(letu.x, letu.radius * 0.5, W - letu.radius * 0.5);
            letu.y = clamp(letu.y, letu.radius * 0.5, H - letu.radius * 0.5);

            // Ambient gentle rotation
            letu.angle += Math.sin(time * 0.25 + letu.driftPhase) * 0.04 * dt;
        }

        // Soft collision between clustered lettuce plants so they drift and nestle together
        for (let i = 0; i < this.lettuces.length; i++) {
            for (let j = i + 1; j < this.lettuces.length; j++) {
                const a = this.lettuces[i];
                const b = this.lettuces[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const d = Math.hypot(dx, dy) || 1;
                const minDist = (a.radius + b.radius) * 0.88;
                if (d < minDist) {
                    const overlap = (minDist - d) * 0.5;
                    const nx = dx / d;
                    const ny = dy / d;
                    a.x -= nx * overlap * 0.45;
                    a.y -= ny * overlap * 0.45;
                    b.x += nx * overlap * 0.45;
                    b.y += ny * overlap * 0.45;
                }
            }
        }
    }

    private stepKoi(k: Koi, dt: number) {
        const { width: W, height: H, pointer, time } = this;
        const L = k.length;
        const nodes = k.nodes;
        const hx = nodes[0];
        const hy = nodes[1];

        const fleeing = time < k.burstUntil && k.startle > 0.08;
        const cruise = 26 + L * 0.045;

        // Base swimming vector
        let dx = Math.cos(k.heading);
        let dy = Math.sin(k.heading);

        if (!fleeing) {
            k.wander = clamp(k.wander + (Math.random() - 0.5) * dt * 0.5, -0.35, 0.35);
            dx += Math.cos(k.heading + k.wander) * 0.35;
            dy += Math.sin(k.heading + k.wander) * 0.35;
        }

        // 1. Mouse disturbance & motion sensing across entire fish body
        let minPointerD = Infinity;
        for (let n = 0; n < KOI_NODES; n += 2) {
            const nx = nodes[n * 2];
            const ny = nodes[n * 2 + 1];
            const d = Math.hypot(nx - pointer.x, ny - pointer.y);
            if (d < minPointerD) minPointerD = d;
        }

        if (pointer.active) {
            const motionBonus = Math.min(220, pointer.speed * 0.18);
            const threatRadius = 180 + motionBonus;
            if (minPointerD < threatRadius) {
                const prox = 1 - minPointerD / threatRadius;
                const speedFactor = Math.min(2.5, pointer.speed / 180);
                const threat = prox * (0.8 + speedFactor * 1.4);

                // If not currently fleeing or threat escalated significantly, trigger a clean straight escape run!
                if (!fleeing || time > k.burstUntil - 0.4 || threat > k.startle + 0.25) {
                    this.triggerFlee(k, pointer.x, pointer.y, threat);
                }
            }
        }

        // 2. Ripple wavefront sensing
        for (const rp of this.ripples) {
            const age = time - rp.born;
            const life = rippleLife(rp);
            if (age <= 0.02 || age >= life) continue;

            const rWave = age * RIPPLE_SPEED * 1.2;
            const ox = hx - rp.x;
            const oy = hy - rp.y;
            const dist = Math.hypot(ox, oy) || 1;
            const waveDist = Math.abs(dist - rWave);

            if (waveDist < 60) {
                const waveIntensity = (1 - waveDist / 60) * Math.max(0, 1 - age / life) * rp.strength;
                if (waveIntensity > 0.14 && (!fleeing || time > k.burstUntil - 0.3)) {
                    this.triggerFlee(k, rp.x, rp.y, waveIntensity * 1.4);
                }
            }
        }

        // Apply fleeing steering force: clean, straight line in non-danger direction!
        if (fleeing) {
            dx = k.fleeX * 4.5;
            dy = k.fleeY * 4.5;
            k.startle = Math.max(0, k.startle - dt * 0.85);
        } else {
            k.startle = Math.max(0, k.startle - dt * 1.2);
        }

        if (!fleeing) {
            for (const other of this.koi) {
                if (other === k) continue;
                const ohx = other.nodes[0];
                const ohy = other.nodes[1];
                if (Math.abs(ohx - hx) > L * 2 || Math.abs(ohy - hy) > L * 2) continue;
                for (let n = 0; n < KOI_NODES; n += 3) {
                    const ox = hx - other.nodes[n * 2];
                    const oy = hy - other.nodes[n * 2 + 1];
                    const d = Math.hypot(ox, oy);
                    const range = (L + other.length) * 0.28;
                    if (d < range && d > 1e-3) {
                        const w = (1 - d / range) * 2.0;
                        dx += (ox / d) * w;
                        dy += (oy / d) * w;
                    }
                }
                if (Math.hypot(ohx - hx, ohy - hy) < L * 1.6) {
                    dx += Math.cos(other.heading) * 0.18;
                    dy += Math.sin(other.heading) * 0.18;
                }
            }

            repel(this.avoid, hx, hy, L * 0.4, push);
            dx += push.x * 1.8;
            dy += push.y * 1.8;
        }

        // Turn inward away from boundaries so koi freely cruise across the entire full-screen pond
        const edgeMargin = Math.max(70, L * 0.4);
        if (hx < edgeMargin) dx += ((edgeMargin - hx) / edgeMargin) * 5.0;
        else if (hx > W - edgeMargin) dx -= ((hx - (W - edgeMargin)) / edgeMargin) * 5.0;
        if (hy < edgeMargin) dy += ((edgeMargin - hy) / edgeMargin) * 5.0;
        else if (hy > H - edgeMargin) dy -= ((hy - (H - edgeMargin)) / edgeMargin) * 5.0;

        // Tail beats and sprint speed: natural burst-and-coast intermittent swimming
        if (time > k.nextBurst && time > k.burstUntil) {
            k.burstUntil = time + rand(0.8, 1.4);
            k.nextBurst = k.burstUntil + rand(4.0, 8.5);
            // Clean forward flick of the tail!
            k.speed = Math.max(k.speed, cruise * rand(1.5, 1.85));
            k.beat = rand(0.7, 0.85);
        }
        const activeBurst = fleeing || time < k.burstUntil;

        const desired = Math.atan2(dy, dx);
        // Clean, smooth turning: no rapid spinning or artificial swirling!
        const agility = fleeing ? 3.2 : activeBurst ? 1.6 : 0.9;
        const maxTurn = agility * dt;
        const turned = clamp(angleDiff(k.heading, desired), -maxTurn, maxTurn);
        k.heading += turned;
        k.turn += (turned / dt - k.turn) * Math.min(1, dt * 3.0);

        const targetBeat = activeBurst ? (fleeing ? 1.0 : 0.6) : 0;
        k.beat += (targetBeat - k.beat) * Math.min(1, dt * (fleeing ? 5.0 : 2.5));

        if (k.beat > 0.5 && k.depth > 0.65 && time > k.nextWake) {
            const tail = (KOI_NODES - 3) * 2;
            this.ripples.push({ x: nodes[tail], y: nodes[tail + 1], born: time, strength: 0.2 + 0.15 * k.depth });
            k.nextWake = time + rand(0.9, 1.8) / Math.max(0.4, k.beat);
        }

        const target = cruise * (fleeing ? 3.4 : activeBurst ? 1.3 : 0.75);
        k.speed += (target - k.speed) * Math.min(1, dt * (fleeing ? 3.0 : activeBurst ? 1.5 : 1.0));
        k.phase += dt * (0.5 + k.beat * (1.5 + k.speed / 16));
        k.finPhase += dt * 1.8;

        // Koi drift between the deep and the surface
        if (time > k.nextDive) {
            k.depthTarget = rand(0.5, k.depthMax);
            k.nextDive = time + rand(8, 20);
        }
        k.depth += (k.depthTarget - k.depth) * Math.min(1, dt * 0.15);

        nodes[0] += Math.cos(k.heading) * k.speed * dt;
        nodes[1] += Math.sin(k.heading) * k.speed * dt;

        // Keep snout within pond bounds with a cushion
        nodes[0] = clamp(nodes[0], 12, W - 12);
        nodes[1] = clamp(nodes[1], 12, H - 12);

        const seg = L / (KOI_NODES - 1);
        const maxBend = 0.2;
        let prevAngle = k.heading + Math.PI;
        for (let n = 1; n < KOI_NODES; n++) {
            const px = nodes[(n - 1) * 2];
            const py = nodes[(n - 1) * 2 + 1];
            let angle = Math.atan2(nodes[n * 2 + 1] - py, nodes[n * 2] - px);
            angle = prevAngle + clamp(angleDiff(prevAngle, angle), -maxBend, maxBend);
            nodes[n * 2] = px + Math.cos(angle) * seg;
            nodes[n * 2 + 1] = py + Math.sin(angle) * seg;
            prevAngle = angle;
        }

        if (time > k.nextSurface) {
            this.ripples.push({ x: nodes[0], y: nodes[1], born: time, strength: 0.3 });
            k.nextSurface = time + rand(8, 20);
        }

        // Active tail beat wake ripples when swimming near the surface
        if (k.depth > 0.68 && k.beat > 0.35 && time > k.nextWake) {
            const tail = (KOI_NODES - 3) * 2;
            this.ripples.push({
                x: nodes[tail],
                y: nodes[tail + 1],
                born: time,
                strength: 0.22 + 0.28 * k.beat,
            });
            k.nextWake = time + rand(0.5, 1.2);
        }
    }
}

export function rippleLife(r: Ripple) {
    return 2.2 + r.strength * 1.6;
}
