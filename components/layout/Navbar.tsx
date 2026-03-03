'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n/LangContext'

type LangKey = 'en' | 'fi'

type NavFallback = {
  about: string
  projects: string
  experience: string
  skills: string
  certifications: string
  contact: string
  language: string
  theme: string
  light: string
  dark: string
}

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useLang()

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // language dropdown
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!langRef.current) return
      if (!langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    // close language dropdown when mobile menu toggles
    setLangOpen(false)
  }, [menuOpen])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // ✅ Stable SSR fallback labels (prevents hydration mismatch)
  const navFallback: NavFallback = useMemo(
    () => ({
      about: 'About',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      certifications: 'Certifications',
      contact: 'Contact',
      language: 'Language',
      theme: 'Theme',
      light: 'Light mode',
      dark: 'Dark mode',
    }),
    []
  )

  // ✅ Use fallback until mounted so server & first client render match
  const navLinks = useMemo(
    () => [
      { label: mounted ? t.nav.about : navFallback.about, href: '#about' },
      { label: mounted ? t.nav.projects : navFallback.projects, href: '#projects' },
      { label: mounted ? t.nav.experience : navFallback.experience, href: '#experience' },
      { label: mounted ? t.nav.skills : navFallback.skills, href: '#skills' },
      { label: mounted ? t.nav.certifications : navFallback.certifications, href: '#certifications' },
      { label: mounted ? t.nav.contact : navFallback.contact, href: '#contact' },
    ],
    [mounted, t, navFallback]
  )

  /**
   * Scrolled styles:
   * - Light: soft white glass + subtle border/shadow
   * - Dark: keep your teal glass
   */
  const navbarClass = scrolled
    ? `
      bg-white/80
      backdrop-blur-2xl
      border-b border-slate-200
      shadow-[0_10px_40px_rgba(2,6,23,0.06)]
      dark:bg-[#001018]/80
      dark:border-b dark:border-cyan-400/25
      dark:shadow-[0_6px_40px_rgba(0,229,255,0.12)]
    `
    : 'bg-transparent'

  const currentLang = useMemo(() => {
    const map: Record<LangKey, { label: string; flag: string }> = {
      en: { label: 'English', flag: '🇬🇧' },
      fi: { label: 'Suomi', flag: '🇫🇮' },
    }
    return map[(locale as LangKey) || 'en']
  }, [locale])

  const LangItem = ({ lang, label, flag }: { lang: LangKey; label: string; flag: string }) => {
    const active = locale === lang

    return (
      <button
        type="button"
        onClick={() => {
          setLocale(lang)
          setLangOpen(false)
          setMenuOpen(false)
        }}
        className={[
          'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl',
          'transition-colors',
          active ? 'bg-cyan-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100',
          active ? 'dark:bg-cyan-500/15 dark:text-cyan-200' : 'dark:text-zinc-200 dark:hover:bg-white/5',
        ].join(' ')}
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{flag}</span>
          <span className="font-mono text-[13px] tracking-wide">{label}</span>
        </span>
        {active && <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300">ACTIVE</span>}
      </button>
    )
  }

  return (
    <header className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + navbarClass}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <a
          href="#"
          className="
            text-lg font-bold tracking-tight
            text-slate-900 hover:opacity-80 transition-opacity
            dark:text-white
          "
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Sankalpa<span className="text-cyan-600 dark:text-cyan-400">.</span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="
                  text-[13px]
                  font-mono tracking-[0.14em]
                  text-slate-700 hover:text-cyan-700
                  transition-colors duration-200
                  dark:text-zinc-200/80 dark:hover:text-cyan-200
                "
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls (grouped) */}
        <div className="flex items-center gap-2">
          {/* Utilities group: Language + Theme */}
          <div
            className="
              inline-flex items-center gap-2
              rounded-full px-2 py-1
              border border-slate-200
              bg-white/70 backdrop-blur
              shadow-[0_10px_30px_rgba(2,6,23,0.06)]
              dark:border-cyan-400/20
              dark:bg-white/5
              dark:shadow-[0_10px_30px_rgba(0,229,255,0.08)]
            "
          >
            {/* Language dropdown */}
            {mounted && (
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((v) => !v)}
                  className="
                    inline-flex items-center gap-2
                    rounded-full px-3 py-2
                    border border-transparent
                    hover:bg-white/70
                    transition-all
                    dark:hover:bg-white/10
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50
                  "
                  aria-haspopup="menu"
                  aria-expanded={langOpen}
                >
                  <Globe className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                  <span className="text-[12px] font-mono font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <span className="text-base leading-none">{currentLang.flag}</span>
                    <span className="hidden sm:inline">{currentLang.label}</span>
                  </span>
                  <ChevronDown
                    className={[
                      'h-4 w-4 transition-transform',
                      'text-slate-600 dark:text-zinc-200/80',
                      langOpen ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      role="menu"
                      className="
                        absolute right-0 mt-2 w-56 rounded-2xl p-2 z-50
                        border border-slate-200
                        bg-white/95
                        backdrop-blur-2xl
                        shadow-[0_18px_60px_rgba(2,6,23,0.14)]
                        dark:border-cyan-400/15
                        dark:bg-[#04131b]/90
                        dark:shadow-[0_18px_60px_rgba(0,0,0,0.6)]
                      "
                    >
                      <LangItem lang="en" label="English" flag="🇬🇧" />
                      <LangItem lang="fi" label="Suomi" flag="🇫🇮" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />

            {/* Theme toggle */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="
                  inline-flex items-center justify-center
                  rounded-full w-9 h-9
                  text-slate-700 hover:text-slate-900 hover:bg-white/70
                  dark:text-zinc-200/80 dark:hover:text-white dark:hover:bg-white/10
                  transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50
                "
                aria-label="Toggle theme"
                title={theme === 'dark' ? navFallback.light : navFallback.dark}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="
              md:hidden rounded-full w-9 h-9
              text-slate-700 hover:text-slate-900 hover:bg-slate-200/60
              dark:text-zinc-200/80 dark:hover:text-white dark:hover:bg-white/10
            "
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* subtle line when scrolled */}
        {scrolled && (
          <div
            className="
              absolute bottom-0 left-0 right-0 h-[1px]
              bg-gradient-to-r from-transparent via-slate-300 to-transparent
              dark:from-transparent dark:via-cyan-400/35 dark:to-transparent
            "
          />
        )}
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="
              md:hidden overflow-hidden
              bg-white/92 backdrop-blur-2xl
              border-b border-slate-200
              px-6 py-4
              dark:bg-[#031018]/92
              dark:border-cyan-400/15
            "
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="
                      text-sm font-mono tracking-[0.12em]
                      text-slate-700 hover:text-cyan-700 transition-colors
                      dark:text-zinc-200/85 dark:hover:text-cyan-200
                    "
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language in mobile menu */}
            <div className="mt-5 pt-5 border-t border-slate-200 dark:border-white/10">
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-2">
                {mounted ? (t.nav.language ?? navFallback.language) : navFallback.language}
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-cyan-400/15 dark:bg-white/5">
                <LangItem lang="en" label="English" flag="🇬🇧" />
                <LangItem lang="fi" label="Suomi" flag="🇫🇮" />
              </div>
            </div>

            {/* Theme in mobile menu */}
            <div className="mt-4">
              <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-2">
                {mounted ? (t.nav.theme ?? navFallback.theme) : navFallback.theme}
              </p>
              <button
                type="button"
                onClick={toggleTheme}
                className="
                  w-full flex items-center justify-between
                  rounded-2xl px-4 py-3
                  border border-slate-200 bg-white
                  text-slate-700
                  hover:border-cyan-300 hover:text-cyan-700
                  transition-colors
                  dark:border-cyan-400/15 dark:bg-white/5 dark:text-zinc-200/85
                  dark:hover:text-cyan-200
                "
              >
                <span className="font-mono text-[13px] tracking-wide">
                  {theme === 'dark'
                    ? mounted
                      ? (t.nav.light ?? navFallback.light)
                      : navFallback.light
                    : mounted
                      ? (t.nav.dark ?? navFallback.dark)
                      : navFallback.dark}
                </span>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}