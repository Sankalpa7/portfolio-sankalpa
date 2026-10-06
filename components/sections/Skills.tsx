"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";

type CatId = "web" | "data" | "tools";
type Locale = "en" | "fi";
type Translations = ReturnType<typeof useLang>["t"];

type Skill = { name: string; icon: string };

type Category = {
  id: CatId;
  number: string;
  color: string;
  rgb: string;
  hubIcon: string;
  hubLines: [string, string];
  skills: Skill[];
};

const CATEGORIES: Category[] = [
  {
    id: "web",
    number: "01",
    color: "#06b6d4",
    rgb: "6,182,212",
    hubIcon: "💻",
    hubLines: ["WEB", "STACK"],
    skills: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "JavaScript", icon: "📜" },
      { name: "HTML5", icon: "🌐" },
      { name: "CSS3", icon: "🎨" },
      { name: "Bootstrap", icon: "🅱️" },
    ],
  },
  {
    id: "data",
    number: "02",
    color: "#22c55e",
    rgb: "34,197,94",
    hubIcon: "📊",
    hubLines: ["DATA", "& ML"],
    skills: [
      { name: "Python", icon: "🐍" },
      { name: "Scikit-learn", icon: "🤖" },
      { name: "Pandas", icon: "🐼" },
      { name: "SQL", icon: "🗄️" },
      { name: "R", icon: "📈" },
      { name: "Tableau", icon: "📉" },
      { name: "Matplotlib", icon: "📊" },
      { name: "Google Sheets", icon: "📋" },
    ],
  },
  {
    id: "tools",
    number: "03",
    color: "#a855f7",
    rgb: "168,85,247",
    hubIcon: "🛠️",
    hubLines: ["IT", "STACK"],
    skills: [
      { name: "GitHub", icon: "🐙" },
      { name: "Linux", icon: "🐧" },
      { name: "Jupyter", icon: "📓" },
      { name: "Azure AD", icon: "☁️" },
      { name: "Active Directory", icon: "🖥️" },
      { name: "VMware", icon: "⚙️" },
      { name: "ServiceNow", icon: "🎫" },
      { name: "Office365", icon: "📧" },
    ],
  },
];

const LABELS: Record<Locale, Record<CatId, string>> = {
  en: { web: "Web & Frontend", data: "Data & ML", tools: "Tools & IT" },
  fi: { web: "Web & Frontend", data: "Data & ML", tools: "Työkalut & IT" },
};

const DESCRIPTIONS: Record<Locale, Record<CatId, string>> = {
  en: {
    web: "Building fast, modern interfaces — from React components to full Next.js applications.",
    data: "From raw datasets to trained models, working with supervised learning and real-world data.",
    tools:
      "Comfortable in enterprise IT environments — from Azure AD and Linux to everyday tooling.",
  },
  fi: {
    web: "Nopeiden, modernien käyttöliittymien rakentamista — React-komponenteista kokonaisiin Next.js-sovelluksiin.",
    data: "Raakadatasta koulutettuihin malleihin — ohjattua oppimista ja oikeaa dataa.",
    tools:
      "Sujuvaa työskentelyä yritysten IT-ympäristöissä — Azure AD:sta ja Linuxista arjen työkaluihin.",
  },
};

// Wheel geometry (the wheel box is 340 x 420 px)
const HUB_CX = 170;
const HUB_CY = 310;
const ORBIT_R = 130;
const ANIM_DUR = 700;
const PAUSE_DUR = 2000;
const SESSION_KEY = "skillsAwardsSeen";
const VIEWPORT = { once: true, margin: "-120px" } as const;

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const anglePos = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: HUB_CX + ORBIT_R * Math.cos(rad),
    y: HUB_CY + ORBIT_R * Math.sin(rad),
  };
};

/* ---------------- Wheel ---------------- */

