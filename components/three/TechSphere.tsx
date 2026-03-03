'use client'

import { useEffect, useRef } from 'react'

const techs = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'JavaScript', icon: 'JS' },
  { name: 'HTML5', icon: '🌐' },
  { name: 'CSS3', icon: '🎨' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Express', icon: '🚂' },
  { name: 'Django', icon: '🎸' },
  { name: 'Python', icon: '🐍' },
  { name: 'Java', icon: '☕' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Firebase', icon: '🔥' },
  { name: 'MySQL', icon: '🐬' },
  { name: 'OpenAI', icon: '🤖' },
  { name: 'Claude AI', icon: '🧠' },
  { name: 'LangChain', icon: '🔗' },
  { name: 'HuggingFace', icon: '🤗' },
  { name: 'TensorFlow', icon: '🧩' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Vercel', icon: '▲' },
  { name: 'Git', icon: '🔀' },
  { name: 'REST APIs', icon: '🔌' },
  { name: 'GitHub CI', icon: '⚡' },
  { name: 'C / C++', icon: '⚙️' },
]

const legend = [
  { label: 'Frontend', color: '#61dafb' },
  { label: 'Backend', color: '#68a063' },
  { label: 'AI / ML', color: '#a855f7' },
  { label: 'DevOps', color: '#fb923c' },
  { label: 'Database', color: '#22c55e' },
  { label: 'Language', color: '#eab308' },
]

function fibonacciSphere(n: number) {
  const pts: { x: number; y: number; z: number }[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
  }
  return pts
}

export default function TechSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const angleX = useRef(0.3)
  const angleY = useRef(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const velX = useRef(0)
  const velY = useRef(0)
  const rafRef = useRef<number>(0)
  const speedRef = useRef(0.5)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ✅ smaller radius to match smaller visual area
    const R = 135
    const positions = fibonacciSphere(techs.length)

    type Item = {
      el: HTMLDivElement
      iconEl: HTMLDivElement
      labelEl: HTMLDivElement
      ox: number
      oy: number
      oz: number
    }

    const items: Item[] = []
    container.innerHTML = ''

    const isDark = () => document.documentElement.classList.contains('dark')

    const getThemeTokens = () => {
      if (isDark()) {
        return {
          iconBg: 'rgba(255,255,255,0.04)',
          iconBorder: 'rgba(255,255,255,0.08)',
          label: 'rgba(255,255,255,0.42)',
        }
      }
      return {
        iconBg: 'rgba(2,6,23,0.04)',
        iconBorder: 'rgba(2,6,23,0.10)',
        label: 'rgba(15,23,42,0.68)',
      }
    }

    const applyThemeToItem = (item: Item) => {
      const tok = getThemeTokens()
      item.iconEl.style.background = tok.iconBg
      item.iconEl.style.borderColor = tok.iconBorder
      item.labelEl.style.color = tok.label
    }

    techs.forEach((tech, i) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        cursor: pointer;
        user-select: none;
        transition: filter 0.2s;
        will-change: transform, opacity;
        transform: translate3d(-50%, -50%, 0);
      `

      const iconEl = document.createElement('div')
      iconEl.style.cssText = `
        width: 36px; height: 36px;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.1rem;
        transition: background 0.2s, border-color 0.2s;
        border: 1px solid transparent;
        background: transparent;
      `
      iconEl.textContent = tech.icon

      const labelEl = document.createElement('div')
      labelEl.style.cssText = `
        font-size: 0.5rem;
        font-family: 'JetBrains Mono', monospace;
        white-space: nowrap;
        transition: color 0.2s;
      `
      labelEl.textContent = tech.name

      el.appendChild(iconEl)
      el.appendChild(labelEl)

      const item: Item = {
        el,
        iconEl,
        labelEl,
        ox: positions[i].x,
        oy: positions[i].y,
        oz: positions[i].z,
      }

      applyThemeToItem(item)

      el.addEventListener('mouseenter', () => {
        el.style.filter = 'drop-shadow(0 0 8px #06b6d4)'
        iconEl.style.background = 'rgba(6,182,212,0.15)'
        iconEl.style.borderColor = 'rgba(6,182,212,0.5)'
        labelEl.style.color = '#06b6d4'
      })

      el.addEventListener('mouseleave', () => {
        el.style.filter = 'none'
        applyThemeToItem(item)
      })

      container.appendChild(el)
      items.push(item)
    })

    function rotateX(p: { x: number; y: number; z: number }, a: number) {
      const c = Math.cos(a)
      const s = Math.sin(a)
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
    }
    function rotateY(p: { x: number; y: number; z: number }, a: number) {
      const c = Math.cos(a)
      const s = Math.sin(a)
      return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
    }

    function render() {
      for (const item of items) {
        let p = { x: item.ox, y: item.oy, z: item.oz }
        p = rotateX(p, angleX.current)
        p = rotateY(p, angleY.current)

        const scale = (p.z + 1.6) / 2.6
        const x = p.x * R
        const y = p.y * R

        const s = 0.62 + scale * 0.58
        item.el.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) scale(${s})`
        item.el.style.opacity = String(0.28 + scale * 0.72)
        item.el.style.zIndex = String(Math.floor((p.z + 2) * 1000))
      }
    }

    function animate() {
      if (!isDragging.current) {
        angleY.current += speedRef.current * 0.0045
        angleX.current += speedRef.current * 0.0018
        velX.current *= 0.94
        velY.current *= 0.94
        angleX.current += velX.current * 0.007
        angleY.current += velY.current * 0.007
      }
      render()
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      lastX.current = e.clientX
      lastY.current = e.clientY
      velX.current = 0
      velY.current = 0
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastX.current
      const dy = e.clientY - lastY.current
      velX.current = dy * 0.25
      velY.current = dx * 0.25
      angleX.current += dy * 0.004
      angleY.current += dx * 0.004
      lastX.current = e.clientX
      lastY.current = e.clientY
    }

    const onMouseUp = () => {
      isDragging.current = false
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    const observer = new MutationObserver(() => {
      items.forEach((it) => applyThemeToItem(it))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 w-[420px]">
      {/* ✅ smaller sphere area so legend never gets clipped */}
      <div className="relative flex items-center justify-center w-[360px] h-[360px]">
        <div className="absolute w-36 h-36 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          ref={containerRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          style={{ userSelect: 'none' }}
        />
      </div>

      <p className="text-slate-600 dark:text-zinc-400 text-[11px] font-mono tracking-wide">
        // <span className="text-cyan-600 dark:text-cyan-400">drag</span> to rotate ·{' '}
        <span className="text-cyan-600 dark:text-cyan-400">hover</span> to explore
      </p>

      <div className="flex items-center gap-2">
        <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-mono">slow</span>
        <input
          type="range"
          min="0"
          max="10"
          defaultValue="4"
          onChange={(e) => {
            speedRef.current = parseFloat(e.target.value)
          }}
          className="w-24 h-1 accent-cyan-500 cursor-pointer"
        />
        <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-mono">fast</span>
      </div>

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 max-w-xs pt-1">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
          >
            <div
              className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/10"
              style={{ background: item.color }}
            />
            <span className="text-slate-700 dark:text-zinc-300 text-[11px] font-mono tracking-wide">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}