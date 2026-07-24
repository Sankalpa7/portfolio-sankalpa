"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type IntroLoaderProps = {
  accentColor: string;
  onDone: () => void;
};

/** ---------------- Icons (original colors) ---------------- */
const FACES = [
  {
    label: "Next.js",
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <circle cx="40" cy="40" r="40" fill="#000" />
        <path
          d="M22 56V24l36 32V24"
          stroke="#fff"
          strokeWidth="6"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "React",
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <circle cx="40" cy="40" r="7" fill="#61dafb" />
        <ellipse
          cx="40"
          cy="40"
          rx="34"
          ry="13"
          stroke="#61dafb"
          strokeWidth="3.5"
          fill="none"
        />
        <ellipse
          cx="40"
          cy="40"
          rx="34"
          ry="13"
          stroke="#61dafb"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(60 40 40)"
        />
        <ellipse
          cx="40"
          cy="40"
          rx="34"
          ry="13"
          stroke="#61dafb"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(120 40 40)"
        />
      </svg>
    ),
  },
  {
    label: "TypeScript",
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#3178c6" />
        <text
          x="8"
          y="60"
          fontFamily="Arial Black,sans-serif"
          fontSize="44"
          fontWeight="900"
          fill="#fff"
        >
          TS
        </text>
      </svg>
    ),
  },
  {
    label: "Tailwind",
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#0ea5e9" />
        <path
          d="M20 34c2.5-10 8.75-15 17.5-15 13.75 0 16.25 10 25 10 6.25 0 11.25-2.5 13.75-7.5C73.75 31.5 67.5 37 58.75 37c-13.75 0-16.25-10-25-10-6.25 0-11.25 2.5-13.75 7zm-10 16c2.5-10 8.75-15 17.5-15 13.75 0 16.25 10 25 10 6.25 0 11.25-2.5 13.75-7.5C63.75 47.5 57.5 53 48.75 53c-13.75 0-16.25-10-25-10-6.25 0-11.25 2.5-13.75 7z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    label: "Node.js",
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#1a1a1a" />
        <polygon
          points="40,8 68,24 68,56 40,72 12,56 12,24"
          fill="none"
          stroke="#68a063"
          strokeWidth="4"
        />
        <text
          x="24"
          y="50"
          fontFamily="Arial Black,sans-serif"
          fontSize="20"
          fontWeight="900"
          fill="#68a063"
        >
          JS
        </text>
      </svg>
    ),
  },
  {
    label: "Vercel",
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#111" />
        <polygon points="40,15 70,65 10,65" fill="#fff" />
      </svg>
    ),
  },
] as const;

const WELCOME_WORD = "Welcome";

/** Cube geometry */
const S = 50;
const FACE_SIZE = 100;

// Static, permanent face placements — the cube is always fully assembled.
const ASSEMBLED = [
  `translateZ(${S}px)`,
  `rotateY(180deg) translateZ(${S}px)`,
  `rotateY(-90deg) translateZ(${S}px)`,
  `rotateY(90deg) translateZ(${S}px)`,
  `rotateX(90deg) translateZ(${S}px)`,
  `rotateX(-90deg) translateZ(${S}px)`,
] as const;

/** ---------------- Ring geometry ---------------- */
const RING_SIZE = 260; // outer box that the circular progress ring occupies
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;
const CUBE_BOX = 220; // perspective box holding the cube (must be <= RING_SIZE)

/** ---------------- Color helpers ---------------- */
function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  if (full.length !== 6) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)
    ? { r, g, b }
    : null;
}

function cssColorToRgb(color: string) {
  const hx = color.trim();
  if (hx.startsWith("#")) return hexToRgb(hx);
  if (typeof window === "undefined") return null;
  const probe = document.createElement("span");
  probe.style.color = hx;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = resolved.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}

