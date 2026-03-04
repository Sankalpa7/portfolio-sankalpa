"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const IntroLoader = dynamic(() => import("@/components/IntroLoader"), {
  ssr: false,
});

type AppShellProps = {
  accentColor: string;
  children: React.ReactNode;
};

export default function AppShell({ accentColor, children }: AppShellProps) {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [decided, setDecided] = useState(false);

  // ✅ Prevent browser scroll restore from sending you to a section on refresh
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {}
  }, []);

  useEffect(() => {
    // decide only on client
    try {
      const seen = sessionStorage.getItem("intro_seen");
      const shouldShow = seen !== "1";
      setShowIntro(shouldShow);
      setReady(!shouldShow);

      // ✅ If we are NOT showing intro, still force top on reload
      if (!shouldShow) {
        // remove hash so refresh doesn't jump to #education etc.
        if (window.location.hash) {
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    } catch {
      setShowIntro(true);
      setReady(false);
    } finally {
      setDecided(true);
    }
  }, []);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("intro_seen", "1");
    } catch {}

    // ✅ On first reveal, always start at top and clear hash
    try {
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {}

    setShowIntro(false);
    setReady(true);
  }, []);

  return (
    <>
      {/* site (hidden + non-clickable while intro is up) */}
      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ pointerEvents: ready ? "auto" : "none" }}
      >
        {children}
      </motion.div>

      {/* loader overlay ALWAYS on top */}
      <AnimatePresence mode="wait">
        {decided && showIntro ? (
          <IntroLoader key="intro" accentColor={accentColor} onDone={finish} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
