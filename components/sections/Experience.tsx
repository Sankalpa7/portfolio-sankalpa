"use client";

import { useState } from "react";
import { TrendingUp, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/i18n/LangContext";
import {
  EXPERIENCES,
  EDUCATION,
  type ExpType,
  type Locale,
} from "@/lib/experience";

const TYPE_STYLES: Record<ExpType, string> = {
  Research:
    "border-cyan-500/30 bg-cyan-500/8 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  Promoted:
    "border-amber-500/30 bg-amber-500/8 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Engineering:
    "border-purple-500/30 bg-purple-500/8 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
};

const TYPE_LABELS: Record<Locale, Record<ExpType, string>> = {
  en: {
    Research: "Research",
    Promoted: "Promoted",
    Engineering: "Engineering",
  },
  fi: { Research: "Tutkimus", Promoted: "Ylennys", Engineering: "Tekniikka" },
};

const UI = {
  en: {
    promoted: "Promoted",
    careerPath: "Career path:",
    inProgress: "In progress",
    eduSection: "// edu",
    eduTitle: "Education",
    eduFooter: "// foundation → specialization",
    eduRange: "2017 — present",
    toggle: "Show or hide details",
  },
  fi: {
    promoted: "Ylennys",
    careerPath: "Urapolku:",
    inProgress: "Kesken",
    eduSection: "// koulutus",
    eduTitle: "Koulutus",
    eduFooter: "// perusta → erikoistuminen",
    eduRange: "2017 — nykyhetki",
    toggle: "Näytä tai piilota tiedot",
  },
} satisfies Record<Locale, Record<string, string>>;

const MUTED = "font-mono text-xs text-slate-500 dark:text-zinc-500";

export default function Experience() {
  const { t, locale } = useLang();
  const lang: Locale = locale === "fi" ? "fi" : "en";
  const ui = UI[lang];

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggle = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-slate-50 py-32 dark:bg-[#0a0a0a]"
    >
      {/* glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-3xl dark:bg-cyan-500/4" />
        <div className="absolute bottom-1/4 left-0 h-64 w-64 rounded-full bg-purple-500/7 blur-3xl dark:bg-purple-500/4" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 xl:px-24">
        {/* header */}
        <div className="mb-16 flex items-center gap-4">
          <span className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400">
            {t.experience.section}
          </span>
          <div className="h-px w-12 bg-cyan-500/80" />
          <h2 className="font-syne text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {t.experience.title}
          </h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
        </div>

        {/* timeline */}
        <div className="relative">
          <div
            className="absolute bottom-0 top-0 hidden w-px md:block"
            style={{
              left: "70px",
              background:
                "linear-gradient(to bottom, transparent, rgba(6,182,212,0.10), rgba(6,182,212,0.28), rgba(6,182,212,0.10), transparent)",
            }}
            aria-hidden="true"
          />

          <div className="flex flex-col">
            {EXPERIENCES.map((exp) => {
              const isOpen = expandedId === exp.id;
              const panelId = `exp-panel-${exp.id}`;

              return (
                <article
                  key={exp.id}
                  className="grid grid-cols-1 gap-0 py-6 md:grid-cols-[140px_1fr] md:gap-8"
                >
                  {/* year bubble */}
                  <div className="hidden justify-center pt-1 md:flex">
                    <div
                      className={[
                        "z-10 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-all duration-300",
                        isOpen
                          ? ""
                          : "border-slate-900/10 bg-white/70 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400",
                      ].join(" ")}
                      style={
                        isOpen
                          ? {
                              background: exp.color + "14",
                              borderColor: exp.color + "55",
                              color: exp.color,
                            }
                          : undefined
                      }
                    >
                      {exp.year}
                    </div>
                  </div>

                  {/* card: clicking anywhere toggles; the chevron button gives keyboard access */}
                  <div
                    onClick={() => toggle(exp.id)}
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur transition-all duration-300 dark:border-white/10 dark:bg-white/5"
                    style={{
                      transform: isOpen ? "translateX(6px)" : "translateX(0)",
                      borderColor: isOpen ? exp.color + "55" : undefined,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300"
                      style={{
                        background: exp.color,
                        opacity: isOpen ? 0.1 : 0,
                      }}
                      aria-hidden="true"
                    />

                    <div className="relative p-6 md:p-7">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-1.5 flex flex-wrap items-center gap-3">
                            <h3
                              className="font-syne text-lg font-bold text-slate-900 transition-colors duration-200 dark:text-white"
                              style={isOpen ? { color: exp.color } : undefined}
                            >
                              {exp.role[lang]}
                            </h3>

                            {exp.promotion && (
                              <span
                                className="flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs"
                                style={{
                                  color: exp.color,
                                  borderColor: exp.color + "55",
                                  background: exp.color + "10",
                                }}
                              >
                                <TrendingUp
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                                {ui.promoted}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className="font-mono text-sm font-semibold"
                              style={{ color: exp.color }}
                            >
                              {exp.company}
                            </span>
                            {exp.sub && (
                              <span className={MUTED}>{exp.sub}</span>
                            )}
                            <span className={MUTED}>{exp.location[lang]}</span>
                            <span className={MUTED}>{exp.period[lang]}</span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span
                            className={`hidden rounded-full border px-2.5 py-1 font-mono text-xs sm:inline-flex ${TYPE_STYLES[exp.type]}`}
                          >
                            {TYPE_LABELS[lang][exp.type]}
                          </span>
                          {/* No onClick here: the click bubbles up to the card, so it toggles exactly once */}
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            aria-label={ui.toggle}
                            className="rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                          >
                            <ChevronDown
                              className="h-4 w-4 text-slate-500 transition-transform duration-300 dark:text-zinc-500"
                              style={{
                                transform: isOpen
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>

                      <p className="mb-2 font-mono text-sm leading-6 text-slate-600 dark:text-zinc-500">
                        {exp.summary[lang]}
                      </p>

                      {isOpen && (
                        <div
                          id={panelId}
                          className="mt-3 border-t pt-5"
                          style={{ borderColor: exp.color + "25" }}
                        >
                          {exp.promotion && (
                            <div
                              className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
                              style={{
                                background: exp.color + "10",
                                border: `1px solid ${exp.color}25`,
                              }}
                            >
                              <TrendingUp
                                className="h-4 w-4 shrink-0"
                                style={{ color: exp.color }}
                                aria-hidden="true"
                              />
                              <span
                                className="font-mono text-xs"
                                style={{ color: exp.color }}
                              >
                                {ui.careerPath}&nbsp;
                                <span className="text-slate-600 dark:text-zinc-500">
                                  {exp.promotion.from[lang]}
                                </span>
                                <span className="mx-2" aria-hidden="true">
                                  →
                                </span>
                                <span className="font-semibold">
                                  {exp.promotion.to[lang]}
                                </span>
                              </span>
                            </div>
                          )}

                          <div
                            className="mb-5 space-y-3 border-l-2 pl-4"
                            style={{ borderColor: exp.color + "35" }}
                          >
                            {exp.bullets[lang].map((b) => (
                              <p
                                key={b}
                                className="font-mono text-xs leading-6 text-slate-600 dark:text-zinc-500"
                              >
                                {b}
                              </p>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {exp.tags[lang].map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border px-2.5 py-1 font-mono text-xs"
                                style={{
                                  borderColor: exp.color + "35",
                                  color: exp.color,
                                  background: exp.color + "10",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mt-24">
          <div className="mb-12 flex items-center gap-4">
            <span className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400">
              {ui.eduSection}
            </span>
            <div className="h-px w-8 bg-cyan-500/50" />
            <h3 className="font-syne text-xl font-bold text-slate-900 dark:text-white">
              {ui.eduTitle}
            </h3>
            <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {EDUCATION.map((edu) => (
              <div
                key={edu.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
              >
                {/* hover outline */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ border: `1px solid ${edu.color}55` }}
                  aria-hidden="true"
                />
                {/* glow: subtle by default, brighter on hover */}
                <div
                  className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.16]"
                  style={{ background: edu.color }}
                  aria-hidden="true"
                />

                {/* watermark: one variant per theme */}
                <span
                  className="pointer-events-none absolute -bottom-3 -right-2 hidden select-none font-syne text-8xl font-black leading-none dark:block"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                  }}
                  aria-hidden="true"
                >
                  {edu.wm}
                </span>
                <span
                  className="pointer-events-none absolute -bottom-3 -right-2 select-none font-syne text-8xl font-black leading-none dark:hidden"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(15,23,42,0.10)",
                  }}
                  aria-hidden="true"
                >
                  {edu.wm}
                </span>

                <div className="relative z-10 p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-xs"
                      style={{
                        color: edu.color,
                        borderColor: edu.color + "55",
                        background: edu.color + "10",
                      }}
                    >
                      {edu.level[lang]}
                    </span>

                    <span className={MUTED}>{edu.period[lang]}</span>

                    {edu.current && (
                      <span className="flex items-center gap-1.5 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                        <span
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500"
                          aria-hidden="true"
                        />
                        {ui.inProgress}
                      </span>
                    )}
                  </div>

                  <h4 className="mb-2 font-syne text-xl font-black text-slate-900 dark:text-white">
                    {edu.degree[lang]}
                  </h4>

                  <p
                    className="mb-2 font-mono text-sm font-semibold"
                    style={{ color: edu.color }}
                  >
                    {edu.school}
                  </p>

                  <p className="mb-4 font-mono text-xs italic text-slate-600 dark:text-zinc-500">
                    {edu.focus[lang]}
                  </p>
                  <p className="font-mono text-xs text-slate-600 dark:text-zinc-500">
                    <span aria-hidden="true">📍</span> {edu.location[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className={MUTED}>{ui.eduFooter}</span>
            <span className={MUTED}>{ui.eduRange}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
