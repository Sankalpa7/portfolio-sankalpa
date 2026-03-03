'use client'

import { useEffect, useRef } from 'react'

const techs = [
  { name: 'React',       icon: '⚛️'  },
  { name: 'Next.js',     icon: '▲'   },
  { name: 'TypeScript',  icon: 'TS'  },
  { name: 'JavaScript',  icon: 'JS'  },
  { name: 'HTML5',       icon: '🌐'  },
  { name: 'CSS3',        icon: '🎨'  },
  { name: 'Node.js',     icon: '🟢'  },
  { name: 'Express',     icon: '🚂'  },
  { name: 'Django',      icon: '🎸'  },
  { name: 'Python',      icon: '🐍'  },
  { name: 'Java',        icon: '☕'  },
  { name: 'MongoDB',     icon: '🍃'  },
  { name: 'Firebase',    icon: '🔥'  },
  { name: 'MySQL',       icon: '🐬'  },
  { name: 'OpenAI',      icon: '🤖'  },
  { name: 'Claude AI',   icon: '🧠'  },
  { name: 'LangChain',   icon: '🔗'  },
  { name: 'HuggingFace', icon: '🤗'  },
  { name: 'TensorFlow',  icon: '🧩'  },
  { name: 'AWS',         icon: '☁️'  },
  { name: 'Docker',      icon: '🐳'  },
  { name: 'Vercel',      icon: '▲'   },
  { name: 'Git',         icon: '🔀'  },
  { name: 'REST APIs',   icon: '🔌'  },
  { name: 'GitHub CI',   icon: '⚡'  },
  { name: 'C / C++',     icon: '⚙️'  },
]

const legend = [
  { label: 'Frontend', color: '#61dafb' },
  { label: 'Backend',  color: '#68a063' },
  { label: 'AI / ML',  color: '#a855f7' },
  { label: 'DevOps',   color: '#fb923c' },
  { label: 'Database', color: '#22c55e' },
  { label: 'Language', color: '#eab308' },
]

function fibonacciSphere(n: number) {
  const pts = []
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

    const R = 155
    const positions = fibonacciSphere(techs.length)
    const items: { el: HTMLDivElement; ox: number; oy: number; oz: number }[] = []

    container.innerHTML = ''

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
        transition: filter 0.2s;
        user-select: none;
      `

      const iconEl = document.createElement('div')
      iconEl.style.cssText = `
        width: 36px; height: 36px;
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        font-size: 1.1rem;
        transition: all 0.2s;
      `
      iconEl.textContent = tech.icon

      const label = document.createElement('div')
      label.style.cssText = `
        font-size: 0.5rem;
        color: rgba(255,255,255,0.4);
        font-family: 'JetBrains Mono', monospace;
        white-space: nowrap;
        transition: color 0.2s;
      `
      label.textContent = tech.name

      el.appendChild(iconEl)
      el.appendChild(label)

      el.addEventListener('mouseenter', () => {
        el.style.filter = 'drop-shadow(0 0 8px #06b6d4)'
        iconEl.style.background = 'rgba(6,182,212,0.15)'
        iconEl.style.borderColor = 'rgba(6,182,212,0.5)'
        label.style.color = '#06b6d4'
      })
      el.addEventListener('mouseleave', () => {
        el.style.filter = 'none'
        iconEl.style.background = 'rgba(255,255,255,0.04)'
        iconEl.style.borderColor = 'rgba(255,255,255,0.08)'
        label.style.color = 'rgba(255,255,255,0.4)'
      })

      container.appendChild(el)
      items.push({ el, ox: positions[i].x, oy: positions[i].y, oz: positions[i].z })
    })

    function rotateX(p: {x:number;y:number;z:number}, a: number) {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
    }
    function rotateY(p: {x:number;y:number;z:number}, a: number) {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
    }

    function render() {
      items.forEach(item => {
        let p = { x: item.ox, y: item.oy, z: item.oz }
        p = rotateX(p, angleX.current)
        p = rotateY(p, angleY.current)
        const scale = (p.z + 1.6) / 2.6
        const x = p.x * R
        const y = p.y * R
        item.el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${0.6 + scale * 0.6})`
        item.el.style.opacity = String(0.2 + scale * 0.8)
        item.el.style.zIndex = String(Math.round(scale * 100))
      })
    }

    function animate() {
      if (!isDragging.current) {
        angleY.current += speedRef.current * 0.005
        angleX.current += speedRef.current * 0.002
        velX.current *= 0.95
        velY.current *= 0.95
        angleX.current += velX.current * 0.008
        angleY.current += velY.current * 0.008
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
    const onMouseUp = () => { isDragging.current = false }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="relative flex items-center justify-center w-[400px] h-[400px]">
        <div className="absolute w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          ref={containerRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          style={{ userSelect: 'none' }}
        />
      </div>

      <p className="text-zinc-600 dark:text-zinc-700 text-xs font-mono tracking-wide">
        // <span className="text-cyan-500">drag</span> to rotate · <span className="text-cyan-500">hover</span> to explore
      </p>

      <div className="flex items-center gap-1">
        <span className="text-zinc-600 text-xs font-mono">slow</span>
        <input
          type="range"
          min="0"
          max="10"
          defaultValue="4"
          onChange={(e) => { speedRef.current = parseFloat(e.target.value) }}
          className="w-24 h-1 accent-cyan-500 cursor-pointer"
        />
        <span className="text-zinc-600 text-xs font-mono">fast</span>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 max-w-xs">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span className="text-zinc-500 text-xs font-mono">{item.label}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