function Flyer({
  icon,
  rgb,
  startDeg,
  endDeg,
  entering,
  onDone,
}: {
  icon: string;
  rgb: string;
  startDeg: number;
  endDeg: number;
  entering: boolean;
  onDone?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const render = (raw: number) => {
      const eased = easeInOutCubic(raw);
      const pos = anglePos(startDeg + (endDeg - startDeg) * eased);
      el.style.left = `${pos.x - 28}px`;
      el.style.top = `${pos.y - 28}px`;

      const relY = (pos.y - (HUB_CY - ORBIT_R)) / (2 * ORBIT_R);
      const depth = entering ? relY : 1 - relY;
      const opacity = entering
        ? Math.max(0, 1 - depth * 1.2)
        : Math.max(0, depth * 1.2 - 0.2);
      const blur = entering ? depth * 6 : (1 - depth) * 6;
      const scale = entering ? 0.6 + (1 - depth) * 0.4 : 0.6 + depth * 0.4;

      el.style.opacity = String(opacity);
      el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.transform = `scale(${scale.toFixed(3)})`;
    };

    let raf = 0;
    const startTime = performance.now();
    render(0);

    const frame = (now: number) => {
      const raw = Math.min((now - startTime) / ANIM_DUR, 1);
      render(raw);
      if (raw < 1) raf = requestAnimationFrame(frame);
      else doneRef.current?.();
    };
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, [startDeg, endDeg, entering]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute z-20 flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl opacity-0 backdrop-blur"
      style={{
        background: `rgba(${rgb},0.10)`,
        borderColor: `rgba(${rgb},0.22)`,
      }}
    >
      {icon}
    </div>
  );
}

function SkillWheel({ cat }: { cat: Category }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef);

  const [idx, setIdx] = useState(0);
  const [moving, setMoving] = useState(false);
  const [showIncoming, setShowIncoming] = useState(false);

  const count = cat.skills.length;
  const current = cat.skills[idx];
  const incoming = cat.skills[(idx + 1) % count];

  // Idle: after a pause, either swap instantly (reduced motion) or start the flyers.
  // Paused whenever the wheel is off-screen.
  useEffect(() => {
    if (!inView || moving) return;
    const id = setTimeout(() => {
      if (reduced) setIdx((i) => (i + 1) % count);
      else setMoving(true);
    }, PAUSE_DUR);
    return () => clearTimeout(id);
  }, [inView, moving, idx, reduced, count]);

  // The incoming flyer starts slightly after the outgoing one
  useEffect(() => {
    if (!moving) return;
    const id = setTimeout(() => setShowIncoming(true), 60);
    return () => clearTimeout(id);
  }, [moving]);

  const finish = useCallback(() => {
    setIdx((i) => (i + 1) % count);
    setMoving(false);
    setShowIncoming(false);
  }, [count]);

  const shown = !moving;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative -mt-2 mx-auto h-[420px] w-[340px] flex-shrink-0 md:-mt-4 md:mx-0 md:mr-auto"
    >
      {/* orbit ring */}
      <div
        className="pointer-events-none absolute bottom-5 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full border border-dashed border-black/10 dark:border-white/5"
        style={{ borderColor: `rgba(${cat.rgb},0.10)` }}
      />

      {/* one-shot pulse each time a new skill lands */}
      {shown && !reduced && (
        <motion.div
          key={idx}
          className="pointer-events-none absolute bottom-5 left-1/2 -ml-[90px] h-[180px] w-[180px] rounded-full border-2"
          style={{ borderColor: cat.color }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* hub */}
      <div
        className="absolute bottom-5 left-1/2 z-10 flex h-[180px] w-[180px] -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-full border backdrop-blur-xl"
        style={{
          background: `rgba(${cat.rgb},0.10)`,
          borderColor: `rgba(${cat.rgb},0.35)`,
          color: cat.color,
          boxShadow: "0 18px 60px rgba(2,6,23,0.06)",
        }}
      >
        <div className="text-3xl">{cat.hubIcon}</div>
        <div className="text-center font-syne text-[10px] font-semibold leading-snug tracking-[0.18em]">
          {cat.hubLines[0]}
          <br />
          {cat.hubLines[1]}
        </div>
      </div>

      {/* active skill */}
      <div className="pointer-events-none absolute bottom-[220px] left-1/2 z-20 flex w-48 -translate-x-1/2 flex-col items-center gap-2">
        <div
          className={[
            "whitespace-nowrap rounded-md border px-3.5 py-1 font-mono text-[11px] transition-all duration-300",
            shown ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0",
          ].join(" ")}
          style={{
            color: cat.color,
            borderColor: `rgba(${cat.rgb},0.30)`,
            background: `rgba(${cat.rgb},0.08)`,
          }}
        >
          {current.name}
        </div>
        <div
          className={[
            "flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl transition-all duration-300",
            shown ? "scale-100 opacity-100" : "scale-90 opacity-0",
          ].join(" ")}
          style={{
            background: `rgba(${cat.rgb},0.12)`,
            borderColor: `rgba(${cat.rgb},0.40)`,
            boxShadow: `0 0 24px rgba(${cat.rgb},0.25), 0 0 8px rgba(${cat.rgb},0.16)`,
          }}
        >
          {current.icon}
        </div>
      </div>

      {/* flyers */}
      {moving && (
        <Flyer
          icon={current.icon}
          rgb={cat.rgb}
          startDeg={-90}
          endDeg={90}
          entering={false}
        />
      )}
      {moving && showIncoming && (
        <Flyer
          icon={incoming.icon}
          rgb={cat.rgb}
          startDeg={190}
          endDeg={270}
          entering
          onDone={finish}
        />
      )}
    </div>
  );
}

