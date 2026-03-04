'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import fi from './fi'
import type { Translations } from './en'

export type Locale = 'en' | 'fi'

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

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem('lang')
    return saved === 'fi' || saved === 'en' ? saved : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale())

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    try {
      window.localStorage.setItem('lang', l)
    } catch {}
  }

  const t = useMemo(() => translations[locale], [locale])

  // external system sync is OK (no setState here)
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <LangContext.Provider value={{ locale, t, setLocale }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}