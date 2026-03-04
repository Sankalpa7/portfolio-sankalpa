'use client'

import { useSyncExternalStore } from 'react'

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const mounted = useHasMounted()
  if (!mounted) return null
  return <>{children}</>
}