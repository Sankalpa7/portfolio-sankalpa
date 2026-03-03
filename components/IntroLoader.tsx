'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type IntroLoaderProps = {
  accentColor: string
  onDone: () => void
}

/** ---------------- Icons (original colors) ---------------- */
const FACES = [
  {
    label: 'Next.js',
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <circle cx="40" cy="40" r="40" fill="#000" />
        <path
          d="M22 56V24l36 32V24"
          stroke="#fff"
          strokeWidth="6"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'React',
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <circle cx="40" cy="40" r="7" fill="#61dafb" />
        <ellipse cx="40" cy="40" rx="34" ry="13" stroke="#61dafb" strokeWidth="3.5" fill="none" />
        <ellipse
          cx="40"
          cy="40"
          rx="34"
          ry="13"
          stroke="#61dafb"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(60 40 40)"
        />
        <ellipse
          cx="40"
          cy="40"
          rx="34"
          ry="13"
          stroke="#61dafb"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(120 40 40)"
        />
      </svg>
    ),
  },
  {
    label: 'TypeScript',
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#3178c6" />
        <text x="8" y="60" fontFamily="Arial Black,sans-serif" fontSize="44" fontWeight="900" fill="#fff">
          TS
        </text>
      </svg>
    ),
  },
  {
    label: 'Tailwind',
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#0ea5e9" />
        <path
          d="M20 34c2.5-10 8.75-15 17.5-15 13.75 0 16.25 10 25 10 6.25 0 11.25-2.5 13.75-7.5C73.75 31.5 67.5 37 58.75 37c-13.75 0-16.25-10-25-10-6.25 0-11.25 2.5-13.75 7zm-10 16c2.5-10 8.75-15 17.5-15 13.75 0 16.25 10 25 10 6.25 0 11.25-2.5 13.75-7.5C63.75 47.5 57.5 53 48.75 53c-13.75 0-16.25-10-25-10-6.25 0-11.25 2.5-13.75 7z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    label: 'Node.js',
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#1a1a1a" />
        <polygon points="40,8 68,24 68,56 40,72 12,56 12,24" fill="none" stroke="#68a063" strokeWidth="4" />
        <text x="24" y="50" fontFamily="Arial Black,sans-serif" fontSize="20" fontWeight="900" fill="#68a063">
          JS
        </text>
      </svg>
    ),
  },
  {
    label: 'Vercel',
    Icon: () => (
      <svg viewBox="0 0 80 80" width="46" height="46" aria-hidden>
        <rect width="80" height="80" rx="10" fill="#111" />
        <polygon points="40,15 70,65 10,65" fill="#fff" />
      </svg>
    ),
  },
] as const

const PHASES = [
  'scanning modules…',
  'resolving imports…',
  'compiling tsx…',
  'bundling assets…',
  'tree-shaking…',
  'hydrating dom…',
  'stack online ✓',
] as const

const SLOGAN_WORDS = ['Welcome', 'to', "Sankalpa’s", 'Den'] as const

/** Cube geometry */
const S = 50 // translateZ(50px)
const FACE_SIZE = 100

const ASSEMBLED = [
  `translateZ(${S}px)`,
  `rotateY(180deg) translateZ(${S}px)`,
  `rotateY(-90deg) translateZ(${S}px)`,
  `rotateY(90deg) translateZ(${S}px)`,
  `rotateX(90deg) translateZ(${S}px)`,
  `rotateX(-90deg) translateZ(${S}px)`,
] as const

const FLY_FROM = [
  `translateX(-620px) translateZ(${S}px)`,
  `translateX(620px) rotateY(180deg) translateZ(${S}px)`,
  `translateY(-620px) rotateY(-90deg) translateZ(${S}px)`,
  `translateY(620px) rotateY(90deg) translateZ(${S}px)`,
  `translateX(620px) translateY(-620px) rotateX(90deg) translateZ(${S}px)`,
  `translateX(-620px) translateY(620px) rotateX(-90deg) translateZ(${S}px)`,
] as const

/** ---------------- Particle BG (simple, fast) ---------------- */
function ParticleBg({ accentColor }: { accentColor: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let w = (c.width = c.offsetWidth)
    let h = (c.height = c.offsetHeight)

    const ro = new ResizeObserver(() => {
      w = c.width = c.offsetWidth
      h = c.height = c.offsetHeight
    })
    ro.observe(c)

    const pts = Array.from({ length: 130 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      a: Math.random() * 0.55 + 0.12,
    }))

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const g1 = ctx.createRadialGradient(w * 0.25, h * 0.2, 0, w * 0.25, h * 0.2, Math.min(w, h) * 0.55)
      g1.addColorStop(0, `${accentColor}14`)
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(w * 0.8, h * 0.65, 0, w * 0.8, h * 0.65, Math.min(w, h) * 0.5)
      g2.addColorStop(0, `${accentColor}12`)
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [accentColor])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}

function Shockwave({ accentColor, onDone }: { accentColor: string; onDone: () => void }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        border: `1.5px solid ${accentColor}`,
        boxShadow: `0 0 16px ${accentColor}`,
      }}
      initial={{ opacity: 0.75, scale: 0 }}
      animate={{ opacity: 0, scale: 8 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onDone}
    />
  )
}

