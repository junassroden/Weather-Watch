import {
    useEffect,
    useRef,
} from "react";

import { getWeatherType } from "./WeatherVisual";

/* ------------------------------------------------------------------ */
/* Scene palettes — every weather type gets its own sky, cloud, and   */
/* precipitation treatment. Nothing here is decorative-only; the type */
/* is derived directly from the Open-Meteo weather_code (see          */
/* WeatherVisual.getWeatherType), so the scene always matches data.   */
/* ------------------------------------------------------------------ */

const SCENES = {
    clear: {
        sky: ["#0c2c4a", "#2f6f93", "#f3c583"],
        stops: [0, 0.55, 1],
        sun: true,
        clouds: 0,
        cloudColor: ["#eef4f1", "#c7d8d6", "#7f9a9c"],
        horizonGlow: "rgba(246,201,118,.35)",
        precip: null,
    },
    partly: {
        sky: ["#123a5c", "#3a7ca0", "#e9b877"],
        stops: [0, 0.55, 1],
        sun: true,
        clouds: 2,
        cloudColor: ["#f2f6f4", "#c3d3d2", "#6d878a"],
        horizonGlow: "rgba(233,184,119,.28)",
        precip: null,
    },
    overcast: {
        sky: ["#22323c", "#3c525c", "#5d7078"],
        stops: [0, 0.6, 1],
        sun: false,
        clouds: 3,
        cloudColor: ["#c4d0d1", "#93a3a6", "#4c5c61"],
        horizonGlow: "rgba(147,163,166,.18)",
        precip: null,
    },
    fog: {
        sky: ["#3c4c50", "#6c8285", "#9fb0af"],
        stops: [0, 0.5, 1],
        sun: false,
        clouds: 1,
        cloudColor: ["#dbe6e4", "#aebcbb", "#7c8f8f"],
        horizonGlow: "rgba(200,214,212,.2)",
        precip: null,
        fogBands: 4,
    },
    drizzle: {
        sky: ["#182a33", "#2d434c", "#48606a"],
        stops: [0, 0.6, 1],
        sun: false,
        clouds: 3,
        cloudColor: ["#a9bcbe", "#7a8f92", "#3d4e54"],
        horizonGlow: "rgba(117,212,210,.1)",
        precip: { kind: "rain", density: 26, speed: 1, length: 10 },
    },
    rain: {
        sky: ["#131f26", "#233640", "#374b53"],
        stops: [0, 0.6, 1],
        sun: false,
        clouds: 3,
        cloudColor: ["#94a8ab", "#66797d", "#323f44"],
        horizonGlow: "rgba(117,212,210,.12)",
        precip: { kind: "rain", density: 46, speed: 1.6, length: 16 },
    },
    showers: {
        sky: ["#152229", "#283c46", "#3e535c"],
        stops: [0, 0.58, 1],
        sun: false,
        clouds: 3,
        cloudColor: ["#9dafb1", "#6f8285", "#374349"],
        horizonGlow: "rgba(117,212,210,.14)",
        precip: { kind: "rain", density: 40, speed: 1.9, length: 14 },
    },
    snow: {
        sky: ["#1c2b38", "#33495a", "#6a8592"],
        stops: [0, 0.55, 1],
        sun: false,
        clouds: 2,
        cloudColor: ["#e4edee", "#b9c9cc", "#6d8489"],
        horizonGlow: "rgba(190,214,220,.22)",
        precip: { kind: "snow", density: 30, speed: 0.35, length: 3 },
    },
    storm: {
        sky: ["#080c11", "#141d26", "#202b35"],
        stops: [0, 0.55, 1],
        sun: false,
        clouds: 4,
        cloudColor: ["#5c6a70", "#39444a", "#161d22"],
        horizonGlow: "rgba(117,212,210,.05)",
        precip: { kind: "rain", density: 64, speed: 2.4, length: 20 },
        lightning: true,
    },
    unknown: {
        sky: ["#14212a", "#26383f", "#3c5158"],
        stops: [0, 0.6, 1],
        sun: false,
        clouds: 1,
        cloudColor: ["#a7b7b8", "#7a8c8e", "#465356"],
        horizonGlow: "rgba(117,212,210,.1)",
        precip: null,
    },
};

