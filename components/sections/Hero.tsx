"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { useLang } from "@/lib/i18n/LangContext";

const TechSphere = dynamic(() => import("@/components/three/TechSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="font-mono text-xs text-slate-500 dark:text-zinc-600">
        {"// loading sphere..."}
      </p>
    </div>
  ),
});

const SOCIALS = [
  { href: "https://github.com/Sankalpa7", icon: Github, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/sankalpaneupane7/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "mailto:sankalpaneupane7@gmail.com", icon: Mail, label: "Email" },
];

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-50 dark:bg-[#0a0a0a]"
    >
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/7" />
        <div className="absolute -bottom-28 right-1/5 h-[460px] w-[460px] rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/6" />
      </div>

      <div className="relative z-10 w-full pt-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 md:grid-cols-[1.15fr_0.85fr] md:gap-6">
          {/* LEFT */}
          <div className="flex flex-col items-start px-6 py-12 md:pl-6 md:pr-4 xl:pl-10 xl:pr-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500/60 [animation-delay:200ms]" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500/30 [animation-delay:400ms]" />
              </div>

              <span className="rounded-full border border-cyan-500/30 bg-white/70 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyan-700 backdrop-blur dark:bg-cyan-500/5 dark:text-cyan-400">
                {t.hero.available}
              </span>
            </div>

            <h1 className="mb-4 font-syne text-6xl font-bold leading-[1.1] md:text-7xl">
              <span className="block text-slate-900 dark:text-white">
                {t.hero.firstName}
              </span>
              {/* pb keeps descenders from being clipped by bg-clip-text */}
              <span className="block bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400 bg-clip-text pb-1 text-transparent">
                {t.hero.lastName}
              </span>
            </h1>

            <p className="mb-6 font-mono text-base font-medium uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
              {t.hero.tagline}
            </p>

            <p className="mb-10 max-w-lg font-mono text-sm leading-6 text-slate-600 dark:text-zinc-400 md:leading-7">
              {t.hero.bio_lines.map((line, i) => (
                <span key={i}>
                  {line} {/* forced line break only from md and up */}
                  <br className="hidden md:inline" />
                </span>
              ))}
              <span className="mt-2 block font-medium text-cyan-700 dark:text-cyan-400">
                {t.hero.bio_highlight}
              </span>
            </p>

            {/* Buttons */}
            <div className="mb-12 flex flex-wrap gap-3">
              <Button
                asChild
                className="flex items-center gap-2 rounded-full bg-cyan-500 px-7 py-5 font-mono text-black shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-400"
              >
                <a href="#projects">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.18em]">
                    {t.hero.cta_projects}
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>

              {/* CV download: cv.pdf lives in /public */}
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2 rounded-full border-slate-300 bg-white px-7 py-5 font-mono text-slate-900 transition-all duration-200 hover:border-cyan-500 hover:bg-slate-100 dark:border-zinc-700 dark:bg-white/5 dark:text-white dark:hover:border-cyan-500 dark:hover:bg-white/10"
              >
                <a href="/cv.pdf" download>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.18em]">
                    {t.hero.cta_cv}
                  </span>
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ href, icon: Icon, label }) => {
                const external = href.startsWith("http");
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-cyan-400 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-zinc-800 dark:bg-white/5 dark:text-zinc-500 dark:shadow-none dark:hover:text-cyan-400"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* RIGHT: shown on every screen size, scaled down on phones */}
          <div className="flex items-center justify-center px-4 pb-12 md:py-12 md:pr-6 xl:pr-10">
            <div className="relative h-[370px] w-[330px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(2,6,23,0.08)] dark:border-transparent dark:bg-transparent dark:shadow-none md:h-[500px] md:w-[500px]">
              {/* Subtle radial glow, light mode only */}
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,transparent_65%)] dark:hidden"
                aria-hidden="true"
              />

              <div className="relative flex h-full w-full items-center justify-center md:pt-4">
                {/* scale-[0.72] shrinks the 420px sphere to ~300px so it fits a 375px phone */}
                <div className="origin-center scale-[0.72] md:scale-100">
                  <TechSphere />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop only: on phones it overlaps the sphere legend) */}
      <div
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-xs tracking-widest text-slate-400 dark:text-zinc-600">
          {t.hero.scroll}
        </span>
        <div className="h-10 w-px animate-pulse bg-gradient-to-b from-slate-400 to-transparent dark:from-zinc-600" />
      </div>
    </section>
  );
}
