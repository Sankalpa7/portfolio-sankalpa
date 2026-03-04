'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n/LangContext'

type CatId = 'web' | 'data' | 'tools'

declare global {
  interface Window {
    __skillsSwitchCat__?: (id: CatId) => void
  }
}

type SkillIcon = {
  name: string
  icon: string
}

type SkillCategoryConfig = {
  id: CatId
  labelKey: CatId
  number: string
  color: string
  rgb: string
  descriptionKey: CatId
  pills: string[]
  skills: SkillIcon[]
}

// ─── FIX 4: proper types for t and locale props ───────────────────────────────
type SkillsTranslation = {
  section: string
  title: string
  subtitle: string
  cats?: Record<CatId, string>
  categoryDescriptions?: Record<CatId, string>
  awards: {
    badge: string
    title: string
    replay: string
    desc?: string
    best: string
    major: string
    featured: string
  }
  unlocked_badge?: string
  unlocked_body?: string
  unlocked_cta?: string
}

type Translation = {
  skills: SkillsTranslation
  [key: string]: unknown
}

export default function Skills() {
  const { t, locale } = useLang() as { t: Translation; locale: 'en' | 'fi' }

  const skillCategories: SkillCategoryConfig[] = useMemo(
    () => [
      {
        id: 'web',
        labelKey: 'web',
        number: '01',
        color: '#06b6d4',
        rgb: '6,182,212',
        descriptionKey: 'web',
        pills: ['React', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
        skills: [
          { name: 'React', icon: '⚛️' },
          { name: 'Next.js', icon: '▲' },
          { name: 'JavaScript', icon: '📜' },
          { name: 'HTML5', icon: '🌐' },
          { name: 'CSS3', icon: '🎨' },
          { name: 'Bootstrap', icon: '🅱️' },
        ],
      },
      {
        id: 'data',
        labelKey: 'data',
        number: '02',
        color: '#22c55e',
        rgb: '34,197,94',
        descriptionKey: 'data',
        pills: ['Python', 'Scikit-learn', 'Pandas', 'SQL', 'R', 'Tableau', 'Matplotlib', 'Google Sheets'],
        skills: [
          { name: 'Python', icon: '🐍' },
          { name: 'Scikit-learn', icon: '🤖' },
          { name: 'Pandas', icon: '🐼' },
          { name: 'SQL', icon: '🗄️' },
          { name: 'R', icon: '📈' },
          { name: 'Tableau', icon: '📉' },
          { name: 'Matplotlib', icon: '📊' },
          { name: 'Google Sheets', icon: '📋' },
        ],
      },
      {
        id: 'tools',
        labelKey: 'tools',
        number: '03',
        color: '#a855f7',
        rgb: '168,85,247',
        descriptionKey: 'tools',
        pills: ['GitHub', 'Linux', 'Jupyter', 'Azure AD', 'Active Directory', 'VMware', 'ServiceNow', 'Office365'],
        skills: [
          { name: 'GitHub', icon: '🐙' },
          { name: 'Linux', icon: '🐧' },
          { name: 'Jupyter', icon: '📓' },
          { name: 'Azure AD', icon: '☁️' },
          { name: 'Active Directory', icon: '🖥️' },
          { name: 'VMware', icon: '⚙️' },
          { name: 'ServiceNow', icon: '🎫' },
          { name: 'Office365', icon: '📧' },
        ],
      },
    ],
    []
  )

  const catLabel = (id: CatId) => {
    const fromT = t.skills.cats?.[id]
    return fromT ?? (id === 'web' ? 'Web & Frontend' : id === 'data' ? 'Data & ML' : 'Tools & IT')
  }

  const catDesc = (id: CatId) => {
    const fromT = t.skills.categoryDescriptions?.[id]
    return (
      fromT ??
      (id === 'web'
        ? 'Building fast, modern interfaces — from React components to full Next.js applications.'
        : id === 'data'
          ? 'From raw datasets to trained models, working with supervised learning and real-world data.'
          : 'Comfortable in enterprise IT environments — from Azure AD and Linux to everyday tooling.')
    )
  }

  const unlockedBadge =
    t.skills.unlocked_badge ?? (locale === 'fi' ? 'AVAA PALKINNOT' : 'UNLOCKED BY SKILLS')

  const unlockedBody =
    t.skills.unlocked_body ??
    (locale === 'fi'
      ? 'Kuin "kuukauden työntekijä" -seinä — mutta tekniikalle. Klikkaa alta nähdäksesi palkinnot, apurahat ja tQit-tarinan.'
      : 'Like the "Employee of the Month" wall — but for tech. Click below to see the awards, scholarships and the tQit story these skills have earned.')

  const unlockedCta =
    t.skills.unlocked_cta ?? (locale === 'fi' ? 'Näytä palkinnot & apurahat' : 'Show my awards & scholarships')

  const awardItems = useMemo(
    () => [
      {
        year: '2023',
        type: locale === 'fi' ? 'Apuraha' : 'Scholarship',
        title:
          locale === 'fi'
            ? 'Reidar Haglunds -rahasto — Åbo Akademi'
            : 'Reidar Haglunds Fund — Åbo Akademi University',
        body:
          locale === 'fi'
            ? 'Tiedekuntakohtainen apuraha vahvoista opintosuorituksista ja potentiaalista tietotekniikassa.'
            : 'Faculty-specific scholarship awarded for strong academic results and potential in computer engineering.',
      },
      {
        year: '2023',
        type: locale === 'fi' ? 'Palkinto' : 'Award',
        title:
          locale === 'fi'
            ? `${t.skills.awards.best} — ICT Showroom (Åbo Akademi)`
            : `${t.skills.awards.best} — ICT Showroom (Åbo Akademi University)`,
        body:
          locale === 'fi'
            ? `Finalisti 41 tiimin joukossa ja ${t.skills.awards.best} -palkinnon voittaja tQit-järjestelmällä; tunnustus teknisestä laadusta ja käytännön vaikutuksesta.`
            : `Finalist among 41 teams and winner of the ${t.skills.awards.best} award for the tQit digital queuing system, recognised for technical quality and real-world impact.`,
      },
    ],
    [locale, t]
  )

  const highlightProject = useMemo(
    () => ({
      name: 'tQit — Digital Queue Management System',
      body:
        locale === 'fi'
          ? 'tQit digitalisoi jonottamisen: asiakkaat liittyvät jonoon sovelluksella ja seuraavat paikkaansa reaaliajassa. Henkilökunta näkee jonotilanteen ja kutsuu seuraavan yhdellä painalluksella. Toimin projektipäällikkönä ja front-end -suunnittelijana — koordinoin tiimiä, vedin sprinttejä Scrum/Kanbanilla ja suunnittelin käyttökokemuksen HTML/CSS/JS:llä.'
          : 'The tQit system digitalises queues: users join through an app and track their position in real time. Staff see a live overview and call the next person with a tap. I led the project in a hybrid product owner + front-end designer role — coordinating the team, running sprints with Scrum/Kanban, and designing the UI with HTML/CSS/JavaScript.',
    }),
    [locale]
  )

  // ─── FIX 1: lazy useState initialisers — no useEffect needed ─────────────────
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('skillsAwardsSeen') === '1'
  })

  const [hasUnlockedOnce, setHasUnlockedOnce] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('skillsAwardsSeen') === '1'
  })

  const [overlayActive, setOverlayActive] = useState(false)

  // persist to sessionStorage when unlocked (this is fine — syncing to external system)
  useEffect(() => {
    if (!hasUnlockedOnce || typeof window === 'undefined') return
    window.sessionStorage.setItem('skillsAwardsSeen', '1')
  }, [hasUnlockedOnce])

  // === WHEEL EFFECT ===
  useEffect(() => {
    const CATS = skillCategories.reduce<Record<CatId, SkillCategoryConfig>>((acc, cat) => {
      acc[cat.id] = cat
      return acc
    }, {} as Record<CatId, SkillCategoryConfig>)

    const state: Record<CatId, { idx: number; busy: boolean; timer: number | null }> = {
      web: { idx: 0, busy: false, timer: null },
      data: { idx: 0, busy: false, timer: null },
      tools: { idx: 0, busy: false, timer: null },
    }

    let currentCat: CatId | null = null

    const HUB_CX = 170
    const HUB_CY = 310
    const ORBIT_R = 130
    const ANIM_DUR = 700
    const PAUSE_DUR = 2000

    const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

    const anglePos = (deg: number) => {
      const rad = (deg * Math.PI) / 180
      return { x: HUB_CX + ORBIT_R * Math.cos(rad), y: HUB_CY + ORBIT_R * Math.sin(rad) }
    }

    const initCat = (id: CatId) => {
      const cat = CATS[id]
      const hub = document.getElementById(`hub-${id}`)
      const oring = document.getElementById(`oring-${id}`)
      const aicon = document.getElementById(`aicon-${id}`)
      const ncard = document.getElementById(`name-${id}`)
      if (!hub || !oring || !aicon || !ncard) return

      hub.setAttribute(
        'style',
        [
          `background: rgba(${cat.rgb},0.10)`,
          `border-color: rgba(${cat.rgb},0.35)`,
          `color: ${cat.color}`,
          `box-shadow: 0 18px 60px rgba(2,6,23,0.06)`,
        ].join(';')
      )
      oring.style.borderColor = `rgba(${cat.rgb},0.10)`
      aicon.setAttribute(
        'style',
        [
          `background: rgba(${cat.rgb},0.12)`,
          `border-color: rgba(${cat.rgb},0.40)`,
          `box-shadow: 0 0 24px rgba(${cat.rgb},0.25), 0 0 8px rgba(${cat.rgb},0.16)`,
        ].join(';')
      )
      ncard.setAttribute(
        'style',
        [`color: ${cat.color}`, `border-color: rgba(${cat.rgb},0.30)`, `background: rgba(${cat.rgb},0.08)`].join(';')
      )
    }

    const triggerHubPulse = (id: CatId) => {
      const cat = CATS[id]
      const pulse = document.getElementById(`pulse-${id}`)
      if (!pulse) return
      pulse.setAttribute('style', `border-width: 2px; border-style: solid; border-color: ${cat.color};`)
      pulse.classList.add('animate-ping')
      setTimeout(() => pulse.classList.remove('animate-ping'), 600)
    }

    const showActive = (id: CatId, index: number) => {
      const cat = CATS[id]
      const skill = cat.skills[index]
      const aicon = document.getElementById(`aicon-${id}`)
      const ncard = document.getElementById(`name-${id}`)
      if (!aicon || !ncard) return
      aicon.textContent = skill.icon
      ncard.textContent = skill.name
      aicon.style.opacity = '1'
      aicon.style.transform = 'scale(1)'
      ncard.style.opacity = '1'
      ncard.style.transform = 'translateY(0)'
      triggerHubPulse(id)
    }

    const hideActive = (id: CatId) => {
      const aicon = document.getElementById(`aicon-${id}`)
      const ncard = document.getElementById(`name-${id}`)
      if (!aicon || !ncard) return
      aicon.style.opacity = '0'
      aicon.style.transform = 'scale(0.85)'
      ncard.style.opacity = '0'
      ncard.style.transform = 'translateY(-6px)'
    }

    const createFlyer = (
      id: CatId,
      emoji: string,
      startDeg: number,
      endDeg: number,
      entering: boolean,
      onDone?: () => void
    ) => {
      const wrap = document.getElementById(`wrap-${id}`)
      const cat = CATS[id]
      if (!wrap) return

      const el = document.createElement('div')
      el.className =
        'absolute w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border pointer-events-none z-20 bg-white/70 dark:bg-white/5 backdrop-blur'
      el.textContent = emoji
      el.style.background = `rgba(${cat.rgb},0.10)`
      el.style.borderColor = `rgba(${cat.rgb},0.22)`
      wrap.appendChild(el)

      const startPos = anglePos(startDeg)
      el.style.left = `${startPos.x - 28}px`
      el.style.top = `${startPos.y - 28}px`

      const startTime = performance.now()

      const frame = (now: number) => {
        const raw = Math.min((now - startTime) / ANIM_DUR, 1)
        const eased = easeInOutCubic(raw)
        const currentAngle = startDeg + (endDeg - startDeg) * eased
        const pos = anglePos(currentAngle)

        el.style.left = `${pos.x - 28}px`
        el.style.top = `${pos.y - 28}px`

        const relY = (pos.y - (HUB_CY - ORBIT_R)) / (2 * ORBIT_R)
        const depth = entering ? relY : 1 - relY

        const opacity = entering ? Math.max(0, 1 - depth * 1.2) : Math.max(0, depth * 1.2 - 0.2)
        const blur = entering ? depth * 6 : (1 - depth) * 6
        const scale = entering ? 0.6 + (1 - depth) * 0.4 : 0.6 + depth * 0.4

        el.style.opacity = String(opacity)
        el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none'
        el.style.transform = `scale(${scale.toFixed(3)})`

        if (raw < 1) requestAnimationFrame(frame)
        else {
          el.remove()
          onDone?.()
        }
      }

      requestAnimationFrame(frame)
    }

    const cycle = (id: CatId) => {
      const s = state[id]
      const cat = CATS[id]
      if (!s || s.busy) return

      s.busy = true
      const currIdx = s.idx
      const nextIdx = (currIdx + 1) % cat.skills.length

      const currSkill = cat.skills[currIdx]
      const nextSkill = cat.skills[nextIdx]

      hideActive(id)

      const TOP = -90
      const EXIT_END = 90
      const ENTER_START = 190

      createFlyer(id, currSkill.icon, TOP, EXIT_END, false)

      setTimeout(() => {
        createFlyer(id, nextSkill.icon, ENTER_START, 270, true, () => {
          s.idx = nextIdx
          s.busy = false
          showActive(id, nextIdx)
          s.timer = window.setTimeout(() => cycle(id), PAUSE_DUR)
        })
      }, 60)
    }

    const switchCat = (id: CatId) => {
      if (currentCat && state[currentCat]) {
        const s = state[currentCat]
        if (s.timer != null) window.clearTimeout(s.timer)
        s.busy = false
        hideActive(currentCat)
      }

      const colors: Record<CatId, string> = {
        web: '#06b6d4',
        data: '#22c55e',
        tools: '#a855f7',
      }

      ;(['web', 'data', 'tools'] as CatId[]).forEach((c) => {
        const panel = document.getElementById(`cat-${c}`)
        const tab = document.getElementById(`tab-${c}`)
        panel?.classList.add('hidden')
        if (tab) {
          tab.style.background = 'transparent'
          tab.style.color = '#64748b'
          tab.style.fontWeight = '400'
          tab.style.boxShadow = 'none'
          tab.style.transform = 'translateY(0)'
        }
      })

      const activePanel = document.getElementById(`cat-${id}`)
      const activeTab = document.getElementById(`tab-${id}`)
      activePanel?.classList.remove('hidden')
      if (activeTab) {
        activeTab.style.background = colors[id]
        activeTab.style.color = '#000'
        activeTab.style.fontWeight = '600'
        activeTab.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.12), 0 10px 25px rgba(2,6,23,0.10)'
        activeTab.style.transform = 'translateY(-1px)'
      }

      currentCat = id
      showActive(id, state[id].idx)
      state[id].timer = window.setTimeout(() => cycle(id), PAUSE_DUR)
    }

    ;(['web', 'data', 'tools'] as CatId[]).forEach(initCat)
    switchCat('web')

    window.__skillsSwitchCat__ = switchCat

    return () => {
      ;(['web', 'data', 'tools'] as CatId[]).forEach((id) => {
        const timer = state[id].timer
        if (timer != null) window.clearTimeout(timer)
      })
      window.__skillsSwitchCat__ = undefined
    }
  }, [skillCategories])

  const triggerCelebration = () => {
    if (overlayActive) return
    const audio = document.getElementById('award-sound') as HTMLAudioElement | null
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    setOverlayActive(true)
  }

  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#080808] dark:text-white"
    >
      {/* background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-0 relative z-10">
        {/* heading */}
        <div className="flex items-center gap-4 mb-2">
          <span className="text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-[0.25em]">
            {t.skills.section}
          </span>
          <div className="w-10 h-px bg-cyan-500/80" />
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {t.skills.title}
          </h2>
          <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
        </div>

        <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-zinc-400 max-w-xl mb-6">
          {t.skills.subtitle}
        </p>

        {/* tabs */}
        <div className="mb-8">
          <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-black/40 backdrop-blur px-1 py-1 gap-1">
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                id={`tab-${cat.id}`}
                className="px-4 py-1.5 text-[11px] font-mono text-slate-600 dark:text-zinc-500 rounded-md transition-all duration-200 hover:bg-slate-100/70 dark:hover:bg-white/5"
                onClick={() => window.__skillsSwitchCat__?.(cat.id)}
                type="button"
              >
                {catLabel(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* wheel + text */}
        {skillCategories.map((cat) => (
          <div
            key={cat.id}
            id={`cat-${cat.id}`}
            className={`flex flex-col md:flex-row items-center md:items-center md:justify-between gap-8 lg:gap-16 xl:gap-24 ${
              cat.id === 'web' ? '' : 'hidden'
            }`}
          >
            {/* wheel */}
            <div
              id={`wrap-${cat.id}`}
              className="relative w-[340px] h-[420px] flex-shrink-0 mx-auto md:mx-0 md:mr-auto -mt-2 md:-mt-4"
            >
              <div
                id={`oring-${cat.id}`}
                className="absolute left-1/2 bottom-5 -translate-x-1/2 w-[320px] h-[320px] rounded-full border border-dashed border-black/10 dark:border-white/5 pointer-events-none"
              />
              <div
                id={`pulse-${cat.id}`}
                className="absolute left-1/2 bottom-5 -translate-x-1/2 w-[180px] h-[180px] rounded-full pointer-events-none z-0"
              />
              <div
                id={`hub-${cat.id}`}
                className="absolute left-1/2 bottom-5 -translate-x-1/2 w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center border z-10 gap-1 bg-white/70 dark:bg-white/5 backdrop-blur-xl transition-shadow"
              >
                <div className="text-3xl">{cat.id === 'web' ? '💻' : cat.id === 'data' ? '📊' : '🛠️'}</div>
                <div
                  className="text-[10px] font-semibold tracking-[0.18em] text-center leading-snug"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {cat.id === 'web' ? (
                    <>WEB<br />STACK</>
                  ) : cat.id === 'data' ? (
                    <>DATA<br />&amp; ML</>
                  ) : (
                    <>IT<br />STACK</>
                  )}
                </div>
              </div>

              <div
                id={`spot-${cat.id}`}
                className="absolute left-1/2 bottom-[220px] -translate-x-1/2 w-20 flex flex-col items-center gap-2 pointer-events-none z-20"
              >
                <div
                  id={`name-${cat.id}`}
                  className="px-3.5 py-1 rounded-md border text-[11px] font-mono bg-white/80 dark:bg-white/5 opacity-0 -translate-y-1 transition-all duration-300"
                />
                <div
                  id={`aicon-${cat.id}`}
                  className="w-16 h-16 rounded-2xl border flex items-center justify-center text-2xl opacity-0 scale-90 transition-all duration-300"
                />
              </div>
            </div>

            {/* right text */}
            <div className="flex-1 mt-8 md:mt-0 md:pl-10 lg:pl-16 xl:pl-24 md:flex md:flex-col md:justify-center">
              <div
                className="text-6xl md:text-7xl font-black mb-2 text-transparent"
                style={{
                  fontFamily: 'var(--font-syne)',
                  WebkitTextStrokeWidth: '1.7px',
                  WebkitTextStrokeColor: cat.color,
                  filter: 'drop-shadow(0 0 20px rgba(2,6,23,0.10))',
                }}
              >
                {cat.number}
              </div>

              <h3
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: cat.color, fontFamily: 'var(--font-syne)' }}
              >
                {catLabel(cat.labelKey)}
              </h3>

              <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-zinc-400 mb-6 max-w-md">
                {catDesc(cat.descriptionKey)}
              </p>

              <div className="flex flex-wrap gap-2">
                {cat.pills.map((pill) => (
                  <span
                    key={pill}
                    className="text-[11px] px-3 py-1.5 rounded-full border font-mono"
                    style={{ borderColor: cat.color + '33', color: cat.color, background: cat.color + '10' }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="mt-16 md:mt-20" />

        {!achievementsUnlocked && (
          <motion.div
            className="mb-10 flex flex-col items-center text-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p className="text-[11px] md:text-xs font-mono text-cyan-600 dark:text-cyan-400 tracking-[0.24em] uppercase">
              {unlockedBadge}
            </p>
            <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-zinc-400 max-w-md">
              {unlockedBody}
            </p>
            <motion.button
              onClick={triggerCelebration}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 text-black text-xs md:text-sm font-mono font-semibold shadow-lg shadow-cyan-500/25"
              type="button"
            >
              {unlockedCta}
              <span className="ml-2">⭐</span>
            </motion.button>
          </motion.div>
        )}

        {achievementsUnlocked && (
          <AchievementsBlock
            t={t.skills}
            locale={locale}
            awardItems={awardItems}
            highlightProject={highlightProject}
            onReplay={triggerCelebration}
          />
        )}
      </div>

      <AnimatePresence>
        {overlayActive && (
          <AwardsOverlay
            t={t.skills}
            locale={locale}
            onComplete={() => {
              setOverlayActive(false)
              setAchievementsUnlocked(true)
              setHasUnlockedOnce(true)
            }}
          />
        )}
      </AnimatePresence>

      <audio id="award-sound" src="/award.mp3" preload="auto" />

      {/* ── a11y: screen-reader live region ── */}
      <div role="status" aria-live="polite" className="sr-only">
        {achievementsUnlocked ? 'Achievements unlocked' : ''}
      </div>
    </section>
  )
}

/* ====== AwardsOverlay ====== */

function AwardsOverlay({
  onComplete,
  t,
  locale,
}: {
  onComplete: () => void
  t: SkillsTranslation
  locale: 'en' | 'fi'
}) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 3600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <div className="absolute w-72 h-72 rounded-full bg-amber-400/20 blur-3xl" />

      <motion.div
        className="relative z-10 rounded-3xl border border-amber-300/50 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-900/10 px-8 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.65)] max-w-md text-center"
        initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="mx-auto mb-3 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-emerald-300 flex items-center justify-center shadow-[0_0_40px_rgba(253,224,71,0.7)]"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
        >
          <span className="text-2xl">⭐</span>
        </motion.div>

        <motion.p
          className="text-[11px] font-mono tracking-[0.24em] text-amber-700/80 dark:text-amber-200 uppercase mb-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          {locale === 'fi' ? 'kohokohta avattu' : 'highlight unlocked'}
        </motion.p>

        <motion.h3
          className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1"
          style={{ fontFamily: 'var(--font-syne)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
        >
          {t.awards.best} — tQit
        </motion.h3>

        <motion.p
          className="text-xs font-mono text-amber-900/80 dark:text-amber-100/90 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          {locale === 'fi'
            ? 'ICT Showroom, Åbo Akademi · Finalisti 41 tiimin joukossa ja Best IT Solution -voittaja.'
            : 'ICT Showroom, Åbo Akademi University · Finalist among 41 teams and winner of the Best IT Solution award.'}
        </motion.p>

        <motion.p
          className="mt-3 text-[11px] font-mono text-amber-800/80 dark:text-amber-200"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          {locale === 'fi'
            ? 'Scrollaa alas nähdäksesi koko tarinan ja muut palkinnot.'
            : 'Scroll down to see the full story and other awards.'}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

/* ====== AchievementsBlock ====== */

function AchievementsBlock({
  onReplay,
  t,
  locale,
  awardItems,
  highlightProject,
}: {
  onReplay: () => void
  t: SkillsTranslation
  locale: 'en' | 'fi'
  awardItems: { year: string; type: string; title: string; body: string }[]
  highlightProject: { name: string; body: string }
}) {
  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative mb-8">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="origin-left h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 shadow-[0_0_25px_rgba(34,211,238,0.7)]"
        />
      </div>

      <div className="flex items-center gap-4 mb-2">
        <span className="text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-[0.25em]">
          {t.awards.badge}
        </span>
        <div className="w-10 h-px bg-cyan-500/80" />
        <h3
          className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          {t.awards.title}
        </h3>
        <button
          type="button"
          onClick={onReplay}
          className="ml-auto text-[11px] font-mono text-cyan-600/80 dark:text-cyan-400/80 hover:text-cyan-700 dark:hover:text-cyan-300 underline-offset-4 hover:underline"
        >
          {t.awards.replay}
        </button>
      </div>

      <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-zinc-400 max-w-xl mb-8">
        {t.awards.desc ??
          (locale === 'fi'
            ? 'Apurahat ja tunnustukset, jotka ovat muokanneet matkaani — tiedekuntapalkinnoista palkittuun tQit-järjestelmään.'
            : 'Scholarships and recognitions that shaped my journey — from faculty-level awards to building an award-winning digital queuing system.')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_minmax(0,1.2fr)] gap-8 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: -50, rotate: -2, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
              className="rounded-2xl border border-slate-200 bg-white/80 dark:border-zinc-800 dark:bg-white/5 px-5 py-4 shadow-sm"
            >
              <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">2</p>
              <p className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-[0.18em]">
                {t.awards.major}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -50, rotate: -2, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.27 }}
              className="rounded-2xl border border-slate-200 bg-white/80 dark:border-zinc-800 dark:bg-white/5 px-5 py-4 shadow-sm"
            >
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">1st</p>
              <p className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-[0.18em]">
                {t.awards.best}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -50, rotate: -2, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
            className="rounded-2xl border border-slate-200 bg-white/90 dark:border-zinc-800 dark:bg-white/5 px-6 py-5 shadow-sm"
          >
            <p className="text-[11px] font-mono tracking-[0.2em] text-cyan-600 dark:text-cyan-400 uppercase mb-2">
              {t.awards.featured}
            </p>
            <h4
              className="text-sm md:text-base font-semibold text-slate-900 dark:text-white mb-2"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              {highlightProject.name}
            </h4>
            <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-zinc-400 leading-relaxed">
              {highlightProject.body}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="absolute left-[10px] top-0 bottom-0">
            <div className="w-px h-full bg-gradient-to-b from-cyan-500/0 via-cyan-500/40 to-emerald-500/0" />
          </div>

          <div className="space-y-5">
            {awardItems.map((award, idx) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: -60, rotate: -3, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.55 + idx * 0.2 }}
                className="relative pl-10"
              >
                <div className="absolute left-[2px] top-3 w-2 h-2 rounded-full bg-cyan-500 shadow-[0 0 0 4px rgba(34,211,238,0.18)]" />
                <div className="rounded-2xl border border-slate-200 bg-white/90 dark:border-zinc-800 dark:bg-white/5 px-5 py-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">{award.year}</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full border border-cyan-500/40 text-cyan-700 dark:text-cyan-400 bg-cyan-500/8 dark:bg-cyan-500/10">
                      {award.type}
                    </span>
                  </div>
                  <h4
                    className="text-sm md:text-[15px] font-semibold text-slate-900 dark:text-white mb-1"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {award.title}
                  </h4>
                  <p className="text-xs md:text-sm font-mono text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {award.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}