/* Small deterministic PRNG so cloud/particle layouts are stable across
   re-renders and resizes for a given card, instead of jittering. */
function makeRng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h) || 1;
}

/* Build one soft, volumetric cloud-puff cluster onto an offscreen
   canvas. Blurring + shading happen once here, not per animation
   frame, so the runtime cost of drifting a cloud layer is a single
   drawImage call. */
function buildCloudSprite(width, height, rng, colors) {
    const pad = Math.max(28, height * 0.4);
    const sprite = document.createElement("canvas");
    sprite.width = Math.max(1, Math.round(width + pad * 2));
    sprite.height = Math.max(1, Math.round(height + pad * 2));
    const ctx = sprite.getContext("2d");

    const puffCount = 5 + Math.floor(rng() * 3);
    const baseY = sprite.height * 0.55;

    ctx.filter = `blur(${Math.max(6, height * 0.16)}px)`;
    ctx.fillStyle = colors[1];
    ctx.beginPath();
    for (let i = 0; i < puffCount; i++) {
        const t = i / (puffCount - 1);
        const cx = pad + t * width;
        const cy = baseY - Math.sin(t * Math.PI) * height * 0.32 + (rng() - 0.5) * height * 0.12;
        const rx = (width / puffCount) * (0.85 + rng() * 0.5);
        const ry = height * (0.4 + rng() * 0.22);
        ctx.moveTo(cx + rx, cy);
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Volumetric shading, clipped to the already-drawn silhouette.
    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-atop";
    const shade = ctx.createLinearGradient(0, baseY - height * 0.6, 0, baseY + height * 0.6);
    shade.addColorStop(0, colors[0]);
    shade.addColorStop(0.55, colors[1]);
    shade.addColorStop(1, colors[2]);
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, sprite.width, sprite.height);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    return sprite;
}

function buildFogSprite(width, height) {
    const sprite = document.createElement("canvas");
    sprite.width = Math.max(1, Math.round(width * 1.6));
    sprite.height = Math.max(1, Math.round(height));
    const ctx = sprite.getContext("2d");
    ctx.filter = `blur(${Math.max(10, height * 0.4)}px)`;
    const grad = ctx.createLinearGradient(0, 0, sprite.width, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, sprite.height * 0.15, sprite.width, sprite.height * 0.5);
    return sprite;
}

/* A soft, cratered moon disc baked once — cheap to redraw every frame
   as a single drawImage instead of rebuilding radial gradients. */
function buildMoonSprite(size, seedValue) {
    const rng = makeRng(seedValue);
    const s = Math.max(40, Math.round(size));
    const sprite = document.createElement("canvas");
    sprite.width = s;
    sprite.height = s;
    const c = sprite.getContext("2d");
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.32;

    const glow = c.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
    glow.addColorStop(0, "rgba(226,232,238,.22)");
    glow.addColorStop(1, "rgba(226,232,238,0)");
    c.fillStyle = glow;
    c.beginPath();
    c.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
    c.fill();

    const body = c.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    body.addColorStop(0, "#f4f7f9");
    body.addColorStop(0.6, "#d7dee3");
    body.addColorStop(1, "#a9b4bc");
    c.fillStyle = body;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();

    // A few soft craters, clipped to the disc via source-atop so they
    // never spill past the moon's silhouette.
    c.globalCompositeOperation = "source-atop";
    c.globalAlpha = 0.35;
    for (let i = 0; i < 5; i++) {
        const angle = rng() * Math.PI * 2;
        const dist = rng() * r * 0.7;
        const cratR = r * (0.08 + rng() * 0.14);
        c.fillStyle = "#98a3ab";
        c.beginPath();
        c.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, cratR, 0, Math.PI * 2);
        c.fill();
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";

    return sprite;
}

/* Star positions/phases are generated once per scene build; only their
   twinkle opacity is animated per frame, so a whole field of stars
   costs one small loop of arc() fills rather than any gradient work. */
