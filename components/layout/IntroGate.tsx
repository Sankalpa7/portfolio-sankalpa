"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntroLoader from "@/components/ui/IntroLoader";

/**
 * How often the intro plays:
 *  - 0                   -> on every page load (development)
 *  - 24 * 60 * 60 * 1000 -> at most once per day per browser (production)
 */
const REPLAY_AFTER_MS = 24 * 60 * 60 * 1000;

const STORAGE_KEY = "introLastSeen";

export default function IntroGate() {
  const [show, setShow] = useState(true);

  // Skip the loader if it was already shown recently
  useEffect(() => {
    if (REPLAY_AFTER_MS <= 0) return;
    try {
      const last = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
      if (Date.now() - last < REPLAY_AFTER_MS) setShow(false);
    } catch {
      /* storage unavailable: just show it */
    }
  }, []);

  // No page scrolling behind the loader
  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [show]);

  const handleDone = useCallback(() => {
    setShow(false);
    if (REPLAY_AFTER_MS <= 0) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <IntroLoader key="intro" accentColor="#22d3ee" onDone={handleDone} />
      )}
    </AnimatePresence>
  );
}
