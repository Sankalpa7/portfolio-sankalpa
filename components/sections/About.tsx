'use client'

import { useLang } from '@/lib/i18n/LangContext'

export default function About() {
  const { t } = useLang()

  const stats = [
    { value: '7+', label: t.about.stats.projects },
    { value: '3+', label: t.about.stats.years },
    { value: '26', label: t.about.stats.tech },
    { value: '2', label: t.about.stats.degrees },
  ]

  const facts = [
    { icon: '📍', label: t.about.facts.location, value: 'Helsinki, Finland' },
    { icon: '🎓', label: t.about.facts.university, value: 'Åbo Akademi University' },
    { icon: '📚', label: t.about.facts.degree, value: 'M.Sc. Computer Engineering' },
    { icon: '🌍', label: t.about.facts.from, value: 'Nepal & Finland' },
    { icon: '⚡', label: t.about.facts.focus, value: 'Learning New Technologies' },
    { icon: '🌐', label: t.about.facts.languages, value: 'English · Nepali · Finnish' },
  ]

  const hobbies = [
    { icon: '✈️', label: t.about.hobbies.travelling },
    { icon: '🎮', label: t.about.hobbies.gaming },
    { icon: '📖', label: t.about.hobbies.reading },
    { icon: '🏔️', label: t.about.hobbies.mountains },
    { icon: '🎵', label: t.about.hobbies.music },
    { icon: '🍕', label: t.about.hobbies.food },
    { icon: '🌏', label: t.about.hobbies.cities },
    { icon: '📷', label: t.about.hobbies.photography },
    { icon: '🧘', label: t.about.hobbies.mindfulness },
    { icon: '🚴', label: t.about.hobbies.cycling },
    { icon: '⚽', label: t.about.hobbies.football },
    { icon: '🏏', label: t.about.hobbies.cricket },
    { icon: '🏃', label: t.about.hobbies.fitness },
    { icon: '🔬', label: t.about.hobbies.research },
    { icon: '🧠', label: t.about.hobbies.learning },
  ]

  return (
    <section
      id="about"
      className="pt-32 bg-white dark:bg-[#0a0a0a] relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-16 xl:px-24 relative z-10 pb-16">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-cyan-500 text-sm font-mono tracking-widest">
            {t.about.section}
          </span>
          <div className="w-12 h-px bg-cyan-500" />
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {t.about.title}
          </h2>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-8">
            <div className="space-y-5">
              <p
                className="text-sm leading-7 text-gray-600 dark:text-zinc-400"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t.about.p1}
              </p>
              <p
                className="text-sm leading-7 text-gray-600 dark:text-zinc-400"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t.about.p2}
              </p>
              <p
                className="text-sm leading-7 text-gray-600 dark:text-zinc-400"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t.about.p3}
              </p>
            </div>

            <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-gray-50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">
                  {t.about.currently}
                </span>
              </div>
              <p className="text-sm font-mono text-gray-700 dark:text-zinc-300 leading-6">
                {t.about.currently_text}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 bg-gray-50 dark:bg-zinc-900/30 hover:border-cyan-500/50 transition-all duration-300 group"
                >
                  <div
                    className="text-3xl font-bold text-cyan-500 mb-1"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-gray-500 dark:text-zinc-500 group-hover:text-gray-700 dark:group-hover:text-zinc-400 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                  {t.about.quick_facts}
                </span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors group"
                  >
                    <span className="text-lg w-8">{fact.icon}</span>
                    <span className="text-xs font-mono text-gray-400 dark:text-zinc-600 w-24 shrink-0">
                      {fact.label}
                    </span>
                    <span className="text-sm font-mono text-gray-700 dark:text-zinc-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full mt-8">
        <div className="flex items-center justify-center mb-6 px-16 xl:px-24">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent" />
          <div className="mx-6 flex items-center gap-3">
            <span className="text-cyan-500 font-mono text-xs tracking-widest">✦</span>
            <div className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/80 rounded-full px-5 py-2">
              <span className="text-cyan-500 font-mono text-xs tracking-widest">//</span>
              <span
                className="text-gray-700 dark:text-zinc-300 text-sm font-medium tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {t.about.beyond_code}
              </span>
              <span className="text-cyan-500 font-mono text-xs tracking-widest">//</span>
            </div>
            <span className="text-cyan-500 font-mono text-xs tracking-widest">✦</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent" />
        </div>

        <div className="relative border-y border-gray-200 dark:border-zinc-800 py-5 overflow-hidden bg-gray-50/50 dark:bg-zinc-900/20">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee-about whitespace-nowrap">
            {[...hobbies, ...hobbies, ...hobbies].map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 mx-6 shrink-0 group cursor-default"
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-200">
                  {h.icon}
                </span>
                <span className="text-xs font-mono text-gray-500 dark:text-zinc-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200 tracking-wide">
                  {h.label}
                </span>
                <span className="ml-4 text-gray-300 dark:text-zinc-700 text-lg">✦</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8 bg-gradient-to-b from-gray-50/50 dark:from-zinc-900/20 to-transparent" />
      </div>

      <style>{`
        @keyframes marquee-about {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-about {
          animation: marquee-about 35s linear infinite;
        }
        .animate-marquee-about:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