function buildStarField(width, height, count, seedValue) {
    const rng = makeRng(seedValue);
    return Array.from({ length: count }, () => ({
        x: rng() * width,
        y: rng() * height * 0.72,
        r: 0.5 + rng() * 1.1,
        phase: rng() * Math.PI * 2,
        speed: 0.6 + rng() * 0.8,
    }));
}

/* Soft god-ray sprite for sunny/partly-sunny scenes, baked once onto an
   offscreen canvas so animating it at runtime is a single drawImage +
   rotate instead of rebuilding gradients every frame. */
function buildLightRaySprite(size, seedValue) {
    const rng = makeRng(seedValue);
    const s = Math.max(40, Math.round(size));
    const sprite = document.createElement("canvas");
    sprite.width = s;
    sprite.height = s;
    const c = sprite.getContext("2d");
    const rayCount = 6 + Math.floor(rng() * 3);

    c.translate(s / 2, s / 2);
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + rng() * 0.3;
        const length = s * (0.42 + rng() * 0.1);
        const spread = 0.05 + rng() * 0.03;
        const grad = c.createLinearGradient(0, 0, Math.cos(angle) * length, Math.sin(angle) * length);
        grad.addColorStop(0, "rgba(255,238,196,0.16)");
        grad.addColorStop(1, "rgba(255,238,196,0)");
        c.fillStyle = grad;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(angle - spread) * length, Math.sin(angle - spread) * length);
        c.lineTo(Math.cos(angle + spread) * length, Math.sin(angle + spread) * length);
        c.closePath();
        c.fill();
    }
    return sprite;
}

