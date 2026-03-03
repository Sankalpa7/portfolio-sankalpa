'use client'

import { useState } from 'react'
import { TrendingUp, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/i18n/LangContext'

type Exp = {
  id: number
  year: string
  role: string
  company: string
  sub: string | null
  location: string
  period: string
  type: 'Research' | 'Promoted' | 'Engineering'
  color: string
  summary: string
  bullets: string[]
  tags: string[]
  promoted: boolean
  promoFrom?: string
  promoTo?: string
}

type Edu = {
  id: number
  level: string
  degree: string
  school: string
  location: string
  period: string
  color: string
  focus: string
  wm: string
  current: boolean
}

const typeColors: Record<string, string> = {
  Research: 'text-cyan-500   border-cyan-500/30   bg-cyan-500/5',
  Promoted: 'text-amber-500  border-amber-500/30  bg-amber-500/5',
  Engineering: 'text-purple-500 border-purple-500/30 bg-purple-500/5',
}

export default function Experience() {
  const { t, locale } = useLang()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const toggle = (id: number) => setExpandedId((prev) => (prev === id ? null : id))

  const experiences: Exp[] =
    locale === 'fi'
      ? [
          {
            id: 1,
            year: '2022',
            role: 'Tutkimusavustaja',
            company: 'Åbo Akademi University',
            sub: '× Veri DevOps',
            location: 'Turku, Suomi',
            period: 'Joulu 2022 — Helmi 2023',
            type: 'Research',
            color: '#06b6d4',
            summary:
              'Rakensin Python-pohjaisen CLI-työkalun verkko­hyökkäysten varhaiseen havaitsemiseen reaaliaikaisen liikennekuvioanalyysin avulla.',
            bullets: [
              'Suunnittelin Python-CLI:n reaaliaikaiseen verkko­liikenteen kuvioanalyysiin ja hyökkäysten varhaiseen havaitsemiseen.',
              'Testasin olemassa olevia tietoturvatyökaluja ja dokumentoin tarvittavat muutokset havaitsemistarkkuuden parantamiseksi.',
              'Tuotin selkeän tutkimusdokumentaation yhteistyössä ohjaajien ja tutkimusryhmän kanssa.',
            ],
            tags: ['Python', 'Verkkoturva', 'CLI', 'Tutkimus'],
            promoted: false,
          },
          {
            id: 2,
            year: '2022',
            role: 'Tuotantoasiantuntija → Tiimivalmentaja',
            company: 'Swappie Oy',
            sub: null,
            location: 'Helsinki, Suomi',
            period: 'Tammi 2022 — Elo 2022',
            type: 'Promoted',
            color: '#22c55e',
            summary:
              'Etenin tuotannosta tiimin vetäjäksi — tekemisestä ihmisten valmentamiseen ja prosessien kehittämiseen.',
            bullets: [
              'Tuotantoasiantuntija: Vastasin laitteiden testauksesta, kunnostuksesta ja laadunvarmistuksesta.',
              'Ylennys tiimivalmentajaksi: Johdin tuotantotiimiä, kehitettiin prosesseja ja valmensin tiimiläisiä.',
              'Yhteistyö eri tiimien kanssa tuotantotavoitteiden saavuttamiseksi ja laadun varmistamiseksi.',
            ],
            tags: ['Tuotanto', 'Tiiminjohtaminen', 'QA', 'Prosessikehitys', 'Valmennus'],
            promoted: true,
            promoFrom: 'Tuotantoasiantuntija',
            promoTo: 'Tiimivalmentaja',
          },
          {
            id: 3,
            year: '2021',
            role: 'Testi-insinööri',
            company: 'Marquishtech',
            sub: null,
            location: 'Etätyö',
            period: 'Syys 2021 — Tammi 2023',
            type: 'Engineering',
            color: '#a855f7',
            summary:
              'Mobiiliverkkojen testaus LTE-, 5G- ja Wi-Fi-ympäristöissä laitteen suorituskyvyn varmistamiseksi.',
            bullets: [
              'Suoritin manuaalisia mobiiliverkkotestejä LTE-, 5G- ja Wi-Fi-verkoissa.',
              'Osallistuin testitapausten kehittämiseen, tulosten analysointiin ja parannusehdotuksiin.',
              'Tuotin käyttäjälähtöistä laadunvarmistusta jatkuvan oppimisen ja tarkan testauksen avulla.',
            ],
            tags: ['Mobiilitestaus', 'LTE / 5G', 'Wi-Fi', 'QA'],
            promoted: false,
          },
          {
            id: 4,
            year: '2020',
            role: 'Tiimiläinen → Vuoropäällikkö',
            company: 'Taco Bell Finland',
            sub: null,
            location: 'Suomi',
            period: 'Elo 2020 — Nykyhetki · 5+ v',
            type: 'Promoted',
            color: '#f59e0b',
            summary:
              '5+ vuotta kasvua — ylennys tiimiläisestä vuoropäälliköksi, vahva ote operaatioihin ja ihmisten johtamiseen.',
            bullets: [
              'Tiimiläinen: Palvelin asiakkaita ja valmistin suurivolyymisia tilauksia laatuvaatimusten mukaisesti.',
              'Ylennys vuoropäälliköksi: Johdan tiimiä — vastaan operaatioista, inventaariosta, työvuoroista ja kassasta.',
              'Kehitän tiimin suorituskykyä valmennuksella, palautteella ja jatkuvan parantamisen kulttuurilla.',
            ],
            tags: ['Tiiminjohtaminen', 'Operaatiot', 'Inventaario', 'Työvuorosuunnittelu', 'Valmennus'],
            promoted: true,
            promoFrom: 'Tiimiläinen',
            promoTo: 'Vuoropäällikkö',
          },
        ]
      : [
          {
            id: 1,
            year: '2022',
            role: 'Research Assistant',
            company: 'Åbo Akademi University',
            sub: '× Veri Devops',
            location: 'Turku, Finland',
            period: 'Dec 2022 — Feb 2023',
            type: 'Research',
            color: '#06b6d4',
            summary:
              'Built a Python CLI tool for real-time network attack detection using traffic pattern analysis.',
            bullets: [
              'Designed a Python-based CLI for early detection of network attacks using real-time traffic pattern analysis.',
              'Tested existing security tools and documented required changes to improve detection accuracy.',
              'Created detailed research documentation collaborating with supervisors and advisors.',
            ],
            tags: ['Python', 'Network Security', 'CLI', 'Research'],
            promoted: false,
          },
          {
            id: 2,
            year: '2022',
            role: 'Production Specialist → Team Coach',
            company: 'Swappie Oy',
            sub: null,
            location: 'Helsinki, Finland',
            period: 'Jan 2022 — Aug 2022',
            type: 'Promoted',
            color: '#22c55e',
            summary:
              'Grew from the production floor to leading the team — from doing the work to coaching the people doing it.',
            bullets: [
              'Production Specialist: Oversaw mobile device testing, refurbishment and resale to strict quality standards.',
              'Promoted to Team Coach: Led the production team, streamlined processes and coached members for peak performance.',
              'Aligned production goals with cross-functional teams to consistently exceed output targets.',
            ],
            tags: ['Production', 'Team Leadership', 'QA', 'Process Optimization', 'Coaching'],
            promoted: true,
            promoFrom: 'Production Specialist',
            promoTo: 'Team Coach',
          },
          {
            id: 3,
            year: '2021',
            role: 'Test Engineer',
            company: 'Marquishtech',
            sub: null,
            location: 'Remote',
            period: 'Sep 2021 — Jan 2023',
            type: 'Engineering',
            color: '#a855f7',
            summary: 'Mobile network testing across LTE, 5G and Wi-Fi to ensure optimal device performance.',
            bullets: [
              'Conducted mobile manual network tests across LTE, 5G, and Wi-Fi for optimal device performance.',
              'Collaborated on test case development, result analysis, and product improvement recommendations.',
              'Delivered customer-centric quality assurance through continuous learning and precise testing.',
            ],
            tags: ['Mobile Testing', 'LTE / 5G', 'Wi-Fi', 'QA'],
            promoted: false,
          },
          {
            id: 4,
            year: '2020',
            role: 'Team Member → Shift Lead',
            company: 'Taco Bell Finland',
            sub: null,
            location: 'Finland',
            period: 'Aug 2020 — Present · 5+ yrs',
            type: 'Promoted',
            color: '#f59e0b',
            summary:
              '5+ years of growth — promoted from Team Member to Shift Lead, mastering operations and people leadership.',
            bullets: [
              'Team Member: Delivered fast, friendly service preparing high-volume orders to Taco Bell quality standards.',
              'Promoted to Shift Lead: Now leading the full team — managing operations, inventory, scheduling and cash handling.',
              'Drive team performance through ongoing coaching, feedback and a culture of continuous improvement.',
            ],
            tags: ['Team Leadership', 'Operations', 'Inventory', 'Scheduling', 'Coaching'],
            promoted: true,
            promoFrom: 'Team Member',
            promoTo: 'Shift Lead',
          },
        ]

  const education: Edu[] =
    locale === 'fi'
      ? [
          {
            id: 1,
            level: 'Kandidaatti',
            degree: 'Ins. (AMK) · Tietotekniikka',
            school: 'Centria University of Applied Sciences',
            location: 'Suomi',
            period: '2017 — 2020',
            color: '#38bdf8',
            focus: 'Ohjelmistokehitys ja web-teknologiat',
            wm: 'B.ENG',
            current: false,
          },
          {
            id: 2,
            level: 'Maisteri',
            degree: 'DI / M.Sc. · Tietokone­tekniikka',
            school: 'Åbo Akademi University',
            location: 'Turku, Suomi',
            period: '2022 — Nykyhetki',
            color: '#06b6d4',
            focus: 'AI, data science ja verkkoturva',
            wm: 'M.SC',
            current: true,
          },
        ]
      : [
          {
            id: 1,
            level: 'Bachelor',
            degree: 'B.Eng. Information Technology',
            school: 'Centria University of Applied Sciences',
            location: 'Finland',
            period: '2017 — 2020',
            color: '#38bdf8',
            focus: 'Software engineering & web development',
            wm: 'B.ENG',
            current: false,
          },
          {
            id: 2,
            level: 'Master',
            degree: 'M.Sc. Computer Engineering',
            school: 'Åbo Akademi University',
            location: 'Turku, Finland',
            period: '2022 — Present',
            color: '#06b6d4',
            focus: 'AI, data science & network security',
            wm: 'M.SC',
            current: true,
          },
        ]

  return (
    <section id="experience" className="py-32 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-16 xl:px-24 relative z-10">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-cyan-500 text-sm font-mono tracking-widest">{t.experience.section}</span>
          <div className="w-12 h-px bg-cyan-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            {t.experience.title}
          </h2>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
        </div>

        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-px hidden md:block"
            style={{
              left: '70px',
              background:
                'linear-gradient(to bottom, transparent, rgba(6,182,212,0.1), rgba(6,182,212,0.3), rgba(6,182,212,0.1), transparent)',
            }}
          />

          <div className="flex flex-col gap-0">
            {experiences.map((exp) => {
              const isOpen = expandedId === exp.id
              return (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-0 md:gap-8 py-6">
                  <div className="hidden md:flex flex-col items-center gap-2 pt-1">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-mono font-semibold border z-10 transition-all duration-300"
                      style={{
                        background: isOpen ? exp.color + '20' : 'rgba(255,255,255,0.03)',
                        borderColor: isOpen ? exp.color : 'rgba(255,255,255,0.07)',
                        color: isOpen ? exp.color : '#71717a',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {exp.year}
                    </div>
                  </div>

                  <div
                    onClick={() => toggle(exp.id)}
                    className="rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 relative"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isOpen ? exp.color + '40' : 'rgba(255,255,255,0.07)'}`,
                      backdropFilter: 'blur(10px)',
                      transform: isOpen ? 'translateX(6px)' : 'translateX(0)',
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
                      style={{ background: exp.color, opacity: isOpen ? 0.06 : 0 }}
                    />

                    <div className="p-6 md:p-7 relative">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap mb-1.5">
                            <h3
                              className="text-lg font-bold transition-colors duration-200"
                              style={{ fontFamily: 'var(--font-syne)', color: isOpen ? exp.color : '#fff' }}
                            >
                              {exp.role}
                            </h3>

                            {exp.promoted && (
                              <span
                                className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border"
                                style={{ color: exp.color, borderColor: exp.color + '40', background: exp.color + '08' }}
                              >
                                <TrendingUp className="w-3 h-3" />
                                {locale === 'fi' ? 'Ylennys' : 'Promoted'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-mono font-semibold" style={{ color: exp.color }}>
                              {exp.company}
                            </span>
                            {exp.sub && <span className="text-xs font-mono text-zinc-600">{exp.sub}</span>}
                            <span className="text-xs font-mono text-zinc-600">{exp.location}</span>
                            <span className="text-xs font-mono text-zinc-700">{exp.period}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border hidden sm:inline-flex ${typeColors[exp.type]}`}>
                            {exp.type}
                          </span>
                          <ChevronDown
                            className="w-4 h-4 text-zinc-500 transition-transform duration-300"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </div>
                      </div>

                      <p className="text-sm font-mono text-zinc-500 leading-6 mb-2">{exp.summary}</p>

                      {isOpen && (
                        <div className="border-t pt-5 mt-3" style={{ borderColor: exp.color + '20' }}>
                          {exp.promoted && exp.promoFrom && exp.promoTo && (
                            <div
                              className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
                              style={{ background: exp.color + '08', border: `1px solid ${exp.color}20` }}
                            >
                              <TrendingUp className="w-4 h-4 shrink-0" style={{ color: exp.color }} />
                              <span className="text-xs font-mono" style={{ color: exp.color }}>
                                {locale === 'fi' ? 'Urapolku:' : 'Career path:'} &nbsp;
                                <span className="text-zinc-500">{exp.promoFrom}</span>
                                <span className="mx-2">→</span>
                                <span className="font-semibold">{exp.promoTo}</span>
                              </span>
                            </div>
                          )}

                          <div className="space-y-3 mb-5 pl-4 border-l-2" style={{ borderColor: exp.color + '30' }}>
                            {exp.bullets.map((b, i) => (
                              <p key={i} className="text-xs font-mono text-zinc-500 leading-6">
                                {b}
                              </p>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {exp.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs font-mono px-2.5 py-1 rounded-full border"
                                style={{ borderColor: exp.color + '30', color: exp.color, background: exp.color + '08' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mt-24">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-cyan-500 text-sm font-mono tracking-widest">{locale === 'fi' ? '// koulutus' : '// edu'}</span>
            <div className="w-8 h-px bg-cyan-500/50" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-syne)' }}>
              {locale === 'fi' ? 'Koulutus' : 'Education'}
            </h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="relative rounded-2xl border overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ border: `1px solid ${edu.color}40` }}
                />
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: edu.color }}
                />
                <span
                  className="absolute -bottom-3 -right-2 text-8xl font-black select-none pointer-events-none"
                  style={{ fontFamily: 'var(--font-syne)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)', lineHeight: '1' }}
                >
                  {edu.wm}
                </span>

                <div className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <span
                      className="text-xs font-mono px-3 py-1 rounded-full border"
                      style={{ color: edu.color, borderColor: edu.color + '40', background: edu.color + '08' }}
                    >
                      {edu.level}
                    </span>
                    <span className="text-xs font-mono text-zinc-600">{edu.period}</span>
                    {edu.current && (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        {locale === 'fi' ? 'Kesken' : 'In progress'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xl font-black mb-2 text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                    {edu.degree}
                  </h4>
                  <p className="text-sm font-mono font-semibold mb-2" style={{ color: edu.color }}>
                    {edu.school}
                  </p>
                  <p className="text-xs font-mono text-zinc-600 italic mb-4">{edu.focus}</p>
                  <p className="text-xs font-mono text-zinc-700">📍 {edu.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-800">
              {locale === 'fi' ? '// perusta → erikoistuminen' : '// foundation → specialization'}
            </span>
            <span className="text-xs font-mono text-zinc-800">2017 — present</span>
          </div>
        </div>
      </div>
    </section>
  )
}