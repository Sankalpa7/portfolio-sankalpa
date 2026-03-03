'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import IntroLoader from '@/components/IntroLoader'

type AppShellProps = {
  accentColor: string // pass "var(--accent)" from layout
  children: React.ReactNode
}

export default function AppShell({ accentColor, children }: AppShellProps) {
  const [ready, setReady] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    // show loader only once per session
    const seen = sessionStorage.getItem('intro_seen')
    if (seen === '1') {
      setShowIntro(false)
      setReady(true)
      return
    }
    setShowIntro(true)
  }, [])

  const finish = () => {
    try {
      sessionStorage.setItem('intro_seen', '1')
    } catch {}
    setShowIntro(false)
    setReady(true)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroLoader key="intro" accentColor={accentColor} onDone={finish} />
        )}
      </AnimatePresence>

      {/* Content reveal (avoids sudden pop) */}
      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ pointerEvents: ready ? 'auto' : 'none' }}
      >
        {children}
      </motion.div>
    </>
  )
}