function rgbaFromAccent(accent: string, alpha: number) {
  const rgb = cssColorToRgb(accent) || { r: 34, g: 211, b: 238 };
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/** Shifts the accent color's hue by `deg` — used to build a multi-tone ring gradient */
function shiftHue(accent: string, deg: number) {
  const rgb = cssColorToRgb(accent) || { r: 34, g: 211, b: 238 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const nh = (hsl.h + deg + 360) % 360;
  const out = hslToRgb(
    nh,
    Math.min(1, hsl.s + 0.08),
    Math.min(0.72, hsl.l + 0.04),
  );
  return `rgb(${out.r},${out.g},${out.b})`;
}

/** ---------------- Particle BG (SMOOTHER) ---------------- */
function ParticleBg({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let w = (c.width = c.offsetWidth);
    let h = (c.height = c.offsetHeight);

    let g1: CanvasGradient | null = null;
    let g2: CanvasGradient | null = null;

    const rebuildGradients = () => {
      g1 = ctx.createRadialGradient(
        w * 0.25,
        h * 0.2,
        0,
        w * 0.25,
        h * 0.2,
        Math.min(w, h) * 0.55,
      );
      g1.addColorStop(0, rgbaFromAccent(accentColor, 0.08));
      g1.addColorStop(1, "transparent");

      g2 = ctx.createRadialGradient(
        w * 0.8,
        h * 0.65,
        0,
        w * 0.8,
        h * 0.65,
        Math.min(w, h) * 0.5,
      );
      g2.addColorStop(0, rgbaFromAccent(accentColor, 0.07));
      g2.addColorStop(1, "transparent");
    };
    rebuildGradients();

    const ro = new ResizeObserver(() => {
      w = c.width = c.offsetWidth;
      h = c.height = c.offsetHeight;
      rebuildGradients();
    });
    ro.observe(c);

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.05 + 0.25,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      a: Math.random() * 0.5 + 0.12,
    }));

    let raf = 0;
    let last = 0;

    const draw = (t = 0) => {
      if (reduceMotion) return;

      if (t - last < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = t;

      ctx.clearRect(0, 0, w, h);

      if (g1) {
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);
      }
      if (g2) {
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [accentColor]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/** Circular progress ring: outer static track + animated gradient arc */
function ProgressRing({
  progress,
  accentColor,
}: {
  progress: number;
  accentColor: string;
}) {
  const offset = RING_CIRC * (1 - Math.min(100, Math.max(0, progress)) / 100);
  const gradId = "introLoaderRingGradient";

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      className="absolute inset-0"
      style={{ transform: "rotate(-90deg)" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shiftHue(accentColor, -25)} />
          <stop offset="50%" stopColor={accentColor} />
          <stop offset="100%" stopColor={shiftHue(accentColor, 55)} />
        </linearGradient>
      </defs>

      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={RING_STROKE}
      />

      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_CIRC}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.18s ease-out",
          filter: `drop-shadow(0 0 10px ${accentColor}90)`,
        }}
      />
    </svg>
  );
}

