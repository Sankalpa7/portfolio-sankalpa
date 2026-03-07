"use client";

import { useEffect, useRef } from "react";

const techs = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "JavaScript", icon: "JS" },
  { name: "HTML5", icon: "🌐" },
  { name: "CSS3", icon: "🎨" },
  { name: "Node.js", icon: "🟢" },
  { name: "Express", icon: "🚂" },
  { name: "Django", icon: "🎸" },
  { name: "Python", icon: "🐍" },
  { name: "Java", icon: "☕" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Firebase", icon: "🔥" },
  { name: "MySQL", icon: "🐬" },
  { name: "OpenAI", icon: "🤖" },
  { name: "Claude AI", icon: "🧠" },
  { name: "LangChain", icon: "🔗" },
  { name: "HuggingFace", icon: "🤗" },
  { name: "TensorFlow", icon: "🧩" },
  { name: "AWS", icon: "☁️" },
  { name: "Docker", icon: "🐳" },
  { name: "Vercel", icon: "▲" },
  { name: "Git", icon: "🔀" },
  { name: "REST APIs", icon: "🔌" },
  { name: "GitHub CI", icon: "⚡" },
  { name: "C / C++", icon: "⚙️" },
];

const legend = [
  { label: "Frontend", color: "#61dafb" },
  { label: "Backend", color: "#68a063" },
  { label: "AI / ML", color: "#a855f7" },
  { label: "DevOps", color: "#fb923c" },
  { label: "Database", color: "#22c55e" },
  { label: "Language", color: "#eab308" },
];

