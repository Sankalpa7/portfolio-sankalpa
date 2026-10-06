"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";

type LangKey = "en" | "fi";

const LANGS: Record<LangKey, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  fi: { label: "Suomi", flag: "🇫🇮" },
};

// Labels that are not in the translation files yet
const NAV_TEXT: Record<
  LangKey,
  {
    language: string;
    theme: string;
    light: string;
    dark: string;
    changeLang: string;
    toggleTheme: string;
    toggleMenu: string;
  }
> = {
  en: {
    language: "Language",
    theme: "Theme",
    light: "Light mode",
    dark: "Dark mode",
    changeLang: "Change language",
    toggleTheme: "Toggle theme",
    toggleMenu: "Toggle menu",
  },
  fi: {
    language: "Kieli",
    theme: "Teema",
    light: "Vaalea tila",
    dark: "Tumma tila",
    changeLang: "Vaihda kieli",
    toggleTheme: "Vaihda teema",
    toggleMenu: "Avaa tai sulje valikko",
  },
};

const NAVBAR_SCROLLED = [
  "bg-white/80 backdrop-blur-2xl border-b border-slate-200",
  "shadow-[0_10px_40px_rgba(2,6,23,0.06)]",
  "dark:bg-[#001018]/80 dark:border-cyan-400/25",
  "dark:shadow-[0_6px_40px_rgba(0,229,255,0.12)]",
].join(" ");

function LangItem({
  lang,
  active,
  onSelect,
}: {
  lang: LangKey;
  active: boolean;
  onSelect: (lang: LangKey) => void;
}) {
  const { label, flag } = LANGS[lang];

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={() => onSelect(lang)}
      className={[
        "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-colors",
        active
          ? "bg-cyan-100 text-slate-900 dark:bg-cyan-500/15 dark:text-cyan-200"
          : "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/5",
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        <span className="text-base leading-none">{flag}</span>
        <span className="font-mono text-[13px] tracking-wide">{label}</span>
      </span>
      {active && (
        <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300">
          ACTIVE
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLang();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  const isDark = resolvedTheme === "dark";
  const activeLang: LangKey = locale === "fi" ? "fi" : "en";
  const currentLang = LANGS[activeLang];
  const txt = NAV_TEXT[activeLang];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const toggleMenu = () => {
    setLangOpen(false);
    setMenuOpen((v) => !v);
  };

  const selectLang = (lang: LangKey) => {
    setLocale(lang);
    setLangOpen(false);
    setMenuOpen(false);
  };

  // Close the menu first, then scroll, so the menu collapse can't cancel the scroll on mobile
  const goTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setLangOpen(false);

    window.setTimeout(() => {
      const id = href.replace("#", "");
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", id ? href : window.location.pathname);
    }, 60);
  };

  const navLinks = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.certifications, href: "#certifications" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? NAVBAR_SCROLLED : "bg-transparent",
      ].join(" ")}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => goTo(e, "#")}
          className="font-syne text-lg font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity dark:text-white"
        >
          Sankalpa<span className="text-cyan-600 dark:text-cyan-400">.</span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => goTo(e, link.href)}
                className="text-[13px] font-mono tracking-[0.14em] text-slate-700 hover:text-cyan-700 transition-colors duration-200 dark:text-zinc-200/80 dark:hover:text-cyan-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <div
            className="
              inline-flex items-center gap-2 rounded-full px-2 py-1
              border border-slate-200 bg-white/70 backdrop-blur
              shadow-[0_10px_30px_rgba(2,6,23,0.06)]
              dark:border-cyan-400/20 dark:bg-white/5
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
                    inline-flex items-center gap-2 rounded-full px-3 py-2
                    border border-transparent hover:bg-white/70 transition-all
                    dark:hover:bg-white/10
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50
                  "
                  aria-haspopup="menu"
                  aria-expanded={langOpen}
                  aria-label={txt.changeLang}
                >
                  <Globe className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                  <span className="text-[12px] font-mono font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <span className="text-base leading-none">
                      {currentLang.flag}
                    </span>
                    <span className="hidden sm:inline">
                      {currentLang.label}
                    </span>
                  </span>
                  <ChevronDown
                    className={[
                      "h-4 w-4 transition-transform text-slate-600 dark:text-zinc-200/80",
                      langOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      role="menu"
                      className="
                        absolute right-0 mt-2 w-56 rounded-2xl p-2 z-50
                        border border-slate-200 bg-white/95 backdrop-blur-2xl
                        shadow-[0_18px_60px_rgba(2,6,23,0.14)]
                        dark:border-cyan-400/15 dark:bg-[#04131b]/90
                        dark:shadow-[0_18px_60px_rgba(0,0,0,0.6)]
                      "
                    >
                      {(Object.keys(LANGS) as LangKey[]).map((lang) => (
                        <LangItem
                          key={lang}
                          lang={lang}
                          active={activeLang === lang}
                          onSelect={selectLang}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />

            {/* Theme toggle (placeholder keeps the width stable before mount) */}
            {mounted ? (
              <button
                type="button"
                onClick={toggleTheme}
                className="
                  inline-flex items-center justify-center rounded-full w-9 h-9
                  text-slate-700 hover:text-slate-900 hover:bg-white/70
                  dark:text-zinc-200/80 dark:hover:text-white dark:hover:bg-white/10
                  transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50
                "
                aria-label={txt.toggleTheme}
                title={isDark ? txt.light : txt.dark}
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            ) : (
              <span className="w-9 h-9" aria-hidden="true" />
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
            onClick={toggleMenu}
            aria-label={txt.toggleMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Subtle line when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-cyan-400/35" />
        )}
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="
              md:hidden overflow-hidden px-6 py-4
              bg-white/90 backdrop-blur-2xl border-b border-slate-200
              dark:bg-[#031018]/90 dark:border-cyan-400/15
            "
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => goTo(e, link.href)}
                    className="text-sm font-mono tracking-[0.12em] text-slate-700 hover:text-cyan-700 transition-colors dark:text-zinc-200/85 dark:hover:text-cyan-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {mounted && (
              <>
                <div className="mt-5 pt-5 border-t border-slate-200 dark:border-white/10">
                  <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-2">
                    {txt.language}
                  </p>
                  <div
                    role="menu"
                    className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-cyan-400/15 dark:bg-white/5"
                  >
                    {(Object.keys(LANGS) as LangKey[]).map((lang) => (
                      <LangItem
                        key={lang}
                        lang={lang}
                        active={activeLang === lang}
                        onSelect={selectLang}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-2">
                    {txt.theme}
                  </p>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="
                      w-full flex items-center justify-between rounded-2xl px-4 py-3
                      border border-slate-200 bg-white text-slate-700
                      hover:border-cyan-300 hover:text-cyan-700 transition-colors
                      dark:border-cyan-400/15 dark:bg-white/5 dark:text-zinc-200/85 dark:hover:text-cyan-200
                    "
                  >
                    <span className="font-mono text-[13px] tracking-wide">
                      {isDark ? txt.light : txt.dark}
                    </span>
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