export default function IntroLoader({ accentColor, onDone }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [flashAll, setFlashAll] = useState(false);
  const [allowPointer, setAllowPointer] = useState(true);

  const cubeRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeouts = useRef<number[]>([]);
  const finishedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    for (const id of timeouts.current) window.clearTimeout(id);
    timeouts.current = [];
  }, []);

  const setTO = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeouts.current.push(id);
    return id;
  }, []);

  const stopRAF = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  // Continuous slow tumble on every axis — never stops until we finish.
  const rot = useRef({ x: -18, y: -20, z: 0, vx: 0, vy: 0, vz: 0, t: 0 });

  const startSpin = useCallback(() => {
    stopRAF();
    const r = rot.current;

    const tick = () => {
      r.t += 0.008;

      const ty = r.y + 0.35; // slow continuous yaw, never settles
      const tx = -18 + Math.sin(r.t * 0.6) * 20;
      const tz = Math.sin(r.t * 0.4) * 10;

      r.vy += (ty - r.y) * 0.06;
      r.vy *= 0.86;
      r.y += r.vy;

      r.vx += (tx - r.x) * 0.03;
      r.vx *= 0.82;
      r.x += r.vx;

      r.vz += (tz - r.z) * 0.025;
      r.vz *= 0.8;
      r.z += r.vz;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `translateZ(0) rotateX(${r.x}deg) rotateY(${r.y}deg) rotateZ(${r.z}deg)`;
        cubeRef.current.style.willChange = "transform";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [stopRAF]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    setAllowPointer(false);
    stopRAF();
    clearAllTimers();
    onDone();
  }, [onDone, stopRAF, clearAllTimers]);

  // Start spinning immediately — the cube is always fully assembled.
  useEffect(() => {
    startSpin();
    return () => {
      stopRAF();
      clearAllTimers();
    };
  }, [startSpin, stopRAF, clearAllTimers]);

  // Progress ticks up; the moment it hits 100 we finish — no extra sequence after.
  useEffect(() => {
    let p = 0;
    const iv = window.setInterval(() => {
      const step =
        p < 72 ? Math.random() * 7 + 4 : p < 92 ? Math.random() * 3 + 2 : 2;
      p = Math.min(100, p + step);
      const pi = Math.floor(p);

      setProgress(pi);

      if (p >= 100) {
        window.clearInterval(iv);
        setFlashAll(true);
        setTO(() => finish(), 450);
      }
    }, 150);

    return () => window.clearInterval(iv);
  }, [finish, setTO]);

  // Stop/restart RAF when tab visibility changes
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) stopRAF();
      else if (!finishedRef.current) startSpin();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [startSpin, stopRAF]);

  // Esc skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const containerGlow = useMemo(
    () => ({
      boxShadow: flashAll
        ? `0 0 42px ${accentColor}`
        : `0 0 24px ${accentColor}55`,
    }),
    [flashAll, accentColor],
  );

  return (
    <motion.div
      className="fixed inset-0 z-[10050] overflow-hidden"
      style={{
        background: "#03010a",
        pointerEvents: allowPointer ? "auto" : "none",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <ParticleBg accentColor={accentColor} />

      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 z-50 rounded-full px-4 py-2 text-xs font-mono tracking-widest uppercase"
        style={{
          border: `1px solid ${accentColor}`,
          color: "rgba(255,255,255,0.9)",
          background: "rgba(255,255,255,0.06)",
          boxShadow: `0 0 18px ${accentColor}40`,
        }}
      >
        Skip (Esc)
      </button>

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative flex flex-col items-center">
          {/* Ring + cube, concentric */}
          <div
            className="relative"
            style={{ width: RING_SIZE, height: RING_SIZE }}
          >
            <ProgressRing progress={progress} accentColor={accentColor} />

            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: CUBE_BOX,
                height: CUBE_BOX,
                transform: "translate(-50%, -50%)",
                perspective: 700,
              }}
            >
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  width: FACE_SIZE,
                  height: FACE_SIZE,
                  transform: "translate(-50%, -50%)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  ref={cubeRef}
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d", ...containerGlow }}
                >
                  {FACES.map((face, i) => (
                    <div
                      key={face.label}
                      className="absolute left-1/2 top-1/2 grid place-items-center"
                      style={{
                        width: FACE_SIZE,
                        height: FACE_SIZE,
                        borderRadius: 18,
                        transformStyle: "preserve-3d",
                        border: `1px solid ${accentColor}`,
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: `0 0 22px ${accentColor}35`,
                        transform: `translate(-50%, -50%) ${ASSEMBLED[i]}`,
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-[18px]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.06))",
                          opacity: 0.55,
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-[18px]"
                        style={{
                          boxShadow: `inset 0 0 22px ${accentColor}28`,
                          pointerEvents: "none",
                        }}
                      />
                      <div className="relative z-10">
                        <face.Icon />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Percentage + Welcome reveal, under the ring */}
          <div className="mt-6 flex flex-col items-center">
            <div
              className="font-mono text-4xl font-extrabold tabular-nums tracking-wider"
              style={{
                color: "#fff",
                textShadow: `0 0 20px ${accentColor}70`,
              }}
            >
              {progress}%
            </div>

            {/* Reveals one letter per tick of the same `progress` value that fills
                the ring, so the word finishes exactly when the ring hits 100%.
                Each letter unrolls upward like a blind opening, and is rendered
                with a translucent glass-gradient fill (no card/background). */}
            <div className="mt-10 flex gap-1">
              {WELCOME_WORD.split("").map((ch, i) => {
                const revealCount = Math.min(
                  WELCOME_WORD.length,
                  Math.ceil((progress / 100) * WELCOME_WORD.length),
                );
                const shown = i < revealCount;
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      lineHeight: 1,
                    }}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        y: shown ? "0%" : "110%",
                        opacity: shown ? 1 : 0,
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-syne)",
                        fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
                        fontWeight: 800,
                        lineHeight: 1,
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 35%, ${accentColor}aa 70%, ${accentColor}66 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.45)) drop-shadow(0 0 18px ${accentColor}80)`,
                      }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
