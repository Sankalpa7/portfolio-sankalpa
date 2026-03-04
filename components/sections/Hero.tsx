'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '@/lib/i18n/LangContext'

const TechSphere = dynamic(() => import('@/components/three/TechSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-slate-200/70 dark:border-white/10 animate-pulse" />
    </div>
  ),
})

export default function Hero() {
  const { t } = useLang()

  return (
    <section
      id="hero"
      className="
        relative flex items-center
        min-h-[calc(100svh-4rem)]
        overflow-hidden
        bg-slate-50 dark:bg-[#0a0a0a]
        pt-10 pb-16
      "
    >
      {/* soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-cyan-500/10 dark:bg-cyan-500/7 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 right-1/5 w-[460px] h-[460px] bg-sky-400/10 dark:bg-sky-400/6 rounded-full blur-3xl" />
      </div>

      <div className="w-full relative z-10">
        <div
          className="
            max-w-6xl mx-auto
            grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]
            items-center
            gap-10 lg:gap-8
            px-4 sm:px-6
          "
        >
          {/* LEFT */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-cyan-500/60 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-cyan-500/30 animate-pulse" />
              </div>

              <span
                className="
                  text-cyan-700 dark:text-cyan-400
                  text-xs font-mono tracking-widest uppercase
                  border border-cyan-500/30
                  bg-white/70 dark:bg-cyan-500/5
                  backdrop-blur
                  px-3 py-1 rounded-full
                "
              >
                {t.hero.available}
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-none mb-4"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              <span className="text-slate-900 dark:text-white block">{t.hero.firstName}</span>
              <span className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400 bg-clip-text text-transparent block">
                {t.hero.lastName}
              </span>
            </h1>

            <p
              className="text-sm sm:text-base font-medium text-cyan-700 dark:text-cyan-400 mb-6 tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.hero.tagline}
            </p>

            <p
              className="text-sm leading-7 mb-10 max-w-lg text-slate-600 dark:text-zinc-400"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.hero.bio_lines.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <span className="text-cyan-700 dark:text-cyan-400 font-medium">{t.hero.bio_highlight}</span>
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <a href="#projects">
                <Button
                  className="
                    bg-cyan-500 hover:bg-cyan-400 text-black
                    px-7 py-5 rounded-full
                    flex items-center gap-2
                    shadow-lg shadow-cyan-500/25
                    transition-all duration-200
                  "
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="text-[13px] font-semibold tracking-[0.18em] uppercase">{t.hero.cta_projects}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>

              <a href="/cv.pdf" download>
                <Button
                  variant="outline"
                  className="
                    border-slate-300 dark:border-zinc-700
                    text-slate-900 dark:text-white
                    bg-white dark:bg-white/5
                    hover:bg-slate-100 dark:hover:bg-white/10
                    hover:border-cyan-500 dark:hover:border-cyan-500
                    px-7 py-5 rounded-full
                    flex items-center gap-2
                    transition-all duration-200
                  "
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="text-[13px] font-semibold tracking-[0.18em] uppercase">{t.hero.cta_cv}</span>
                  <Download className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { href: 'https://github.com/Sankalpa7', icon: <Github className="w-5 h-5" />, label: 'GitHub' },
                {
                  href: 'https://www.linkedin.com/in/sankalpaneupane7/',
                  icon: <Linkedin className="w-5 h-5" />,
                  label: 'LinkedIn',
                },
                { href: 'mailto:sankalpaneupane7@gmail.com', icon: <Mail className="w-5 h-5" />, label: 'Email' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="
                    w-11 h-11 rounded-full
                    border border-slate-200 dark:border-zinc-800
                    flex items-center justify-center
                    text-slate-600 dark:text-zinc-500
                    hover:text-cyan-700 dark:hover:text-cyan-400
                    hover:border-cyan-400
                    transition-all duration-200
                    bg-white dark:bg-white/5
                    shadow-sm dark:shadow-none
                  "
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT (Sphere Card) */}
          <div className="flex items-center justify-center">
            <div
              className="
                relative
                w-full
                max-w-[360px] sm:max-w-[420px] lg:max-w-[480px]
                aspect-square
                rounded-[28px]
                overflow-hidden dark:overflow-visible
                bg-white
                border border-slate-200
                shadow-[0_22px_70px_rgba(2,6,23,0.08)]
                dark:bg-transparent
                dark:border-transparent
                dark:shadow-none
              "
            >
              {/* subtle radial glow only for light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.10)_0%,transparent_65%)] dark:hidden" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[86%] h-[86%] flex items-center justify-center">
                  <TechSphere />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-slate-400 dark:text-zinc-600 text-xs font-mono tracking-widest">{t.hero.scroll}</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 dark:from-zinc-600 to-transparent animate-pulse" />
      </div>
    </section>
  )
}