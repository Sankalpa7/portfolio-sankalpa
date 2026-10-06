"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "./en";
import fi from "./fi";
import type { Translations } from "./en";

export type Locale = "en" | "fi";

const STORAGE_KEY = "lang";

const translations: Record<Locale, Translations> = { en, fi };

type LangContextType = {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
};

const LangContext = createContext<LangContextType>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

const isLocale = (v: unknown): v is Locale => v === "en" || v === "fi";

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Restore the saved choice after mount (keeps server and client HTML identical)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
    } catch {
      /* storage unavailable: stay on the default */
    }
  }, []);

  // Keep <html lang="..."> in sync for screen readers and search engines
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ locale, t: translations[locale], setLocale }),
    [locale, setLocale],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
