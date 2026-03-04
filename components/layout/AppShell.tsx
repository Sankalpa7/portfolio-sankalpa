'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'

const IntroLoader = dynamic(() => import('@/components/IntroLoader'), {
  ssr: false, // ✅ no SSR for canvas/random
})

type AppShellProps = {
  accentColor: string
  children: React.ReactNode
}

export default function AppShell({ accentColor, children }: AppShellProps) {
  const [ready, setReady] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [decided, setDecided] = useState(false)

  useEffect(() => {
    // decide only on client
    try {
      const seen = sessionStorage.getItem('intro_seen')
      const shouldShow = seen !== '1'
      setShowIntro(shouldShow)
      setReady(!shouldShow)
    } catch {
      setShowIntro(true)
      setReady(false)
    } finally {
      setDecided(true)
    }
  }, [])

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem('intro_seen', '1')
    } catch {}
    setShowIntro(false)
    setReady(true)
  }, [])

  return (
    <>
      {/* ✅ your site (hidden + non-clickable while intro is up) */}
      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ pointerEvents: ready ? 'auto' : 'none' }}
      >
        {children}
      </motion.div>

      {/* ✅ loader overlay ALWAYS on top */}
      <AnimatePresence mode="wait">
        {decided && showIntro ? (
          <IntroLoader key="intro" accentColor={accentColor} onDone={finish} />
        ) : null}
      </AnimatePresence>
    </>
  )
}