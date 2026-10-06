"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";

type Category =
  | "Frontend"
  | "Backend"
  | "AI / ML"
  | "DevOps"
  | "Database"
  | "Language";

const LEGEND: { label: Category; color: string }[] = [
  { label: "Frontend", color: "#61dafb" },
  { label: "Backend", color: "#68a063" },
  { label: "AI / ML", color: "#a855f7" },
  { label: "DevOps", color: "#fb923c" },
  { label: "Database", color: "#22c55e" },
  { label: "Language", color: "#eab308" },
];

const COLOR_OF = Object.fromEntries(
  LEGEND.map((l) => [l.label, l.color]),
) as Record<Category, string>;

const TECHS: { name: string; icon: string; category: Category }[] = [
  { name: "React", icon: "⚛️", category: "Frontend" },
  { name: "Next.js", icon: "▲", category: "Frontend" },
  { name: "TypeScript", icon: "TS", category: "Language" },
  { name: "JavaScript", icon: "JS", category: "Language" },
  { name: "HTML5", icon: "🌐", category: "Frontend" },
  { name: "CSS3", icon: "🎨", category: "Frontend" },
  { name: "Node.js", icon: "🟢", category: "Backend" },
  { name: "Express", icon: "🚂", category: "Backend" },
  { name: "Django", icon: "🎸", category: "Backend" },
  { name: "Python", icon: "🐍", category: "Language" },
  { name: "Java", icon: "☕", category: "Language" },
  { name: "MongoDB", icon: "🍃", category: "Database" },
  { name: "Firebase", icon: "🔥", category: "Database" },
  { name: "MySQL", icon: "🐬", category: "Database" },
  { name: "OpenAI", icon: "🤖", category: "AI / ML" },
  { name: "Claude AI", icon: "🧠", category: "AI / ML" },
  { name: "LangChain", icon: "🔗", category: "AI / ML" },
  { name: "HuggingFace", icon: "🤗", category: "AI / ML" },
  { name: "TensorFlow", icon: "🧩", category: "AI / ML" },
  { name: "AWS", icon: "☁️", category: "DevOps" },
  { name: "Docker", icon: "🐳", category: "DevOps" },
  { name: "Vercel", icon: "▲", category: "DevOps" },
  { name: "Git", icon: "🔀", category: "DevOps" },
  { name: "REST APIs", icon: "🔌", category: "Backend" },
  { name: "GitHub CI", icon: "⚡", category: "DevOps" },
  { name: "C / C++", icon: "⚙️", category: "Language" },
];

const R = 135;
const DEFAULT_SPEED = 0.5; // matches the rotation speed you had before; raise for faster

function fibonacciSphere(n: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
}

const POINTS = fibonacciSphere(TECHS.length);

export default function TechSphere() {
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const angle = useRef({ x: 0.3, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });
  const speed = useRef(DEFAULT_SPEED);
  const visible = useRef(true);

  useEffect(() => {
    reducedRef.current = reduced;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const render = () => {
      const cx = Math.cos(angle.current.x);
      const sx = Math.sin(angle.current.x);
      const cy = Math.cos(angle.current.y);
      const sy = Math.sin(angle.current.y);

      POINTS.forEach((p, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        // rotate around X, then around Y
        const y1 = p.y * cx - p.z * sx;
        const z1 = p.y * sx + p.z * cx;
        const x2 = p.x * cy + z1 * sy;
        const z2 = -p.x * sy + z1 * cy;

        const depth = (z2 + 1.6) / 2.6;
        const s = 0.62 + depth * 0.58;
        el.style.transform = `translate3d(${x2 * R}px, ${y1 * R}px, 0) translate3d(-50%, -50%, 0) scale(${s})`;
        el.style.opacity = String(0.28 + depth * 0.72);
        el.style.zIndex = String(Math.floor((z2 + 2) * 1000));
      });
    };

    let raf = 0;
    const tick = () => {
      if (visible.current) {
        if (!drag.current.active) {
          const auto = reducedRef.current ? 0 : speed.current;
          angle.current.y += auto * 0.0045 + vel.current.y * 0.007;
          angle.current.x += auto * 0.0018 + vel.current.x * 0.007;
          vel.current.x *= 0.94;
          vel.current.y *= 0.94;
        }
        render();
      }
      raf = requestAnimationFrame(tick);
    };

    render();
    raf = requestAnimationFrame(tick);

    // Skip work while the sphere is scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    observer.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, x: e.clientX, y: e.clientY };
    vel.current = { x: 0, y: 0 };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    vel.current = { x: dy * 0.25, y: dx * 0.25 };
    angle.current.x += dy * 0.004;
    angle.current.y += dx * 0.004;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <div className="flex w-[420px] flex-col items-center gap-3">
      <div className="relative flex h-[360px] w-[360px] items-center justify-center">
        <div
          className="pointer-events-none absolute h-36 w-36 animate-pulse rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15"
          aria-hidden="true"
        />

        {/* touch-pan-y: vertical swipes still scroll the page on touch devices */}
        <div
          ref={containerRef}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        >
          {TECHS.map((tech, i) => (
            <div
              key={tech.name}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="group absolute left-1/2 top-1/2 flex cursor-pointer select-none flex-col items-center gap-[3px] will-change-transform [transition:filter_0.2s] hover:[filter:drop-shadow(0_0_8px_#06b6d4)]"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-900/10 bg-slate-900/[0.04] text-[1.1rem] transition-colors group-hover:border-cyan-500/50 group-hover:bg-cyan-500/15 dark:border-white/10 dark:bg-white/[0.04]">
                {tech.icon}
                <span
                  className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: COLOR_OF[tech.category] }}
                />
              </div>
              <div className="whitespace-nowrap font-mono text-[0.5rem] text-slate-900/70 transition-colors group-hover:text-cyan-500 dark:text-white/40">
                {tech.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="font-mono text-[11px] tracking-wide text-slate-600 dark:text-zinc-400">
        {"// "}
        <span className="text-cyan-600 dark:text-cyan-400">drag</span> to rotate
        · <span className="text-cyan-600 dark:text-cyan-400">hover</span> to
        explore
      </p>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-slate-600 dark:text-zinc-300">
          slow
        </span>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          defaultValue={DEFAULT_SPEED}
          aria-label="Rotation speed"
          onChange={(e) => {
            speed.current = parseFloat(e.target.value);
          }}
          className="h-1 w-24 cursor-pointer accent-cyan-500"
        />
        <span className="font-mono text-[11px] text-slate-600 dark:text-zinc-300">
          fast
        </span>
      </div>

      <ul className="flex max-w-xs flex-wrap justify-center gap-x-5 gap-y-1 pt-1">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/10"
              style={{ background: item.color }}
            />
            <span className="font-mono text-[11px] tracking-wide text-slate-700 dark:text-zinc-300">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
