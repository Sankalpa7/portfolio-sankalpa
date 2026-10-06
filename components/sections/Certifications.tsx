"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";
import {
  CERTIFICATIONS,
  type Certification,
  type Locale,
} from "@/lib/certifications";

type Slide = Omit<Certification, "description" | "skills"> & {
  description: string;
  skills: string[];
};

const UI = {
  en: {
    section: "// 05",
    title: "Certifications",
    subtitle:
      "A stacked deck of certificates — flip through the cards, then open any one to view the full document.",
    preview: "Preview",
    viewFull: "View full certificate",
    statCertificates: "Certificates",
    statLearningSince: "Learning since",
    statPlatforms: "Platforms",
    card: "Card",
    keysHint: "← → keys or swipe",
    modalPdfHint:
      "PDF rendered inline — use the built-in toolbar to zoom, download or print.",
    modalIssuedBy: "Issued by:",
    modalOpenDownload: "Open / Download",
    prev: "Previous certificate",
    next: "Next certificate",
    close: "Close",
    goTo: "Go to certificate",
    pdfFallback: "Your browser cannot show this PDF inline.",
  },
  fi: {
    section: "// 05",
    title: "Sertifikaatit",
    subtitle:
      "Korttipakka sertifikaateista — selaa kortteja ja avaa mikä tahansa nähdäksesi koko dokumentin.",
    preview: "Esikatselu",
    viewFull: "Näytä koko sertifikaatti",
    statCertificates: "Sertifikaatteja",
    statLearningSince: "Oppiminen alkanut",
    statPlatforms: "Alustoja",
    card: "Kortti",
    keysHint: "← → näppäimet tai pyyhkäisy",
    modalPdfHint:
      "PDF näkyy tässä — käytä työkalupalkkia zoomaukseen, lataukseen tai tulostukseen.",
    modalIssuedBy: "Myöntäjä:",
    modalOpenDownload: "Avaa / Lataa",
    prev: "Edellinen sertifikaatti",
    next: "Seuraava sertifikaatti",
    close: "Sulje",
    goTo: "Siirry sertifikaattiin",
    pdfFallback: "Selaimesi ei voi näyttää PDF:ää tässä.",
  },
} satisfies Record<Locale, Record<string, string>>;

// Quotes stay English
const QUOTES = [
  {
    text: "Every certificate is a door you unlocked — not by luck, but by showing up.",
    author: "On persistence",
  },
  {
    text: "The expert in anything was once a beginner who simply refused to quit.",
    author: "Helen Hayes",
  },
  {
    text: "An investment in knowledge always pays the best dividends.",
    author: "Benjamin Franklin",
  },
  {
    text: "Learning is not attained by chance; it must be sought with ardour and diligence.",
    author: "Abigail Adams",
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
  },
];

const ARROW_BTN =
  "flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm text-zinc-500 transition-all hover:border-cyan-400 hover:text-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";

