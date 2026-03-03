'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { useLang } from '@/lib/i18n/LangContext'

const TechSphere = dynamic(() => import('@/components/three/TechSphere'), {
  ssr: false,
  loading: () => (
    <div className="w-[360px] h-[360px] flex items-center justify-center">
      <p className="text-zinc-600 text-xs font-mono">// loading sphere...</p>
    </div>
  ),
})

export default function Hero() {
  const { t } = useLang()

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden bg-[#f5f5f5] dark:bg-[#0a0a0a]"
    >
      {/* cleaner background (no grid) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-cyan-500/10 dark:bg-cyan-500/7 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 right-1/5 w-[460px] h-[460px] bg-sky-400/10 dark:bg-sky-400/6 rounded-full blur-3xl" />
      </div>

      {/* tighter layout: custom columns + smaller gap */}
      <div className="w-full relative z-10 pt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] items-center gap-4 md:gap-6">
          {/* LEFT */}
          <div className="flex flex-col items-start px-6 md:pl-6 md:pr-4 xl:pl-10 xl:pr-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-cyan-500/60 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-cyan-500/30 animate-pulse" />
              </div>
              <span className="text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 rounded-full">
                {t.hero.available}
              </span>
            </div>

            <h1
              className="text-6xl md:text-7xl font-bold leading-none mb-4"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              <span className="text-gray-900 dark:text-white block">{t.hero.firstName}</span>
              <span className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400 bg-clip-text text-transparent block">
                {t.hero.lastName}
              </span>
            </h1>

            <p
              className="text-base font-medium text-cyan-600 dark:text-cyan-400 mb-6 tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.hero.tagline}
            </p>

            <p
              className="text-sm leading-7 mb-10 max-w-lg text-gray-600 dark:text-zinc-400"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.hero.bio_lines.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <span className="text-cyan-600 dark:text-cyan-400 font-medium">{t.hero.bio_highlight}</span>
            </p>

            {/* Buttons: mono font + tighter look */}
            <div className="flex flex-wrap gap-3 mb-12">
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
                  <span className="text-[13px] font-semibold tracking-[0.18em] uppercase">
                    {t.hero.cta_projects}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>

              <a href="/cv.pdf" target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="
                    border-gray-400 dark:border-zinc-700
                    text-gray-800 dark:text-white
                    bg-white/40 dark:bg-white/5
                    hover:bg-gray-200/60 dark:hover:bg-white/10
                    hover:border-cyan-500 dark:hover:border-cyan-500
                    px-7 py-5 rounded-full
                    flex items-center gap-2
                    transition-all duration-200
                  "
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="text-[13px] font-semibold tracking-[0.18em] uppercase">
                    {t.hero.cta_cv}
                  </span>
                  <Download className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Sankalpa7"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full border border-gray-300 dark:border-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200 bg-white/30 dark:bg-white/5"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sankalpaneupane7/"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full border border-gray-300 dark:border-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200 bg-white/30 dark:bg-white/5"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:sankalpaneupane7@gmail.com"
                className="w-11 h-11 rounded-full border border-gray-300 dark:border-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-500 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200 bg-white/30 dark:bg-white/5"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* RIGHT (closer + less padding) */}
          <div className="hidden md:flex items-center justify-center px-4 md:pr-6 xl:pr-10 py-12">
            <TechSphere />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-gray-400 dark:text-zinc-600 text-xs font-mono tracking-widest">
          {t.hero.scroll}
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-400 dark:from-zinc-600 to-transparent animate-pulse" />
      </div>
    </section>
  )
}