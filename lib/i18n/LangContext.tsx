'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
  const [locale, setLocaleState] = useState<Locale>('en')

  // persist choice in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Locale | null
    if (saved && (saved === 'en' || saved === 'fi')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}