function SkillPill({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="rounded-full border px-2.5 py-[3px] font-mono text-[10px]"
      style={{
        borderColor: accent + "40",
        color: accent,
        backgroundColor: accent + "12",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

function CardPreview({
  cert,
  onClick,
  isCardHovered,
  showHint,
  ctaLabel,
  previewLabel,
}: {
  cert: Slide;
  onClick: () => void;
  isCardHovered: boolean;
  showHint: boolean;
  ctaLabel: string;
  previewLabel: string;
}) {
  const pillClass = isCardHovered
    ? "scale-[1.1] bg-cyan-500 text-black shadow-[0_0_28px_rgba(34,211,238,0.75)]"
    : showHint
      ? "scale-[1.08] bg-cyan-200/90 text-cyan-900 shadow-[0_0_16px_rgba(34,211,238,0.45)]"
      : "scale-100 bg-white/80 text-zinc-900 shadow-md shadow-black/20 dark:bg-white/75";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[130px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-zinc-800 dark:bg-zinc-900 md:h-[140px]"
    >
      {cert.type === "image" ? (
        <img
          src={cert.src}
          alt={cert.title}
          loading="lazy"
          decoding="async"
          className={[
            "absolute inset-0 h-full w-full object-cover blur-[1px] brightness-[0.78] transition-transform duration-500 dark:brightness-[0.85]",
            isCardHovered ? "scale-[1.06]" : "scale-[1.03]",
          ].join(" ")}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 10% 0%, ${cert.accent}22 0, transparent 55%), radial-gradient(circle at 90% 100%, ${cert.accent}33 0, #020617 65%)`,
          }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-black/30 backdrop-blur-md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>
        </div>
      )}

      <div
        className={[
          "absolute inset-0 transition-colors duration-300",
          isCardHovered ? "bg-black/45" : "bg-black/10",
        ].join(" ")}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className={[
            "flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10px]",
            "transition-all duration-200 ease-out",
            pillClass,
          ].join(" ")}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden="true"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          {ctaLabel}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-8 items-end justify-between bg-gradient-to-t from-black/55 to-transparent px-3 pb-1.5">
        <span className="font-mono text-[9px] text-zinc-300 opacity-80">
          {previewLabel}
        </span>
        <span className="font-mono text-[9px]" style={{ color: cert.accent }}>
          {cert.year}
        </span>
      </div>
    </button>
  );
}

function ModalViewer({
  cert,
  fallbackText,
}: {
  cert: Slide;
  fallbackText: string;
}) {
  if (cert.type === "image") {
    return (
      <div
        className="relative w-full bg-zinc-900"
        style={{ maxHeight: "62vh" }}
      >
        <img
          src={cert.src}
          alt={cert.title}
          className="w-full object-contain"
          style={{ maxHeight: "62vh" }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full bg-zinc-900" style={{ height: "62vh" }}>
      <object
        data={`${cert.src}#toolbar=1&navpanes=0&scrollbar=1`}
        type="application/pdf"
        className="h-full w-full"
        aria-label={cert.title}
      >
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="font-mono text-xs text-zinc-400">
            {fallbackText}{" "}
            <a
              href={cert.src}
              target="_blank"
              rel="noreferrer"
              className="underline"
              style={{ color: cert.accent }}
            >
              PDF ↗
            </a>
          </p>
        </div>
      </object>
    </div>
  );
}

export default function Certifications() {
  const { locale } = useLang();
  const lang: Locale = locale === "fi" ? "fi" : "en";
  const ui = UI[lang];

  // Rebuilt on language change, no reload needed
  const slides = useMemo<Slide[]>(
    () =>
      CERTIFICATIONS.map((c) => ({
        ...c,
        description: c.description[lang],
        skills: c.skills[lang],
      })),
    [lang],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalId, setModalId] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [ctaHint, setCtaHint] = useState(true);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const inViewRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const active = slides[activeIndex];
  // Looked up from the current slides so the modal follows language changes
  const modalSlide = modalId
    ? (slides.find((s) => s.id === modalId) ?? null)
    : null;
  const modalOpen = modalSlide !== null;

  const goNext = useCallback(
    () => setActiveIndex((p) => (p + 1) % slides.length),
    [slides.length],
  );
  const goPrev = useCallback(
    () => setActiveIndex((p) => (p === 0 ? slides.length - 1 : p - 1)),
    [slides.length],
  );

  // Track whether the section is on screen (for keyboard navigation)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard: Escape closes the modal; arrows only work while the section is visible
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalId(null);
        return;
      }
      if (modalOpen || !inViewRef.current) return;

      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
      )
        return;

      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, goNext, goPrev]);

  // Lock page scroll while the modal is open and focus its close button
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [modalOpen]);

  // Rotating quotes
  useEffect(() => {
    const id = setInterval(
      () => setQuoteIndex((i) => (i + 1) % QUOTES.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  // Pulse the CTA briefly whenever the card or language changes
  useEffect(() => {
    setCtaHint(true);
    setIsCardHovered(false);
    const id = setTimeout(() => setCtaHint(false), 1200);
    return () => clearTimeout(id);
  }, [activeIndex, lang]);

  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();
    touchStartX.current = null;
  };

  const stats = [
    { val: `${slides.length}+`, label: ui.statCertificates },
    { val: "2019", label: ui.statLearningSince },
    { val: "5+", label: ui.statPlatforms },
  ];

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative overflow-hidden bg-[#f5f5f5] py-24 dark:bg-[#050505]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-[-80px] h-[420px] w-[420px] rounded-full bg-cyan-500/8 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute bottom-[-100px] right-1/5 h-[380px] w-[380px] rounded-full bg-violet-500/6 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-6 xl:px-0">
        <div className="mb-3 flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.25em] text-cyan-500">
            {ui.section}
          </span>
          <div className="h-px w-10 bg-cyan-500" />
          <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {ui.title}
          </h2>
          <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
        </div>

        <p className="mb-12 max-w-xl font-mono text-xs text-zinc-700 dark:text-zinc-400 md:text-sm">
          {ui.subtitle}
        </p>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] xl:gap-20">
          {/* LEFT */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {/* Quote */}
            <div className="relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white/85 px-7 py-8 dark:border-zinc-800 dark:bg-zinc-950/70">
              <div
                className="absolute bottom-8 left-0 top-8 w-[3px] rounded-r-full transition-all duration-500"
                style={{
                  background: `linear-gradient(to bottom, ${active.accent}, #8b5cf6)`,
                }}
              />
              <span
                className="pointer-events-none absolute left-5 top-1 select-none font-serif text-[100px] leading-none"
                style={{ color: active.accent + "10" }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="relative flex min-h-[96px] flex-col justify-center"
                >
                  <p
                    className="mb-3 text-base italic leading-relaxed text-zinc-900 dark:text-zinc-50 md:text-[17px]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {QUOTES[quoteIndex].text}
                  </p>
                  <p
                    className="font-mono text-[11px] tracking-[0.12em]"
                    style={{ color: active.accent }}
                  >
                    — {QUOTES[quoteIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex gap-2">
                {QUOTES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuoteIndex(i)}
                    aria-label={`Quote ${i + 1}`}
                    aria-current={i === quoteIndex}
                    className="h-[5px] rounded-full transition-all duration-300"
                    style={{
                      width: i === quoteIndex ? 20 : 6,
                      backgroundColor:
                        i === quoteIndex
                          ? active.accent
                          : "rgba(161,161,170,0.35)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-zinc-200 bg-white/90 px-5 py-4 text-left dark:border-zinc-800 dark:bg-zinc-950/70"
                >
                  <p className="mb-1 font-syne text-[22px] font-bold tracking-tight text-zinc-900 dark:text-white md:text-[24px]">
                    {s.val}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400 md:text-[11px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="rounded-2xl border border-zinc-200 bg-white/90 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/70">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                  {ui.card} {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(slides.length).padStart(2, "0")}
                </span>
                <span
                  className="font-mono text-[11px]"
                  style={{ color: active.accent }}
                >
                  {active.year}
                </span>
              </div>

              <div className="h-[3px] overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${active.accent}, #8b5cf6)`,
                  }}
                  animate={{
                    width: `${((activeIndex + 1) / slides.length) * 100}%`,
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                {active.description}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex min-h-[440px] flex-col items-center lg:pl-10 xl:pl-14">
            <div className="relative flex w-full flex-1 items-center justify-center">
              <div
                className="pointer-events-none absolute h-[340px] w-[260px] md:w-[280px]"
                aria-hidden="true"
              >
                <div className="absolute inset-0 -translate-x-3 translate-y-5 -rotate-[6deg] rounded-[32px] bg-gradient-to-br from-zinc-200 to-zinc-50 shadow-[0_18px_50px_rgba(0,0,0,0.55)] dark:from-zinc-800 dark:to-zinc-900" />
                <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-[4deg] rounded-[32px] bg-gradient-to-br from-zinc-100 to-white shadow-[0_16px_45px_rgba(0,0,0,0.55)] dark:from-zinc-700 dark:to-zinc-900" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${lang}-${active.id}`}
                  initial={{ opacity: 0, y: 26, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.97 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="relative flex h-[340px] w-[260px] touch-pan-y flex-col gap-3 overflow-hidden rounded-[32px] border border-zinc-200 bg-white px-5 py-5 shadow-[0_26px_80px_rgba(0,0,0,0.55)] dark:border-zinc-700 dark:bg-zinc-950 md:w-[280px]"
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseLeave={() => setIsCardHovered(false)}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                      {active.provider}
                    </p>
                    <div
                      className="flex h-7 min-w-[32px] shrink-0 items-center justify-center rounded-full px-2 font-mono text-[10px] font-bold text-white"
                      style={{ backgroundColor: active.accent }}
                    >
                      {active.iconLabel}
                    </div>
                  </div>

                  <h3 className="-mt-1 font-syne text-[17px] font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
                    {active.title}
                  </h3>

                  <CardPreview
                    cert={active}
                    onClick={() => setModalId(active.id)}
                    isCardHovered={isCardHovered}
                    showHint={ctaHint}
                    ctaLabel={ui.viewFull}
                    previewLabel={ui.preview}
                  />

                  <p className="line-clamp-3 font-mono text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {active.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {active.skills.map((s) => (
                      <SkillPill key={s} label={s} accent={active.accent} />
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(slides.length).padStart(2, "0")}
                    </span>
                    <span className="hidden font-mono text-[9px] text-zinc-400 dark:text-zinc-500 md:block">
                      {ui.keysHint}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-auto flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label={ui.prev}
                className={ARROW_BTN}
              >
                ←
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`${ui.goTo} ${i + 1}`}
                    aria-current={i === activeIndex}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? 18 : 5,
                      height: 5,
                      backgroundColor:
                        i === activeIndex
                          ? active.accent
                          : "rgba(161,161,170,0.3)",
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label={ui.next}
                className={ARROW_BTN}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalSlide && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalId(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={modalSlide.title}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/95 shadow-[0_32px_100px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-800/60 px-6 pb-4 pt-5">
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {modalSlide.provider}
                  </p>
                  <h3 className="font-syne text-lg font-semibold leading-snug text-white">
                    {modalSlide.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {modalSlide.skills.map((s) => (
                      <SkillPill key={s} label={s} accent={modalSlide.accent} />
                    ))}
                  </div>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setModalId(null)}
                  aria-label={ui.close}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800/80 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  &#x2715;
                </button>
              </div>

              <ModalViewer cert={modalSlide} fallbackText={ui.pdfFallback} />

              <div className="flex flex-col gap-3 border-t border-zinc-800/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[10px] text-zinc-500">
                  {modalSlide.type === "pdf"
                    ? ui.modalPdfHint
                    : `${ui.modalIssuedBy} ${modalSlide.provider} · ${modalSlide.year}`}
                </p>

                <a
                  href={modalSlide.src}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[10px] transition-colors"
                  style={{
                    borderColor: modalSlide.accent + "70",
                    color: modalSlide.accent,
                  }}
                >
                  {ui.modalOpenDownload} &#x2197;
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