export default function WeatherEnvironment({
    code,
    isDay = true,
    className = "",
}) {
    const type = getWeatherType(code);
    const scene = SCENES[type] || SCENES.unknown;

    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return undefined;

        const ctx = canvas.getContext("2d");
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const reduceMotion =
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const seed = hashCode(`${type}-${isDay ? "d" : "n"}`);
        const rng = makeRng(seed);

        let width = 0;
        let height = 0;
        let cloudLayers = [];
        let fogSprite = null;
        let lightRaySprite = null;
        let moonSprite = null;
        let stars = [];
        let rainDrops = [];
        let snowFlakes = [];
        let lastTime = 0;
        let elapsed = 0;
        let nextFlash = 3 + rng() * 5;
        let flashStrength = 0;
        let flashBranchSeed = rng();

        // Rain/snow/storm bands span a range of Open-Meteo codes; within a
        // band, the top of the range genuinely means heavier weather (e.g.
        // code 65 is "heavy rain" vs 61 "slight rain"). Scale density and
        // darkness by how far into the band the code sits, so a heavy-rain
        // day actually looks heavier than a light one instead of every
        // "rain" code rendering identically.
        const intensity = (() => {
            if (code === null || code === undefined) return 0;
            if (type === "rain") return Math.min(1, Math.max(0, (code - 61) / 6));
            if (type === "showers") return Math.min(1, Math.max(0, (code - 80) / 2));
            if (type === "drizzle") return Math.min(1, Math.max(0, (code - 51) / 6));
            return 0;
        })();

        function buildScene() {
            const rect = wrap.getBoundingClientRect();
            width = Math.max(1, Math.round(rect.width));
            height = Math.max(1, Math.round(rect.height));

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cloudRng = makeRng(seed + 7);
            cloudLayers = Array.from({ length: scene.clouds }, (_, i) => {
                const layerHeight = height * (0.3 + i * 0.06);
                const layerWidth = width * (1.3 + cloudRng() * 0.4);
                return {
                    sprite: buildCloudSprite(layerWidth, layerHeight, cloudRng, scene.cloudColor),
                    width: layerWidth,
                    y: height * (0.08 + i * 0.14) + cloudRng() * height * 0.05,
                    speed: (0.12 + i * 0.05 + cloudRng() * 0.05) * (i % 2 === 0 ? 1 : -0.8),
                    x: cloudRng() * width,
                    opacity: 0.55 + i * 0.1,
                };
            });

            fogSprite = scene.fogBands ? buildFogSprite(width, height / 3) : null;
            lightRaySprite = scene.sun && isDay ? buildLightRaySprite(Math.max(width, height) * 1.6, seed + 45) : null;
            moonSprite = scene.sun && !isDay ? buildMoonSprite(Math.min(width, height) * 0.7, seed + 51) : null;
            stars = !isDay && scene.sun
                ? buildStarField(width, height, 46, seed + 63)
                : [];

            if (scene.precip?.kind === "rain") {
                const rainRng = makeRng(seed + 21);
                const density = Math.round(scene.precip.density * (1 + intensity * 0.5));
                rainDrops = Array.from({ length: density }, () => ({
                    x: rainRng() * width,
                    y: rainRng() * height,
                    len: scene.precip.length * (0.6 + rainRng() * 0.8) * (1 + intensity * 0.3),
                    speed: scene.precip.speed * (0.7 + rainRng() * 0.7) * 260 * (1 + intensity * 0.25),
                    drift: (rainRng() - 0.5) * 18,
                    opacity: (0.25 + rainRng() * 0.35) * (1 + intensity * 0.2),
                }));
            }

            if (scene.precip?.kind === "snow") {
                const snowRng = makeRng(seed + 33);
                snowFlakes = Array.from({ length: scene.precip.density }, () => ({
                    x: snowRng() * width,
                    y: snowRng() * height,
                    r: 1.2 + snowRng() * 2,
                    speed: scene.precip.speed * (0.5 + snowRng() * 0.8) * 40,
                    sway: 6 + snowRng() * 14,
                    phase: snowRng() * Math.PI * 2,
                    opacity: 0.5 + snowRng() * 0.4,
                }));
            }
        }

        function drawSky(t) {
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(scene.stops[0], scene.sky[0]);
            grad.addColorStop(scene.stops[1], scene.sky[1]);
            grad.addColorStop(scene.stops[2], scene.sky[2]);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            if (scene.horizonGlow) {
                const glow = ctx.createRadialGradient(
                    width * 0.5, height * 1.02, 0,
                    width * 0.5, height * 1.02, width * 0.75
                );
                glow.addColorStop(0, scene.horizonGlow);
                glow.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, width, height);
            }

            // Slow ambient light breathing for overcast/neutral scenes,
            // so even "static" weather still feels alive.
            if (!scene.sun && !scene.precip) {
                const pulse = 0.04 + Math.sin(t * 0.0004) * 0.03;
                ctx.fillStyle = `rgba(255,255,255,${Math.max(0, pulse)})`;
                ctx.fillRect(0, 0, width, height);
            }

            if (!isDay) {
                ctx.fillStyle = "rgba(4,8,14,0.42)";
                ctx.fillRect(0, 0, width, height);
            }
        }

        function drawStars(t) {
            if (!stars.length) return;
            for (const star of stars) {
                const twinkle = 0.4 + Math.abs(Math.sin(t * 0.0006 * star.speed + star.phase)) * 0.6;
                ctx.globalAlpha = twinkle;
                ctx.fillStyle = "#f2f6f8";
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        function drawMoon(t) {
            if (!moonSprite) return;
            const cx = width * 0.72;
            const cy = height * 0.26;
            const pulse = 1 + Math.sin(t * 0.0005) * 0.03;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(pulse, pulse);
            ctx.drawImage(moonSprite, -moonSprite.width / 2, -moonSprite.height / 2);
            ctx.restore();
        }

        // A soft radial darkening toward the card's edges. Cheap (one
        // gradient fill) and gives the scene a touch of cinematic depth
        // instead of reading as a flat, evenly-lit rectangle.
        function drawVignette() {
            const vignette = ctx.createRadialGradient(
                width * 0.5, height * 0.46, Math.min(width, height) * 0.2,
                width * 0.5, height * 0.5, Math.max(width, height) * 0.75
            );
            vignette.addColorStop(0, "rgba(0,0,0,0)");
            vignette.addColorStop(1, "rgba(0,0,0,0.22)");
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);
        }

        function drawSun(t) {
            if (!scene.sun || !isDay) return;
            const cx = width * 0.72;
            const cy = height * 0.28;
            const pulse = 1 + Math.sin(t * 0.0006) * 0.06;
            const r = Math.min(width, height) * 0.22 * pulse;

            const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.6);
            corona.addColorStop(0, "rgba(255,224,170,.32)");
            corona.addColorStop(1, "rgba(255,224,170,0)");
            ctx.fillStyle = corona;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 2.6, 0, Math.PI * 2);
            ctx.fill();

            const core = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
            core.addColorStop(0, "#fff6d6");
            core.addColorStop(0.5, "#f7c471");
            core.addColorStop(1, "#d98f4a");
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawLightRays(t) {
            if (!lightRaySprite) return;
            const cx = width * 0.72;
            const cy = height * 0.28;
            const rotation = t * 0.00003;

            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.drawImage(lightRaySprite, -lightRaySprite.width / 2, -lightRaySprite.height / 2);
            ctx.restore();
        }

        function drawClouds(t) {
            for (const layer of cloudLayers) {
                layer.x += layer.speed * (t.dt / 16.7);
                const span = layer.width;
                let x = ((layer.x % span) + span) % span - span * 0.15;
                ctx.globalAlpha = layer.opacity;
                while (x < width) {
                    ctx.drawImage(
                        layer.sprite,
                        x - layer.sprite.width * 0.5 + span * 0.08,
                        layer.y - layer.sprite.height * 0.5
                    );
                    x += span;
                }
                ctx.globalAlpha = 1;
            }
        }

        function drawFog(t) {
            if (!fogSprite) return;
            const bands = scene.fogBands;
            for (let i = 0; i < bands; i++) {
                const speed = (i % 2 === 0 ? 1 : -0.7) * (10 + i * 4);
                const laneH = height / bands;
                const y = laneH * i;
                const drift = (t.elapsed * speed * 0.02) % (fogSprite.width);
                ctx.globalAlpha = 0.35 + (i % 2) * 0.15;
                ctx.drawImage(fogSprite, drift - fogSprite.width, y - fogSprite.height * 0.3, fogSprite.width, fogSprite.height);
                ctx.drawImage(fogSprite, drift, y - fogSprite.height * 0.3, fogSprite.width, fogSprite.height);
            }
            ctx.globalAlpha = 1;
        }

        function drawRain(t) {
            if (!rainDrops.length) return;
            ctx.lineCap = "round";
            for (const drop of rainDrops) {
                drop.y += drop.speed * (t.dt / 1000);
                drop.x += drop.drift * (t.dt / 1000);
                if (drop.y > height) {
                    drop.y = -drop.len;
                    drop.x = Math.random() * width;
                }
                const tailX = drop.x - drop.len * 0.18;
                const tailY = drop.y + drop.len;

                // Dim wide pass for body, then a thin bright core so the
                // drop reads as a wet, lit streak rather than a flat line.
                ctx.strokeStyle = "rgba(180,210,214,0.55)";
                ctx.lineWidth = 1.6;
                ctx.globalAlpha = drop.opacity;
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                ctx.strokeStyle = "rgba(235,248,248,0.9)";
                ctx.lineWidth = 0.6;
                ctx.globalAlpha = drop.opacity * 0.85;
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.lineCap = "butt";
        }

        function drawSnow(t) {
            if (!snowFlakes.length) return;
            ctx.fillStyle = "#f4f9f8";
            for (const flake of snowFlakes) {
                flake.y += flake.speed * (t.dt / 1000);
                const sway = Math.sin(t.elapsed * 0.0012 + flake.phase) * flake.sway * (t.dt / 1000);
                flake.x += sway;
                if (flake.y > height) {
                    flake.y = -4;
                    flake.x = Math.random() * width;
                }
                ctx.globalAlpha = flake.opacity;
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        function drawLightning(t) {
            if (!scene.lightning) return;
            elapsed += t.dt / 1000;
            if (elapsed >= nextFlash && flashStrength <= 0) {
                flashStrength = 1;
                flashBranchSeed = rng();
                nextFlash = elapsed + 4 + rng() * 6;
            }
            if (flashStrength > 0) {
                ctx.fillStyle = `rgba(210,230,240,${flashStrength * 0.45})`;
                ctx.fillRect(0, 0, width, height);

                if (flashStrength > 0.6) {
                    const boltRng = makeRng(Math.floor(flashBranchSeed * 1e6) || 1);
                    const bx = width * (0.3 + boltRng() * 0.3);
                    const mainSegments = 4;
                    let x = bx;
                    let y = 0;
                    const path = [[x, y]];
                    for (let i = 0; i < mainSegments; i++) {
                        x += (boltRng() - 0.5) * width * 0.09;
                        y += (height * 0.75) / mainSegments;
                        path.push([x, y]);
                    }

                    ctx.strokeStyle = `rgba(255,255,255,${flashStrength})`;
                    ctx.lineWidth = 2;
                    ctx.lineJoin = "round";
                    ctx.beginPath();
                    ctx.moveTo(path[0][0], path[0][1]);
                    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
                    ctx.stroke();

                    // One or two thinner forks branching off the main
                    // channel, each fading out after a short run.
                    const branchCount = 1 + Math.floor(boltRng() * 2);
                    for (let b = 0; b < branchCount; b++) {
                        const startIdx = 1 + Math.floor(boltRng() * (path.length - 2));
                        let [fx, fy] = path[startIdx];
                        const dir = boltRng() < 0.5 ? -1 : 1;
                        ctx.strokeStyle = `rgba(255,255,255,${flashStrength * 0.55})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(fx, fy);
                        for (let s = 0; s < 3; s++) {
                            fx += dir * boltRng() * width * 0.05;
                            fy += height * 0.08;
                            ctx.lineTo(fx, fy);
                        }
                        ctx.stroke();
                    }
                }
                flashStrength -= t.dt / 260;
                if (flashStrength < 0) flashStrength = 0;
            }
        }

        function frame(now) {
            if (!lastTime) lastTime = now;
            const dt = Math.min(64, now - lastTime);
            lastTime = now;
            elapsed += dt / 1000;

            if (visibleRef.current) {
                ctx.clearRect(0, 0, width, height);
                drawSky(now);
                drawStars(now);
                drawMoon(now);
                drawSun(now);
                drawLightRays(now);
                drawClouds({ dt, elapsed });
                drawFog({ dt, elapsed });
                drawRain({ dt, elapsed });
                drawSnow({ dt, elapsed });
                drawLightning({ dt, elapsed });
                drawVignette();

                if (!reduceMotion) {
                    rafRef.current = requestAnimationFrame(frame);
                }
            } else {
                // Off-screen: stop scheduling frames entirely instead of
                // burning a requestAnimationFrame callback every tick for
                // cards the user can't currently see. The intersection
                // observer below restarts the loop when it scrolls back
                // into view.
                rafRef.current = null;
            }
        }

        buildScene();

        if (reduceMotion) {
            drawSky(0);
            drawStars(0);
            drawMoon(0);
            drawSun(0);
            drawLightRays(0);
            drawClouds({ dt: 0, elapsed: 0 });
            drawFog({ dt: 0, elapsed: 0 });
            drawVignette();
        } else {
            rafRef.current = requestAnimationFrame(frame);
        }

        let resizeRaf = null;
        const resizeObserver = new ResizeObserver(() => {
            // Coalesce bursts of resize events (e.g. a window being
            // dragged) into a single rebuild per frame instead of
            // rebuilding every cloud/rain sprite on each intermediate tick.
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(() => {
                resizeRaf = null;
                buildScene();
            });
        });
        resizeObserver.observe(wrap);

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const wasVisible = visibleRef.current;
                    visibleRef.current = entry.isIntersecting;

                    if (entry.isIntersecting && !wasVisible && !reduceMotion && !rafRef.current) {
                        lastTime = 0;
                        rafRef.current = requestAnimationFrame(frame);
                    }
                }
            },
            { threshold: 0.05 }
        );
        intersectionObserver.observe(wrap);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
        };
    }, [type, isDay, scene, code]);

    return (
        <div
            className={`weather-environment ${className}`}
            ref={wrapRef}
            aria-hidden="true"
        >
            <canvas ref={canvasRef} />
        </div>
    );
}