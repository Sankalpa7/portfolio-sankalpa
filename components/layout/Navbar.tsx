'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n/LangContext'

type LangKey = 'en' | 'fi'

function LangItem({
  lang,
  label,
  flag,
  active,
  onPick,
}: {
  lang: LangKey
  label: string
  flag: string
  active: boolean
  onPick: (lang: LangKey) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(lang)}
      className={[
        'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-colors',
        active
          ? 'bg-cyan-100 text-slate-900 dark:bg-cyan-500/15 dark:text-cyan-200'
          : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/5',
      ].join(' ')}
    >
      <span className="flex items-center gap-2">
        <span className="text-base">{flag}</span>
        <span className="font-mono text-[13px] tracking-wide">{label}</span>
      </span>
      {active && <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-300">ACTIVE</span>}
    </button>
  )
}

function MobileMenuPortal({
  open,
  onClose,
  links,
}: {
  open: boolean
  onClose: () => void
  links: { label: string; href: string }[]
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[2147483646] bg-black/65 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[2147483647] md:hidden bg-[#031018] text-white overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pt-20 px-6 pb-10">
              <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-white/60 mb-6">
                Tap a section to jump
              </div>

              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="
                        block py-3 px-3 rounded-2xl
                        text-base font-mono tracking-wide
                        text-white/90 hover:text-cyan-200
                        hover:bg-white/5
                        transition-colors
                      "
                      suppressHydrationWarning
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default function Navbar() {
  const { setTheme } = useTheme()
  const { locale, setLocale, t } = useLang()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const langRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
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
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const navFallback = useMemo(
    () => ({
      about: 'About',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      certifications: 'Certifications',
      contact: 'Contact',
    }),
    []
  )

  const navLinks = useMemo(
    () => [
      { label: t?.nav?.about ?? navFallback.about, href: '#about' },
      { label: t?.nav?.projects ?? navFallback.projects, href: '#projects' },
      { label: t?.nav?.experience ?? navFallback.experience, href: '#experience' },
      { label: t?.nav?.skills ?? navFallback.skills, href: '#skills' },
      { label: t?.nav?.certifications ?? navFallback.certifications, href: '#certifications' },
      { label: t?.nav?.contact ?? navFallback.contact, href: '#contact' },
    ],
    [t, navFallback]
  )

  const navbarClass = scrolled
    ? `
      bg-white/80 backdrop-blur-2xl border-b border-slate-200
      shadow-[0_10px_40px_rgba(2,6,23,0.06)]
      dark:bg-[#001018]/80
      dark:border-cyan-400/25
      dark:shadow-[0_6px_40px_rgba(0,229,255,0.12)]
    `
    : 'bg-transparent'

  const currentLang = useMemo(() => {
    const map: Record<LangKey, { label: string; flag: string }> = {
      en: { label: 'English', flag: '🇬🇧' },
      fi: { label: 'Suomi', flag: '🇫🇮' },
    }
    return map[(locale as LangKey) ?? 'en']
  }, [locale])

  const pickLang = useCallback(
    (l: LangKey) => {
      setLocale(l)
      setLangOpen(false)
      setMenuOpen(false)
    },
    [setLocale]
  )

  const closeAll = useCallback(() => {
    setMenuOpen(false)
    setLangOpen(false)
  }, [])

  const onToggleMenu = useCallback(() => {
    setMenuOpen((v) => {
      const next = !v
      if (next) setLangOpen(false)
      return next
    })
  }, [])

  // ✅ NO hydration mismatch: uses DOM class at click-time, not render-time.
  const toggleTheme = useCallback(() => {
    const isDarkNow = document.documentElement.classList.contains('dark')
    setTheme(isDarkNow ? 'light' : 'dark')
  }, [setTheme])

  return (
    <>
      <header className={'fixed top-0 left-0 right-0 z-[10000] transition-all duration-300 ' + navbarClass}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">
          {/* Logo */}
          <a
            href="#"
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
            onClick={closeAll}
          >
            Sankalpa<span className="text-cyan-500">.</span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="
                    text-[13px] font-mono tracking-[0.14em]
                    text-slate-700 hover:text-cyan-700
                    dark:text-zinc-200/80 dark:hover:text-cyan-200
                    transition-colors
                  "
                  suppressHydrationWarning
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white/70 dark:hover:bg-white/10"
                aria-label="Language"
              >
                <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
                <span className="font-mono text-[12px] flex items-center gap-2">
                  {/* ✅ prevent locale mismatch overlay */}
                  <span suppressHydrationWarning>{currentLang.flag}</span>
                  <span className="hidden sm:inline" suppressHydrationWarning>
                    {currentLang.label}
                  </span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="
                      absolute right-0 mt-2 w-52 p-2 rounded-2xl
                      bg-white dark:bg-[#04131b]
                      border border-slate-200 dark:border-cyan-400/15
                      shadow-xl
                    "
                  >
                    <LangItem lang="en" label="English" flag="🇬🇧" active={locale === 'en'} onPick={pickLang} />
                    <LangItem lang="fi" label="Suomi" flag="🇫🇮" active={locale === 'fi'} onPick={pickLang} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle (✅ hydration-safe) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {/* Always render BOTH. CSS decides visibility. */}
              <span className="hidden dark:inline-flex">
                <Sun className="w-4 h-4" />
              </span>
              <span className="inline-flex dark:hidden">
                <Moon className="w-4 h-4" />
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden rounded-full w-9 h-9 inline-flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-white/10"
              onClick={onToggleMenu}
              aria-label="Open menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenuPortal open={menuOpen} onClose={closeAll} links={navLinks} />
    </>
  )
}