export default function IntroLoader({ accentColor, onDone }: IntroLoaderProps) {
  const [facesIn, setFacesIn] = useState<boolean[]>(Array(6).fill(false))
  const [allIn, setAllIn] = useState(false)
  const [flashAll, setFlashAll] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [rolled, setRolled] = useState(false)

  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const [shockwaves, setShockwaves] = useState<{ id: number }[]>([])
  const shockId = useRef(0)

  const [showSlogan, setShowSlogan] = useState(false)
  const [sloganWord, setSloganWord] = useState(-1)

  const [loaderOut, setLoaderOut] = useState(false)

  const cubeRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  // ✅ StrictMode-safe: store ALL timeouts to clear
  const timeouts = useRef<number[]>([])
  const setTO = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timeouts.current.push(id)
    return id
  }, [])

  const stopRAF = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  const rot = useRef({ x: -18, y: -20, z: 0, vx: 0, vy: 0, vz: 0, t: 0 })

  // ✅ StrictMode-safe guard: never start spin twice
  const spinStarted = useRef(false)

  const addShock = useCallback(() => {
    const id = ++shockId.current
    setShockwaves((p) => [...p, { id }])
  }, [])

  const removeShock = useCallback((id: number) => {
    setShockwaves((p) => p.filter((s) => s.id !== id))
  }, [])

  /** Alive spin after assembly */
  const startSpin = useCallback(() => {
    stopRAF()
    const r = rot.current

    const tick = () => {
      r.t += 0.013

      const ty = -20 + r.t * 60
      const tx = -18 + Math.sin(r.t * 0.7) * 18
      const tz = Math.sin(r.t * 0.45) * 7

      r.vy += (ty - r.y) * 0.04
      r.vy *= 0.82
      r.y += r.vy

      r.vx += (tx - r.x) * 0.038
      r.vx *= 0.8
      r.x += r.vx

      r.vz += (tz - r.z) * 0.03
      r.vz *= 0.78
      r.z += r.vz

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${r.x}deg) rotateY(${r.y}deg) rotateZ(${r.z}deg)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [stopRAF])

  /** Dice roll (Ludo feel) */
  const startRoll = useCallback(() => {
    stopRAF()
    const r = rot.current

    const spinX = 720 + Math.floor(Math.random() * 4) * 90
    const spinY = 1080 + Math.floor(Math.random() * 4) * 90
    const spinZ = 360 + Math.floor(Math.random() * 4) * 90

    const sx = r.x
    const sy = r.y
    const sz = r.z

    const start = performance.now()
    const DURATION = 1100

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

    const roll = () => {
      const p = Math.min((performance.now() - start) / DURATION, 1)
      const e = easeOut(p)

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${sx + spinX * e}deg) rotateY(${sy + spinY * e}deg) rotateZ(${
          sz + spinZ * e
        }deg)`
      }

      if (p < 1) rafRef.current = requestAnimationFrame(roll)
      else setRolled(true)
    }

    rafRef.current = requestAnimationFrame(roll)
  }, [stopRAF])

  /** Cleanup: stop everything on unmount (StrictMode-safe) */
  useEffect(() => {
    return () => {
      stopRAF()
      for (const id of timeouts.current) window.clearTimeout(id)
      timeouts.current = []
      spinStarted.current = false
    }
  }, [stopRAF])

  /** Assemble faces with staging */
  useEffect(() => {
    FACES.forEach((_, i) => {
      setTO(() => {
        setFacesIn((p) => {
          const n = [...p]
          n[i] = true
          return n
        })
        addShock()

        if (i === FACES.length - 1) {
          setTO(() => {
            setFlashAll(true)
            addShock()
            setTO(() => {
              setFlashAll(false)
              setAllIn(true)
            }, 220)
          }, 420)
        }
      }, 160 + i * 210)
    })
  }, [addShock, setTO])

  /** Start spinning after assembly (guarded) */
  useEffect(() => {
    if (!allIn) return
    if (spinStarted.current) return
    spinStarted.current = true
    startSpin()
  }, [allIn, startSpin])

  /** Progress (fast) */
  useEffect(() => {
    let p = 0
    const iv = window.setInterval(() => {
      const step = p < 72 ? Math.random() * 7 + 4 : p < 92 ? Math.random() * 3 + 2 : 2
      p = Math.min(100, p + step)
      setProgress(Math.floor(p))
      setPhase(Math.floor((p / 100) * (PHASES.length - 1)))

      if (p >= 100) {
        window.clearInterval(iv)
        setTO(() => {
          setRolling(true)
          addShock()
          startRoll()
        }, 180)
      }
    }, 90)

    return () => window.clearInterval(iv)
  }, [addShock, setTO, startRoll])

  /** After roll -> dismantle -> slogan -> done */
  useEffect(() => {
    if (!rolled) return
    setTO(() => {
      addShock()
      setLoaderOut(true)
      setTO(() => {
        setShowSlogan(true)
        setSloganWord(0)
      }, 380)
    }, 120)
  }, [rolled, addShock, setTO])

  useEffect(() => {
    if (!showSlogan) return
    SLOGAN_WORDS.forEach((_, i) => setTO(() => setSloganWord(i), i * 280))
    setTO(() => onDone(), 280 * SLOGAN_WORDS.length + 750)
  }, [showSlogan, onDone, setTO])

  /** ESC skip */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopRAF()
        onDone()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone, stopRAF])

  const containerGlow = useMemo(
    () => ({
      boxShadow: flashAll ? `0 0 42px ${accentColor}` : `0 0 24px ${accentColor}55`,
      filter: flashAll ? 'brightness(1.25)' : 'none',
    }),
    [flashAll, accentColor]
  )

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: '#03010a' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <ParticleBg accentColor={accentColor} />

      {/* Skip */}
      <button
        type="button"
        onClick={() => {
          stopRAF()
          onDone()
        }}
        className="absolute right-4 top-4 z-50 rounded-full px-4 py-2 text-xs font-mono tracking-widest uppercase backdrop-blur"
        style={{
          border: `1px solid ${accentColor}`,
          color: 'rgba(255,255,255,0.9)',
          background: 'rgba(255,255,255,0.06)',
          boxShadow: `0 0 18px ${accentColor}40`,
        }}
      >
        Skip (Esc)
      </button>

      {/* Shockwaves */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {shockwaves.map((s) => (
            <Shockwave key={s.id} accentColor={accentColor} onDone={() => removeShock(s.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* Center */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative flex flex-col items-center">
          {/* Cube stage */}
          <div
            className="relative"
            style={{
              width: 220,
              height: 220,
              perspective: 700,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: FACE_SIZE,
                height: FACE_SIZE,
                transform: 'translate(-50%, -50%)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* cube */}
              <div
                ref={cubeRef}
                className="absolute inset-0"
                style={{
                  transformStyle: 'preserve-3d',
                  ...containerGlow,
                }}
              >
                {FACES.map((face, i) => {
                  const inNow = facesIn[i]

                  const dismantle =
                    loaderOut && rolling
                      ? `translateX(${i % 2 ? 280 : -280}px) translateY(${i < 2 ? -220 : i < 4 ? 220 : 0}px) ${ASSEMBLED[i]}`
                      : ASSEMBLED[i]

                  return (
                    <motion.div
                      key={face.label}
                      className="absolute left-1/2 top-1/2 grid place-items-center"
                      style={{
                        width: FACE_SIZE,
                        height: FACE_SIZE,
                        borderRadius: 18,
                        transformStyle: 'preserve-3d',
                        border: `1px solid ${accentColor}`,
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: `0 0 22px ${accentColor}35`,
                      }}
                      initial={{
                        opacity: 0,
                        transform: `translate(-50%, -50%) ${FLY_FROM[i]}`,
                      }}
                      animate={{
                        opacity: inNow ? (loaderOut ? 0 : 1) : 0,
                        transform: inNow
                          ? `translate(-50%, -50%) ${dismantle}`
                          : `translate(-50%, -50%) ${FLY_FROM[i]}`,
                        scale: flashAll ? 1.02 : 1,
                      }}
                      transition={{
                        duration: inNow ? 0.6 : 0.4,
                        ease: [0.34, 1.4, 0.64, 1],
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-[18px]"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.06))',
                          opacity: 0.55,
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-[18px]"
                        style={{
                          boxShadow: `inset 0 0 22px ${accentColor}28`,
                          pointerEvents: 'none',
                        }}
                      />
                      <div className="relative z-10">
                        <face.Icon />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8 w-[320px] max-w-[78vw]">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-white/80">
                {PHASES[phase]}
              </div>
              <div className="text-[11px] font-mono tracking-widest text-white/60">{progress}%</div>
            </div>

            <div
              className="relative h-2 w-full overflow-hidden rounded-full"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${accentColor}55`,
                boxShadow: `0 0 18px ${accentColor}25`,
              }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${accentColor}55, ${accentColor})`,
                }}
              />
              <motion.div
                className="absolute top-0 h-full w-24 -skew-x-12 opacity-40"
                style={{ background: 'rgba(255,255,255,0.35)' }}
                animate={{ x: ['-30%', '140%'] }}
                transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slogan */}
      <AnimatePresence>
        {showSlogan && (
          <motion.div
            className="absolute inset-0 z-40 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="text-center">
              <div
                className="text-[44px] md:text-[64px] font-bold leading-tight text-white"
                style={{
                  fontFamily: 'var(--font-syne)',
                  textShadow: `0 0 34px ${accentColor}55`,
                }}
              >
                {SLOGAN_WORDS.map((w, i) => (
                  <motion.span
                    key={w}
                    className="inline-block mr-3"
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: i <= sloganWord ? 0 : 14, opacity: i <= sloganWord ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    {w}
                  </motion.span>
                ))}
              </div>

              <div className="mt-4 text-xs font-mono tracking-[0.22em] uppercase text-white/70">
                stack online ✓
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}