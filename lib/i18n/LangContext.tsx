'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import en from './en'
import fi from './fi'
import type { Translations } from './en'

type Locale = 'en' | 'fi'

const translations: Record<Locale, Translations> = { en, fi }

type LangContextType = {
  locale: Locale
  t: Translations
  setLocale: (l: Locale) => void
}

const LangContext = createContext<LangContextType>({
  locale: 'en',
  t: en,
  setLocale: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  // ✅ Always default to English on server & first render
  const [locale, setLocale] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  // ✅ After mount, read saved language
  useEffect(() => {
    setMounted(true)

    const saved = localStorage.getItem('lang')
    if (saved === 'fi' || saved === 'en') {
      setLocale(saved)
    }
  }, [])

  // ✅ Persist changes
  const handleSetLocale = (l: Locale) => {
    setLocale(l)
    try {
      localStorage.setItem('lang', l)
    } catch {}
  }

  // ✅ Update <html lang="">
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale
    }
  }, [locale, mounted])

  return (
    <LangContext.Provider
      value={{
        locale,
        t: translations[locale],
        setLocale: handleSetLocale,
      }}
    >
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}