"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./en";
import fi from "./fi";
import type { Translations } from "./en";

export type Locale = "en" | "fi";

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

export function LangProvider({ children }: { children: React.ReactNode }) {
  // ✅ Always start in English
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = (l: Locale) => {
    setLocaleState(l);

    // Optional: save the user's choice for later use (but we won't auto-apply it on load)
    try {
      window.localStorage.setItem("lang", l);
    } catch {}

    // Keep <html lang="..."> correct immediately
    document.documentElement.lang = l;
  };

  const t = useMemo(() => translations[locale], [locale]);

  // Keep <html lang="..."> correct on first render too
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LangContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
