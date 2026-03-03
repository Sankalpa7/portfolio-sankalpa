'use client'

import { useMemo, useState } from 'react'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { useLang } from '@/lib/i18n/LangContext'

const categoryColors: Record<string, string> = {
  'Full Stack':
    'text-cyan-700 dark:text-cyan-300 border-cyan-500/30 bg-cyan-500/8 dark:bg-cyan-500/10',
  AI: 'text-purple-700 dark:text-purple-300 border-purple-500/30 bg-purple-500/8 dark:bg-purple-500/10',
  Frontend:
    'text-sky-700 dark:text-sky-300 border-sky-500/30 bg-sky-500/8 dark:bg-sky-500/10',
  Data: 'text-orange-700 dark:text-orange-300 border-orange-500/30 bg-orange-500/8 dark:bg-orange-500/10',
}

export default function Projects() {
  const { t, locale } = useLang()
  const [activeTab, setActiveTab] = useState<'Data' | 'Frontend' | 'Full Stack' | 'AI'>('Data')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const tabs = useMemo(
    () => [
      { id: 'Data' as const, label: t.projects.tabs.data, color: '#f97316' },
      { id: 'Frontend' as const, label: t.projects.tabs.frontend, color: '#38bdf8' },
      { id: 'Full Stack' as const, label: t.projects.tabs.fullstack, color: '#06b6d4' },
      { id: 'AI' as const, label: t.projects.tabs.ai, color: '#a855f7' },
    ],
    [t]
  )

  const categoryLabel = (cat: string) => {
    if (cat === 'Data') return t.projects.tabs.data
    if (cat === 'Frontend') return t.projects.tabs.frontend
    if (cat === 'Full Stack') return t.projects.tabs.fullstack
    if (cat === 'AI') return t.projects.tabs.ai
    return cat
  }

  const filtered = projects.filter((p) => p.category === activeTab)
  const activeColor = tabs.find((tt) => tt.id === activeTab)?.color ?? '#06b6d4'

  return (
    <section
      id="projects"
      className="py-32 bg-slate-50 dark:bg-[#0d0d0d] relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/8 dark:bg-cyan-500/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 xl:px-24 relative z-10">
        {/* header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-cyan-600 dark:text-cyan-400 text-sm font-mono tracking-widest">
            {t.projects.section}
          </span>
          <div className="w-12 h-px bg-cyan-500/80" />
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {t.projects.title}
          </h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
        </div>

        <p className="text-sm font-mono text-slate-600 dark:text-zinc-500 mb-12 max-w-lg">
          {t.projects.subtitle}
        </p>

        {/* tabs */}
        <div className="flex items-center gap-1 mb-2 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur w-fit">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'relative px-5 py-2 rounded-xl text-xs font-mono tracking-wide transition-all duration-200',
                  'outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-[#0d0d0d]',
                  active ? 'shadow-sm' : 'hover:bg-slate-100/70 dark:hover:bg-white/5',
                ].join(' ')}
                style={{
                  background: active ? tab.color : 'transparent',
                  color: active ? '#000' : undefined,
                }}
              >
                <span className={active ? 'font-semibold' : 'text-slate-600 dark:text-zinc-400'}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-xs font-mono text-slate-500 dark:text-zinc-500 mb-8 pl-1">
          <span style={{ color: activeColor }}>{filtered.length}</span>{' '}
          {locale === 'fi'
            ? `projektia tässä kategoriassa`
            : `project${filtered.length !== 1 ? 's' : ''} in this category`}
        </p>

        {/* list */}
        <div className="relative">
          {filtered.map((project, index) => {
            const isHovered = hoveredId === project.id
            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative border-t border-slate-200 dark:border-zinc-800 last:border-b"
                style={{
                  background: isHovered
                    ? `linear-gradient(to right, ${project.color}12, transparent)`
                    : 'transparent',
                  transition: 'background 0.25s ease',
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-300"
                  style={{
                    background: isHovered ? project.color : 'transparent',
                    opacity: isHovered ? 1 : 0,
                  }}
                />

                <div className="py-8 grid grid-cols-12 gap-6 items-center pl-4">
                  {/* index */}
                  <div className="col-span-1 hidden md:block">
                    <span
                      className="text-5xl font-bold select-none transition-all duration-300"
                      style={{
                        fontFamily: 'var(--font-syne)',
                        color: isHovered ? project.color : 'transparent',
                        WebkitTextStroke: '1px',
                        WebkitTextStrokeColor: isHovered ? 'transparent' : '#27272a',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* content */}
                  <div className="col-span-12 md:col-span-7 flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3
                        className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-200"
                        style={{
                          fontFamily: 'var(--font-syne)',
                          color: isHovered ? project.color : undefined,
                        }}
                      >
                        {project.title}
                      </h3>

                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full border ${categoryColors[project.category]}`}
                      >
                        {categoryLabel(project.category)}
                      </span>

                      {project.featured && (
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/8 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          {locale === 'fi' ? 'Nosto' : 'Featured'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-mono text-slate-600 dark:text-zinc-500 leading-6">
                      {locale === 'fi' && project.descriptionFi ? project.descriptionFi : project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="
                            text-xs font-mono
                            text-slate-500 dark:text-zinc-500
                            border border-slate-200 dark:border-zinc-800
                            bg-white/60 dark:bg-transparent
                            px-2 py-0.5 rounded
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* actions */}
                  <div className="col-span-12 md:col-span-4 flex items-center justify-end gap-3">
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex items-center gap-2 px-4 py-2 rounded-full
                        border border-slate-200 dark:border-zinc-800
                        bg-white/70 dark:bg-transparent
                        text-xs font-mono text-slate-700 dark:text-zinc-400
                        hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400
                        transition-all duration-200
                      "
                    >
                      <Github className="w-3.5 h-3.5" />
                      {t.projects.view_code}
                    </a>

                    {project.demo !== project.code && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex items-center gap-2 px-4 py-2 rounded-full
                          text-xs font-mono font-semibold
                          transition-all duration-200
                        "
                        style={{
                          background: isHovered ? project.color : 'transparent',
                          color: isHovered ? '#000' : project.color,
                          border: `1px solid ${project.color}`,
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t.projects.live_demo}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* footer */}
        <div className="mt-12 flex justify-center">
          <a
            href="https://github.com/Sankalpa7"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2 px-6 py-3 rounded-full
              border border-slate-200 dark:border-zinc-800
              bg-white/70 dark:bg-transparent
              text-sm font-mono text-slate-600 dark:text-zinc-500
              hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400
              transition-all duration-200
            "
          >
            <Github className="w-4 h-4" />
            {t.projects.github}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}