/* ---------------- Section ---------------- */

export default function Skills() {
  const { t, locale: rawLocale } = useLang();
  const locale: Locale = rawLocale === "fi" ? "fi" : "en";

  const [activeId, setActiveId] = useState<CatId>("web");
  const [achievementsUnlocked, setAchievementsUnlocked] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const activeCat = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  const catLabel = (id: CatId) => LABELS[locale][id];
  const catDesc = (id: CatId) => DESCRIPTIONS[locale][id];

  const awardItems = useMemo(
    () => [
      {
        year: "2023",
        type: locale === "fi" ? "Apuraha" : "Scholarship",
        title:
          locale === "fi"
            ? "Reidar Haglunds -rahasto — Åbo Akademi"
            : "Reidar Haglunds Fund — Åbo Akademi University",
        body:
          locale === "fi"
            ? "Tiedekuntakohtainen apuraha vahvoista opintosuorituksista ja potentiaalista tietotekniikassa."
            : "Faculty-specific scholarship awarded for strong academic results and potential in computer engineering.",
      },
      {
        year: "2023",
        type: locale === "fi" ? "Palkinto" : "Award",
        title:
          locale === "fi"
            ? `${t.skills.awards.best} — ICT Showroom (Åbo Akademi)`
            : `${t.skills.awards.best} — ICT Showroom (Åbo Akademi University)`,
        body:
          locale === "fi"
            ? `Finalisti 41 tiimin joukossa ja ${t.skills.awards.best} -palkinnon voittaja tQit-järjestelmällä; tunnustus teknisestä laadusta ja käytännön vaikutuksesta.`
            : `Finalist among 41 teams and winner of the ${t.skills.awards.best} award for the tQit digital queuing system, recognised for technical quality and real-world impact.`,
      },
    ],
    [locale, t],
  );

  const highlightProject = useMemo(
    () => ({
      name: "tQit — Digital Queue Management System",
      body:
        locale === "fi"
          ? "tQit digitalisoi jonottamisen: asiakkaat liittyvät jonoon sovelluksella ja seuraavat paikkaansa reaaliajassa. Henkilökunta näkee jonotilanteen ja kutsuu seuraavan yhdellä painalluksella. Toimin projektipäällikkönä ja front-end -suunnittelijana — koordinoin tiimiä, vedin sprinttejä Scrum/Kanbanilla ja suunnittelin käyttökokemuksen HTML/CSS/JS:llä."
          : "The tQit system is a software solution that digitalises and improves the experience of entering a queue for an establishment. Users join through the app and track their position in real time. Staff see a live overview and call the next person with a tap. I led the project in a hybrid product owner and front-end designer role — coordinating the team, running sprints with Scrum/Kanban, and designing the user journey and interface using HTML, CSS and JavaScript.",
    }),
    [locale],
  );

  // Remember within this browser session that the awards were already unlocked
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1")
        setAchievementsUnlocked(true);
    } catch {
      /* storage unavailable: just start locked */
    }
  }, []);

  const handleOverlayDone = useCallback(() => {
    setOverlayActive(false);
    setAchievementsUnlocked(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const triggerCelebration = () => {
    if (overlayActive) return;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    setOverlayActive(true);
  };

  const onTabKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = CATEGORIES.findIndex((c) => c.id === activeId);
    const step = e.key === "ArrowRight" ? 1 : CATEGORIES.length - 1;
    const next = CATEGORIES[(i + step) % CATEGORIES.length];
    setActiveId(next.id);
    document.getElementById(`skills-tab-${next.id}`)?.focus();
  };

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-slate-50 py-24 text-slate-900 dark:bg-[#080808] dark:text-white"
    >
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10 lg:px-0">
        {/* heading */}
        <div className="mb-2 flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
            {t.skills.section}
          </span>
          <div className="h-px w-10 bg-cyan-500/80" />
          <h2 className="font-syne text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {t.skills.title}
          </h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
        </div>

        <p className="mb-6 max-w-xl font-mono text-xs text-slate-600 dark:text-zinc-400 md:text-sm">
          {t.skills.subtitle}
        </p>

        {/* tabs */}
        <div className="mb-8">
          <div
            role="tablist"
            onKeyDown={onTabKeyDown}
            className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white/70 p-1 backdrop-blur dark:border-zinc-800 dark:bg-black/40"
          >
            {CATEGORIES.map((cat) => {
              const active = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  id={`skills-tab-${cat.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="skills-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveId(cat.id)}
                  className={[
                    "rounded-md px-4 py-1.5 font-mono text-[11px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500",
                    active
                      ? "-translate-y-px font-semibold text-black shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_10px_25px_rgba(2,6,23,0.10)]"
                      : "text-slate-600 hover:bg-slate-100/70 dark:text-zinc-500 dark:hover:bg-white/5",
                  ].join(" ")}
                  style={active ? { background: cat.color } : undefined}
                >
                  {catLabel(cat.id)}
                </button>
              );
            })}
          </div>
        </div>

        {/* wheel + text (only the active category is mounted) */}
        <div
          id="skills-panel"
          role="tabpanel"
          aria-labelledby={`skills-tab-${activeCat.id}`}
          className="flex flex-col items-center gap-8 md:flex-row md:justify-between lg:gap-16 xl:gap-24"
        >
          <SkillWheel key={activeCat.id} cat={activeCat} />

          <div className="mt-8 flex-1 md:mt-0 md:flex md:flex-col md:justify-center md:pl-10 lg:pl-16 xl:pl-24">
            <div
              className="mb-2 font-syne text-6xl font-black text-transparent md:text-7xl"
              style={{
                WebkitTextStrokeWidth: "1.7px",
                WebkitTextStrokeColor: activeCat.color,
                filter: "drop-shadow(0 0 20px rgba(2,6,23,0.10))",
              }}
              aria-hidden="true"
            >
              {activeCat.number}
            </div>

            <h3
              className="mb-4 font-syne text-2xl font-bold md:text-3xl"
              style={{ color: activeCat.color }}
            >
              {catLabel(activeCat.id)}
            </h3>

            <p className="mb-6 max-w-md font-mono text-xs text-slate-600 dark:text-zinc-400 md:text-sm">
              {catDesc(activeCat.id)}
            </p>

            <ul className="flex flex-wrap gap-2">
              {activeCat.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-full border px-3 py-1.5 font-mono text-[11px]"
                  style={{
                    borderColor: activeCat.color + "33",
                    color: activeCat.color,
                    background: activeCat.color + "10",
                  }}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-20" />

        {!achievementsUnlocked && (
          <motion.div
            className="mb-10 flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400 md:text-xs">
              {locale === "fi" ? "avaa palkinnot" : "unlocked by skills"}
            </p>
            <p className="max-w-md font-mono text-xs text-slate-600 dark:text-zinc-400 md:text-sm">
              {locale === "fi"
                ? "Kuin “kuukauden työntekijä” -seinä — mutta tekniikalle. Klikkaa nähdäksesi palkinnot, apurahat ja tQit-tarinan."
                : "Like the “Employee of the Month” wall — but for tech. Click below to see the awards, scholarships and tQit story these skills have earned."}
            </p>
            <motion.button
              type="button"
              onClick={triggerCelebration}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 px-6 py-2.5 font-mono text-xs font-semibold text-black shadow-lg shadow-cyan-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 md:text-sm"
            >
              {locale === "fi"
                ? "Näytä palkinnot & apurahat"
                : "Show my awards & scholarships"}
              <span className="ml-2" aria-hidden="true">
                ⭐
              </span>
            </motion.button>
          </motion.div>
        )}

        {achievementsUnlocked && (
          <AchievementsBlock
            t={t}
            locale={locale}
            awardItems={awardItems}
            highlightProject={highlightProject}
            onReplay={triggerCelebration}
          />
        )}
      </div>

      <AnimatePresence>
        {overlayActive && (
          <AwardsOverlay t={t} locale={locale} onComplete={handleOverlayDone} />
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="/award.mp3" preload="none" />
    </section>
  );
}

/* ---------------- Overlay + achievements ---------------- */

function AwardsOverlay({
  onComplete,
  t,
  locale,
}: {
  onComplete: () => void;
  t: Translations;
  locale: Locale;
}) {
  const doneRef = useRef(onComplete);

  useEffect(() => {
    doneRef.current = onComplete;
  });

  // Auto-close after 3.6s, or on Escape. The ref keeps parent re-renders from resetting the timer.
  useEffect(() => {
    const timer = setTimeout(() => doneRef.current(), 3600);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") doneRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-label={locale === "fi" ? "Kohokohta avattu" : "Highlight unlocked"}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <div
        className="absolute h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 max-w-md rounded-3xl border border-amber-300/50 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 px-8 py-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.65)] dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-900/10"
        initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-emerald-300 shadow-[0_0_40px_rgba(253,224,71,0.7)]"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
        >
          <span className="text-2xl" aria-hidden="true">
            ⭐
          </span>
        </motion.div>

        <motion.p
          className="mb-1 font-mono text-[11px] uppercase tracking-[0.24em] text-amber-700/80 dark:text-amber-200"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          {locale === "fi" ? "kohokohta avattu" : "highlight unlocked"}
        </motion.p>

        <motion.h3
          className="mb-1 font-syne text-lg font-semibold text-amber-900 dark:text-amber-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
        >
          {t.skills.awards.best} — tQit
        </motion.h3>

        <motion.p
          className="font-mono text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/90"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          {locale === "fi"
            ? "ICT Showroom, Åbo Akademi · Finalisti 41 tiimin joukossa ja Best IT Solution -voittaja."
            : "ICT Showroom, Åbo Akademi University · Finalist among 41 teams and winner of the Best IT Solution award."}
        </motion.p>

        <motion.p
          className="mt-3 font-mono text-[11px] text-amber-800/80 dark:text-amber-200"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          {locale === "fi"
            ? "Scrollaa alas nähdäksesi koko tarinan ja muut palkinnot."
            : "Scroll down to see the full story and other awards."}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function AchievementsBlock({
  onReplay,
  t,
  locale,
  awardItems,
  highlightProject,
}: {
  onReplay: () => void;
  t: Translations;
  locale: Locale;
  awardItems: { year: string; type: string; title: string; body: string }[];
  highlightProject: { name: string; body: string };
}) {
  const cardIn = (delay: number, y = -50) => ({
    initial: { opacity: 0, y, rotate: -2, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, rotate: 0, scale: 1 },
    viewport: VIEWPORT,
    transition: { type: "spring" as const, stiffness: 260, damping: 20, delay },
  });

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative mb-8" aria-hidden="true">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-[3px] origin-left rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 shadow-[0_0_25px_rgba(34,211,238,0.7)]"
        />
      </div>

      <div className="mb-2 flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
          {t.skills.awards.badge}
        </span>
        <div className="h-px w-10 bg-cyan-500/80" />
        <h3 className="font-syne text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
          {t.skills.awards.title}
        </h3>
        <button
          type="button"
          onClick={onReplay}
          className="ml-auto font-mono text-[11px] text-cyan-600/80 underline-offset-4 hover:text-cyan-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-cyan-400/80 dark:hover:text-cyan-300"
        >
          {t.skills.awards.replay}
        </button>
      </div>

      <p className="mb-8 max-w-xl font-mono text-xs text-slate-600 dark:text-zinc-400 md:text-sm">
        {locale === "fi"
          ? "Apurahat ja tunnustukset, jotka muovasivat matkaani — tiedekuntatason palkinnoista palkittuun tQit-järjestelmään."
          : "Scholarships and recognitions that shaped my journey — from faculty-level awards to building an award-winning digital queuing system."}
      </p>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.1fr_minmax(0,1.2fr)] md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              {...cardIn(0.15)}
              className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-white/5"
            >
              <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
                2
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600 dark:text-zinc-400">
                {t.skills.awards.major}
              </p>
            </motion.div>

            <motion.div
              {...cardIn(0.27)}
              className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-white/5"
            >
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                1st
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600 dark:text-zinc-400">
                {t.skills.awards.best}
              </p>
            </motion.div>
          </div>

          <motion.div
            {...cardIn(0.4)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 shadow-sm dark:border-zinc-800 dark:bg-white/5"
          >
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              {t.skills.awards.featured}
            </p>
            <h4 className="mb-2 font-syne text-sm font-semibold text-slate-900 dark:text-white md:text-base">
              {highlightProject.name}
            </h4>
            <p className="font-mono text-xs leading-relaxed text-slate-600 dark:text-zinc-400 md:text-sm">
              {highlightProject.body}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div
            className="absolute bottom-0 left-[10px] top-0"
            aria-hidden="true"
          >
            <div className="h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/40 to-emerald-500/0" />
          </div>

          <div className="space-y-5">
            {awardItems.map((award, idx) => (
              <motion.div
                key={award.title}
                {...cardIn(0.55 + idx * 0.2, -60)}
                className="relative pl-10"
              >
                <div
                  className="absolute left-[2px] top-3 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(34,211,238,0.18)]"
                  aria-hidden="true"
                />
                <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-white/5">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-500">
                      {award.year}
                    </span>
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/8 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                      {award.type}
                    </span>
                  </div>
                  <h4 className="mb-1 font-syne text-sm font-semibold text-slate-900 dark:text-white md:text-[15px]">
                    {award.title}
                  </h4>
                  <p className="font-mono text-xs leading-relaxed text-slate-600 dark:text-zinc-400 md:text-sm">
                    {award.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
