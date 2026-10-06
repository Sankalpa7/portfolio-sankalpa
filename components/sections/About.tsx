"use client";

import { useLang } from "@/lib/i18n/LangContext";

const BODY_TEXT =
  "font-mono text-sm leading-7 text-slate-600 dark:text-zinc-400";

export default function About() {
  const { t } = useLang();

  const stats = [
    { value: "7+", label: t.about.stats.projects },
    { value: "3+", label: t.about.stats.years },
    { value: "26", label: t.about.stats.tech },
    { value: "2", label: t.about.stats.degrees },
  ];

  const facts = [
    { icon: "📍", label: t.about.facts.location, value: "Helsinki, Finland" },
    {
      icon: "🎓",
      label: t.about.facts.university,
      value: "Åbo Akademi University",
    },
    {
      icon: "📚",
      label: t.about.facts.degree,
      value: "M.Sc. Computer Engineering",
    },
    { icon: "🌍", label: t.about.facts.from, value: "Nepal & Finland" },
    {
      icon: "⚡",
      label: t.about.facts.focus,
      value: "Learning New Technologies",
    },
    {
      icon: "🌐",
      label: t.about.facts.languages,
      value: "English · Nepali · Finnish",
    },
  ];

  const hobbies = [
    { icon: "✈️", label: t.about.hobbies.travelling },
    { icon: "🎮", label: t.about.hobbies.gaming },
    { icon: "📖", label: t.about.hobbies.reading },
    { icon: "🏔️", label: t.about.hobbies.mountains },
    { icon: "🎵", label: t.about.hobbies.music },
    { icon: "🍕", label: t.about.hobbies.food },
    { icon: "🌏", label: t.about.hobbies.cities },
    { icon: "📷", label: t.about.hobbies.photography },
    { icon: "🧘", label: t.about.hobbies.mindfulness },
    { icon: "🚴", label: t.about.hobbies.cycling },
    { icon: "⚽", label: t.about.hobbies.football },
    { icon: "🏏", label: t.about.hobbies.cricket },
    { icon: "🏃", label: t.about.hobbies.fitness },
    { icon: "🔬", label: t.about.hobbies.research },
    { icon: "🧠", label: t.about.hobbies.learning },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-slate-50 pt-24 dark:bg-[#0a0a0a]"
    >
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl dark:bg-cyan-500/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 md:px-10 xl:px-24">
        {/* Section header */}
        <div className="mb-16 flex items-center gap-4">
          <span className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400">
            {t.about.section}
          </span>
          <div className="h-px w-12 bg-cyan-500/80" />
          <h2 className="font-syne text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {t.about.title}
          </h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div className="flex flex-col gap-8">
            <div className="space-y-5">
              <p className={BODY_TEXT}>{t.about.p1}</p>
              <p className={BODY_TEXT}>{t.about.p2}</p>
              <p className={BODY_TEXT}>{t.about.p3}</p>
            </div>

            {/* Currently */}
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                  {t.about.currently}
                </span>
              </div>
              <p className="font-mono text-sm leading-6 text-slate-700 dark:text-zinc-300">
                {t.about.currently_text}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:border-cyan-500/50 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <div className="mb-1 font-syne text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick facts */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-transparent">
              <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                  {t.about.quick_facts}
                </span>
              </div>

              <div className="divide-y divide-slate-200/60 dark:divide-zinc-800/50">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-zinc-900/30"
                  >
                    <span className="w-8 text-lg" aria-hidden="true">
                      {fact.icon}
                    </span>
                    <span className="w-28 shrink-0 font-mono text-xs text-slate-500 dark:text-zinc-500">
                      {fact.label}
                    </span>
                    <span className="font-mono text-sm text-slate-800 transition-colors group-hover:text-cyan-700 dark:text-zinc-300 dark:group-hover:text-cyan-400">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beyond code */}
      <div className="relative mt-8 w-full">
        <div className="mb-6 flex items-center justify-center px-6 md:px-10 xl:px-24">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-zinc-800" />
          <div className="mx-6 flex items-center gap-3">
            <span
              className="font-mono text-xs tracking-widest text-cyan-500"
              aria-hidden="true"
            >
              ✦
            </span>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
              <span
                className="font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400"
                aria-hidden="true"
              >
                //
              </span>
              <span className="font-syne text-sm font-medium uppercase tracking-widest text-slate-900 dark:text-zinc-200">
                {t.about.beyond_code}
              </span>
              <span
                className="font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400"
                aria-hidden="true"
              >
                //
              </span>
            </div>

            <span
              className="font-mono text-xs tracking-widest text-cyan-500"
              aria-hidden="true"
            >
              ✦
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-zinc-800" />
        </div>

        <div className="relative overflow-hidden border-y border-slate-200 bg-white/50 py-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/20">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-slate-50 to-transparent dark:from-[#0a0a0a]" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-slate-50 to-transparent dark:from-[#0a0a0a]" />

          {/* w-max makes -33.333% equal exactly one copy of the list */}
          <div className="animate-marquee-about flex w-max whitespace-nowrap">
            {[0, 1, 2].map((copy) =>
              hobbies.map((h) => (
                <div
                  key={`${copy}-${h.label}`}
                  aria-hidden={copy > 0 ? true : undefined}
                  className="group mx-6 flex shrink-0 cursor-default items-center gap-2.5"
                >
                  <span className="text-xl transition-transform duration-200 group-hover:scale-125">
                    {h.icon}
                  </span>
                  <span className="font-mono text-xs tracking-wide text-slate-600 transition-colors duration-200 group-hover:text-cyan-700 dark:text-zinc-400 dark:group-hover:text-cyan-400">
                    {h.label}
                  </span>
                  <span className="ml-4 text-lg text-slate-300 dark:text-zinc-700">
                    ✦
                  </span>
                </div>
              )),
            )}
          </div>
        </div>

        <div className="h-8 bg-gradient-to-b from-white/50 to-transparent dark:from-zinc-900/20" />
      </div>
    </section>
  );
}