function fibonacciSphere(n: number) {
  const pts: { x: number; y: number; z: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  const angleX = useRef(0.3);
  const angleY = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const rafRef = useRef<number>(0);

  const speedRef = useRef(4);
  const radiusRef = useRef(140);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const positions = fibonacciSphere(techs.length);

    type Item = {
      el: HTMLDivElement;
      iconEl: HTMLDivElement;
      labelEl: HTMLDivElement;
      ox: number;
      oy: number;
      oz: number;
    };

    const items: Item[] = [];
    container.innerHTML = "";

    const isDark = () => document.documentElement.classList.contains("dark");
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const getThemeTokens = () => {
      if (isDark()) {
        return {
          iconBg: "rgba(255,255,255,0.05)",
          iconBorder: "rgba(255,255,255,0.09)",
          label: "rgba(255,255,255,0.55)",
        };
      }
      return {
        iconBg: "rgba(2,6,23,0.06)",
        iconBorder: "rgba(2,6,23,0.14)",
        label: "rgba(15,23,42,0.78)",
      };
    };

    const applyThemeToItem = (item: Item) => {
      const tok = getThemeTokens();
      item.iconEl.style.background = tok.iconBg;
      item.iconEl.style.borderColor = tok.iconBorder;
      item.labelEl.style.color = tok.label;
      item.labelEl.style.display = isMobile() ? "none" : "block";
    };

    techs.forEach((tech, i) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;
        top:50%;
        left:50%;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:4px;
        cursor:pointer;
        user-select:none;
        transform:translate(-50%,-50%);
        transition:filter .2s;
        will-change: transform, opacity;
        pointer-events:auto;
      `;

      const iconEl = document.createElement("div");
      iconEl.style.cssText = `
        width:40px;
        height:40px;
        border-radius:12px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:1.1rem;
        border:1px solid transparent;
        transition: background .2s, border-color .2s;
      `;
      iconEl.textContent = tech.icon;

      const labelEl = document.createElement("div");
      labelEl.style.cssText = `
        font-size:0.55rem;
        font-family:var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        white-space:nowrap;
        transition: color .2s;
      `;
      labelEl.textContent = tech.name;

      el.appendChild(iconEl);
      el.appendChild(labelEl);

      const item: Item = {
        el,
        iconEl,
        labelEl,
        ox: positions[i].x,
        oy: positions[i].y,
        oz: positions[i].z,
      };

      applyThemeToItem(item);

      el.addEventListener("mouseenter", () => {
        if (isMobile()) return;
        el.style.filter = "drop-shadow(0 0 10px rgba(6,182,212,0.85))";
        iconEl.style.background = "rgba(6,182,212,0.15)";
        iconEl.style.borderColor = "rgba(6,182,212,0.55)";
        labelEl.style.color = "#06b6d4";
      });

      el.addEventListener("mouseleave", () => {
        el.style.filter = "none";
        applyThemeToItem(item);
      });

      container.appendChild(el);
      items.push(item);
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const minSide = Math.min(rect.width, rect.height);

      const padding = isMobile() ? 28 : 56;
      radiusRef.current = Math.max(95, minSide / 2 - padding);

      items.forEach(applyThemeToItem);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function rotateX(p: { x: number; y: number; z: number }, a: number) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
    }
    function rotateY(p: { x: number; y: number; z: number }, a: number) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
    }

    function render() {
      const R = radiusRef.current;
      for (const item of items) {
        let p = { x: item.ox, y: item.oy, z: item.oz };
        p = rotateX(p, angleX.current);
        p = rotateY(p, angleY.current);

        const depth = (p.z + 1.6) / 2.6;
        const x = p.x * R;
        const y = p.y * R;

        const s = 0.64 + depth * 0.58;
        item.el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${s})`;
        item.el.style.opacity = String(0.32 + depth * 0.68);
        item.el.style.zIndex = String(Math.floor((p.z + 2) * 1000));
      }
    }

    function animate() {
      if (!isDragging.current) {
        const speed = speedRef.current;
        angleY.current += speed * 0.0045;
        angleX.current += speed * 0.0018;
        velX.current *= 0.94;
        velY.current *= 0.94;
        angleX.current += velX.current * 0.007;
        angleY.current += velY.current * 0.007;
      }
      render();
      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      velX.current = 0;
      velY.current = 0;
      container.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      velX.current = dy * 0.25;
      velY.current = dx * 0.25;
      angleX.current += dy * 0.004;
      angleY.current += dx * 0.004;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    const observer = new MutationObserver(() =>
      items.forEach(applyThemeToItem),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mq = window.matchMedia("(max-width: 767px)");
    const onMq = () => resize();
    mq.addEventListener?.("change", onMq);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      ro.disconnect();
      mq.removeEventListener?.("change", onMq);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[620px]">
        <div className="absolute inset-0 dark:hidden pointer-events-none">
          <div className="absolute inset-0 rounded-[34px] bg-white/80 backdrop-blur-lg shadow-[0_30px_120px_rgba(2,6,23,0.12)]" />
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-violet-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative px-6 py-7 dark:px-0 dark:py-0">
          <div className="relative w-full aspect-square">
            <div className="absolute inset-0 pointer-events-none hidden dark:block">
              <div className="absolute w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl animate-pulse left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                ref={containerRef}
                className="relative w-full h-full cursor-grab active:cursor-grabbing"
                style={{ userSelect: "none", touchAction: "none" }}
              />
            </div>
          </div>

          {/* Mobile-only slider */}
          <div className="flex md:hidden flex-col items-center gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-mono">
                slow
              </span>
              <input
                type="range"
                min="0"
                max="10"
                defaultValue="4"
                onChange={(e) => {
                  speedRef.current = parseFloat(e.target.value);
                }}
                className="w-28 h-1 accent-cyan-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-mono">
                fast
              </span>
            </div>
          </div>

          {/* Desktop-only extras */}
          <div className="hidden md:flex flex-col items-center gap-3 mt-6">
            <p className="text-slate-600 dark:text-zinc-400 text-[11px] font-mono tracking-wide text-center">
              {"// "}
              <span className="text-cyan-600 dark:text-cyan-400">drag</span>
              {" to rotate · "}
              <span className="text-cyan-600 dark:text-cyan-400">hover</span>
              {" to explore"}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-mono">
                slow
              </span>
              <input
                type="range"
                min="0"
                max="10"
                defaultValue="4"
                onChange={(e) => {
                  speedRef.current = parseFloat(e.target.value);
                }}
                className="w-24 h-1 accent-cyan-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-mono">
                fast
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 max-w-xs pt-1">
              {legend.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/10"
                    style={{ background: item.color }}
                  />
                  <span className="text-slate-700 dark:text-zinc-300 text-[11px] font-mono tracking-wide">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
