'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n/LangContext'

type LangKey = 'en' | 'fi'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useLang()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // language dropdown
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // translated nav links
  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.experience, href: '#experience' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.certifications, href: '#certifications' },
    { label: t.nav.contact, href: '#contact' },
  ]

  /**
   * ✅ SCROLLED NAVBAR STYLE (NON-BLACK, DOESN’T BLEND)
   * Deep teal/cyan glass layer + blur + subtle glow.
   */
  const navbarClass = scrolled
    ? `
      bg-[#001018]/80
      backdrop-blur-2xl
      border-b border-cyan-400/25
      shadow-[0_6px_40px_rgba(0,229,255,0.12)]
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
          active ? 'bg-cyan-500/15 text-cyan-200' : 'text-zinc-200 hover:bg-white/5',
        ].join(' ')}
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{flag}</span>
          <span className="font-mono text-[13px] tracking-wide">{label}</span>
        </span>
        {active && <span className="text-[10px] font-mono text-cyan-300">ACTIVE</span>}
      </button>
    )
  }

  return (
    <header className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + navbarClass}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Sankalpa<span className="text-cyan-400">.</span>
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
                  text-zinc-200/80 hover:text-cyan-200
                  transition-colors duration-200
                "
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* ── Language dropdown (Globe + flag) ── */}
          {mounted && (
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="
                  inline-flex items-center gap-2
                  rounded-full px-3 py-2
                  border border-cyan-400/20
                  bg-white/5 backdrop-blur
                  hover:bg-white/10
                  transition-all
                "
                aria-haspopup="menu"
                aria-expanded={langOpen}
              >
                <Globe className="h-4 w-4 text-cyan-300" />
                <span className="text-[12px] font-mono font-semibold text-zinc-100 flex items-center gap-2">
                  <span className="text-base leading-none">{currentLang.flag}</span>
                  <span className="hidden sm:inline">{currentLang.label}</span>
                </span>
                <ChevronDown
                  className={[
                    'h-4 w-4 text-zinc-200/80 transition-transform',
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
                      border border-cyan-400/15
                      bg-[#04131b]/90
                      backdrop-blur-2xl
                      shadow-[0_18px_60px_rgba(0,0,0,0.6)]
                    "
                  >
                    <LangItem lang="en" label="English" flag="🇬🇧" />
                    <LangItem lang="fi" label="Suomi" flag="🇫🇮" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 text-zinc-200/80 hover:text-white hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full w-9 h-9 text-zinc-200/80 hover:text-white hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* subtle neon line when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
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
              bg-[#031018]/92 backdrop-blur-2xl
              border-b border-cyan-400/15
              px-6 py-4
            "
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-mono tracking-[0.12em] text-zinc-200/85 hover:text-cyan-200 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language in mobile menu */}
            {mounted && (
              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.15em] mb-2">
                  {t.nav.language ?? 'Language'}
                </p>
                <div className="rounded-2xl border border-cyan-400/15 bg-white/5 p-2">
                  <LangItem lang="en" label="English" flag="🇬🇧" />
                  <LangItem lang="fi" label="Suomi" flag="🇫🇮" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}