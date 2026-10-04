import { useEffect, useMemo, useRef } from "react";
import { weatherKind } from "../lib/weather";

function ParticleCanvas({ kind, reducedMotion }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let raf = 0;
        let width = 0;
        let height = 0;
        let particles = [];
        let last = performance.now();

        const density = reducedMotion ? 0.18 : 1;
        const baseCount = kind === "heavy-rain" || kind === "storm" ? 260 : kind === "rain" ? 180 : kind === "snow" ? 140 : 52;

        const reset = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            particles = Array.from({ length: Math.max(16, Math.floor(baseCount * density)) }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random(),
                drift: (Math.random() - 0.5) * 0.4,
                phase: Math.random() * Math.PI * 2,
            }));
        };

        const resizeObserver = new ResizeObserver(reset);
        resizeObserver.observe(canvas);
        reset();

        const render = (now) => {
            const dt = Math.min(32, now - last) / 16.67;
            last = now;
            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                const depth = 0.28 + p.z * 0.95;
                if (["rain", "heavy-rain", "storm"].includes(kind)) {
                    const speed = (kind === "heavy-rain" || kind === "storm" ? 17 : 12) * depth * dt;
                    p.y += speed;
                    p.x += (2.2 + p.drift) * depth * dt;
                    if (p.y > height + 30 || p.x > width + 20) {
                        p.y = -30;
                        p.x = Math.random() * width - width * 0.1;
                    }
                    ctx.strokeStyle = `rgba(174, 220, 255, ${0.12 + p.z * 0.42})`;
                    ctx.lineWidth = 0.55 + p.z * 1.15;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - 5 * depth, p.y - 18 * depth);
                    ctx.stroke();
                } else if (kind === "snow") {
                    p.phase += 0.012 * dt;
                    p.y += (0.8 + p.z * 1.8) * dt;
                    p.x += Math.sin(p.phase) * 0.45 * dt;
                    if (p.y > height + 12) { p.y = -12; p.x = Math.random() * width; }
                    ctx.fillStyle = `rgba(244, 248, 252, ${0.22 + p.z * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 1.2 + p.z * 2.6, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    p.phase += 0.006 * dt;
                    p.y -= (0.08 + p.z * 0.12) * dt;
                    p.x += Math.sin(p.phase) * 0.08 * dt;
                    if (p.y < -5) p.y = height + 5;
                    ctx.fillStyle = `rgba(131, 207, 255, ${0.05 + p.z * 0.13})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 0.6 + p.z * 1.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            if (!reducedMotion) raf = requestAnimationFrame(render);
        };

        render(performance.now());
        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [kind, reducedMotion]);

    return <canvas ref={canvasRef} className="ww-particle-canvas" aria-hidden="true" />;
}

function Cloud({ className = "" }) {
    return (
        <div className={`ww-cloud ${className}`} aria-hidden="true">
            <i /><i /><i /><i /><i />
        </div>
    );
}

export default function WeatherScene3D({ code = 2, isDay = true, compact = false }) {
    const rootRef = useRef(null);
    const kind = weatherKind(code);
    const reducedMotion = useMemo(() => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || reducedMotion) return;
        let raf = 0;
        const move = (event) => {
            const rect = root.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                root.style.setProperty("--mx", x.toFixed(3));
                root.style.setProperty("--my", y.toFixed(3));
            });
        };
        const leave = () => {
            root.style.setProperty("--mx", "0");
            root.style.setProperty("--my", "0");
        };
        root.addEventListener("pointermove", move, { passive: true });
        root.addEventListener("pointerleave", leave);
        return () => {
            root.removeEventListener("pointermove", move);
            root.removeEventListener("pointerleave", leave);
            cancelAnimationFrame(raf);
        };
    }, [reducedMotion]);

    const cloudy = ["partly", "cloudy", "rain", "heavy-rain", "storm", "snow", "fog"].includes(kind);
    const wet = ["rain", "heavy-rain", "storm"].includes(kind);

    return (
        <div ref={rootRef} className={`ww-scene ww-scene--${kind} ${isDay ? "is-day" : "is-night"} ${compact ? "is-compact" : ""}`}>
            <div className="ww-scene-sky" />
            <div className="ww-scene-stars" aria-hidden="true" />
            <div className="ww-celestial-wrap" aria-hidden="true">
                <div className={`ww-celestial ${isDay ? "sun" : "moon"}`} />
                <div className="ww-celestial-halo" />
            </div>

            {cloudy && (
                <>
                    <Cloud className="cloud-back" />
                    <Cloud className="cloud-mid" />
                    <Cloud className="cloud-front" />
                    {(kind === "cloudy" || wet || kind === "storm") && <Cloud className="cloud-heavy" />}
                </>
            )}

            {kind === "fog" && <><div className="ww-fog fog-a" /><div className="ww-fog fog-b" /><div className="ww-fog fog-c" /></>}
            {kind === "storm" && <div className="ww-lightning" aria-hidden="true" />}
            <div className="ww-horizon-glow" aria-hidden="true" />
            <div className="ww-depth-ground" aria-hidden="true" />
            <ParticleCanvas kind={kind} reducedMotion={reducedMotion} />
            <div className="ww-scene-vignette" aria-hidden="true" />
        </div>
    );
}
