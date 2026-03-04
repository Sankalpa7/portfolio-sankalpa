'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLang } from '@/lib/i18n/LangContext'

type Locale = 'en' | 'fi'

type CertBase = {
  id: string
  title: string
  provider: string
  year: string
  accent: string
  iconLabel: string
  previewType: 'image' | 'pdf'
  previewSrc: string
  modalSrc: string
  description: { en: string; fi: string }
  skills: { en: string[]; fi: string[] }
}

type CertSlide = {
  id: string
  title: string
  provider: string
  year: string
  accent: string
  iconLabel: string
  description: string
  skills: string[]
  previewType: 'image' | 'pdf'
  previewSrc: string
  modalSrc: string
}

const CERTS: CertBase[] = [
  {
    id: 'gda',
    title: 'Google Data Analytics',
    provider: 'Coursera · Google',
    year: '2023',
    accent: '#22c55e',
    iconLabel: 'DA',
    previewType: 'image',
    previewSrc: '/images/Google data analytics.jpg.jpeg',
    modalSrc: '/images/Google data analytics.jpg.jpeg',
    description: {
      en: 'End-to-end analytics: collecting, cleaning and transforming data, then building dashboards for insight.',
      fi: 'Koko analytiikkaputki: datan keruu, puhdistus ja muokkaus sekä dashboardien rakentaminen oivalluksia varten.',
    },
    skills: {
      en: ['SQL', 'Tableau', 'R', 'Data Cleaning'],
      fi: ['SQL', 'Tableau', 'R', 'Datan puhdistus'],
    },
  },
  {
    id: 'git-python',
    title: 'Google IT Automation with Python',
    provider: 'Coursera · Google',
    year: '2024',
    accent: '#0ea5e9',
    iconLabel: 'GP',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/Google IT Automation With Python.pdf',
    description: {
      en: 'Python, Git and IT automation for modern IT support and systems administration roles.',
      fi: 'Python, Git ja IT-automaatiotyökalut nykyaikaisiin IT-tuki- ja järjestelmänhallintatehtäviin.',
    },
    skills: {
      en: ['Python', 'Git & GitHub', 'Automation', 'Cloud Config'],
      fi: ['Python', 'Git & GitHub', 'Automaatiot', 'Pilvikonfigurointi'],
    },
  },
  {
    id: 'gpm',
    title: 'Google Project Management',
    provider: 'Coursera · Google',
    year: '2023',
    accent: '#f59e0b',
    iconLabel: 'PM',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/Google Project Management Certificate.pdf',
    description: {
      en: 'Initiating, planning and running projects from kickoff to delivery using both Agile and waterfall.',
      fi: 'Projektien käynnistys, suunnittelu ja toteutus aloituksesta toimitukseen — Agile ja vesiputous.',
    },
    skills: {
      en: ['Agile', 'Project Planning', 'Risk Management'],
      fi: ['Agile', 'Projektisuunnittelu', 'Riskienhallinta'],
    },
  },
  {
    id: 'cloud-cyber',
    title: 'Elements of Cloud & Cybersecurity',
    provider: 'Microsoft Skills for Jobs · Kajaanin AMK',
    year: '2024',
    accent: '#06b6d4',
    iconLabel: 'CC',
    previewType: 'image',
    previewSrc: '/images/Cloud and cybersecurity certificate.PNG',
    modalSrc: '/images/Cloud and cybersecurity certificate.PNG',
    description: {
      en: 'Fundamentals of cloud platforms, identity, and cybersecurity concepts for securing modern infrastructure.',
      fi: 'Pilvialustojen, identiteetin ja kyberturvan perusteet modernin infrastruktuurin suojaamiseksi.',
    },
    skills: {
      en: ['Cloud Basics', 'Cybersecurity', 'Identity & Access'],
      fi: ['Pilven perusteet', 'Kyberturvallisuus', 'Identiteetti & pääsynhallinta'],
    },
  },
  {
    id: 'azure-badge',
    title: 'Azure Fundamentals',
    provider: 'Microsoft Skills for Jobs',
    year: '2024',
    accent: '#3b82f6',
    iconLabel: 'AZ',
    previewType: 'image',
    previewSrc: '/images/Microsoft Azure Fundamental badge.png',
    modalSrc: '/images/Microsoft Azure Fundamental badge.png',
    description: {
      en: 'Core Azure services, pricing, governance and security – a solid base for cloud and DevOps roles.',
      fi: 'Azuressa keskeiset palvelut, hinnoittelu, hallintamallit ja tietoturva — vahva perusta pilvi- ja DevOps-rooleihin.',
    },
    skills: {
      en: ['Azure Services', 'Cloud Concepts', 'Security'],
      fi: ['Azure-palvelut', 'Pilvikonseptit', 'Tietoturva'],
    },
  },
  {
    id: 'ibm-it',
    title: 'IT Technical Support Programme',
    provider: 'IBM SkillsBuild · SkillUp Online',
    year: '2023',
    accent: '#8b5cf6',
    iconLabel: 'IT',
    previewType: 'image',
    previewSrc: '/images/ibm-it-support-certificate.jpg',
    modalSrc: '/images/ibm-it-support-certificate.jpg',
    description: {
      en: 'Hands-on IT support: troubleshooting, ticketing, escalation and clear communication with users.',
      fi: 'Käytännön IT-tuki: vianhaku, tikettityö, eskalointi ja selkeä viestintä käyttäjien kanssa.',
    },
    skills: {
      en: ['IT Support', 'Troubleshooting', 'Customer Focus'],
      fi: ['IT-tuki', 'Vianmääritys', 'Asiakaspalvelu'],
    },
  },
  {
    id: 'udemy-it',
    title: 'IT Support Technical Skills Bootcamp',
    provider: 'Udemy',
    year: '2023',
    accent: '#a855f7',
    iconLabel: 'TS',
    previewType: 'image',
    previewSrc: '/images/it-support-technical-skills-bootcamp.jpg',
    modalSrc: '/images/it-support-technical-skills-bootcamp.jpg',
    description: {
      en: 'Bootcamp covering networking basics, Windows administration and day-to-day helpdesk workflows.',
      fi: 'Bootcamp: verkkoperusteet, Windows-hallinta ja arjen helpdesk-työskentely.',
    },
    skills: {
      en: ['Networking Basics', 'Windows', 'Helpdesk'],
      fi: ['Verkkoperusteet', 'Windows', 'Helpdesk'],
    },
  },
  {
    id: 'primavera',
    title: 'Primavera P6 Project Planning',
    provider: 'Udemy',
    year: '2024',
    accent: '#f97316',
    iconLabel: 'P6',
    previewType: 'image',
    previewSrc: '/images/Primavera-P6.jpeg',
    modalSrc: '/images/Primavera-P6.jpeg',
    description: {
      en: 'Planning and controlling complex timelines with Primavera P6 – WBS, dependencies, baselines and tracking.',
      fi: 'Aikataulujen suunnittelu ja ohjaus Primavera P6:lla — WBS, riippuvuudet, baseline ja seuranta.',
    },
    skills: {
      en: ['Project Planning', 'Scheduling', 'Primavera P6'],
      fi: ['Projektisuunnittelu', 'Aikataulutus', 'Primavera P6'],
    },
  },
  {
    id: 'python-bootcamp',
    title: 'Complete Python Bootcamp: Zero to Hero',
    provider: 'Udemy',
    year: '2021',
    accent: '#38bdf8',
    iconLabel: 'PY',
    previewType: 'image',
    previewSrc: '/images/Pyhton-Bootcamp.jpg',
    modalSrc: '/images/Pyhton-Bootcamp.jpg',
    description: {
      en: 'From Python basics to OOP and working with data through real projects and coding exercises.',
      fi: 'Pythonin perusteista OOP:hen ja dataan — harjoituksia ja projekteja käytännön kautta.',
    },
    skills: {
      en: ['Python', 'Scripting', 'OOP'],
      fi: ['Python', 'Skriptaus', 'OOP'],
    },
  },
  {
    id: 'freecodecamp',
    title: 'Responsive Web Design',
    provider: 'freeCodeCamp',
    year: '2019',
    accent: '#10b981',
    iconLabel: 'RW',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/freecodecamp.pdf',
    description: {
      en: '300 hours of coursework in responsive web design, HTML and CSS fundamentals for the modern web.',
      fi: '300 tuntia responsiivisen web-suunnittelun opintoja: HTML- ja CSS-perusteet moderniin webiin.',
    },
    skills: {
      en: ['HTML', 'CSS', 'Responsive Design', 'Accessibility'],
      fi: ['HTML', 'CSS', 'Responsiivinen design', 'Saavutettavuus'],
    },
  },
  {
    id: 'fsecure',
    title: 'F-Secure PMCS Technical Training',
    provider: 'F-Secure Corporation',
    year: '2020',
    accent: '#ef4444',
    iconLabel: 'FS',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/F-secure.pdf',
    description: {
      en: 'Technical certification on F-Secure PMCS features, security concepts and deployment best practices.',
      fi: 'Tekninen sertifiointi: F-Secure PMCS -ominaisuudet, tietoturvakäsitteet ja käyttöönoton parhaat käytännöt.',
    },
    skills: {
      en: ['Cybersecurity', 'PMCS', 'Security Products'],
      fi: ['Kyberturvallisuus', 'PMCS', 'Tietoturvatuotteet'],
    },
  },
  {
    id: 'dude',
    title: 'DUDE Project Participation',
    provider: 'Centria University of Applied Sciences',
    year: '2020',
    accent: '#14b8a6',
    iconLabel: 'DU',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/dude.pdf',
    description: {
      en: 'Integrated Pipedrive data via API into SQL and planned a video stream website — 81 hours of project work.',
      fi: 'Pipedrive-datan integrointi API:n kautta SQL:ään sekä videosuoratoistosivuston suunnittelu — 81 tuntia projektityötä.',
    },
    skills: {
      en: ['API Integration', 'SQL', 'Web Development'],
      fi: ['API-integraatio', 'SQL', 'Web-kehitys'],
    },
  },
  {
    id: 'sap',
    title: 'SAP Introduction',
    provider: 'SAP',
    year: '2019',
    accent: '#f59e0b',
    iconLabel: 'SP',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/SAP.pdf',
    description: {
      en: 'Introduction to SAP ERP and business systems, finishing with an online knowledge test on core concepts.',
      fi: 'Johdanto SAP ERP:hen ja yritysjärjestelmiin — lopuksi verkkotentti ydinkäsitteistä.',
    },
    skills: {
      en: ['SAP', 'ERP', 'Business Systems'],
      fi: ['SAP', 'ERP', 'Yritysjärjestelmät'],
    },
  },
  {
    id: 'softcherry',
    title: 'Frontend Developer — Soft Cherry',
    provider: 'Soft Cherry Pvt. Ltd.',
    year: '2018–2019',
    accent: '#f43f5e',
    iconLabel: 'SC',
    previewType: 'pdf',
    previewSrc: '',
    modalSrc: '/images/softcherry.pdf',
    description: {
      en: 'Experience letter from a frontend role: UI mockups with Photoshop, Adobe XD, Figma and Illustrator.',
      fi: 'Työtodistus frontend-roolista: UI-mockupit Photoshopilla, Adobe XD:llä, Figmalla ja Illustratorilla.',
    },
    skills: {
      en: ['Figma', 'Adobe XD', 'UI Design', 'UX Research'],
      fi: ['Figma', 'Adobe XD', 'UI-suunnittelu', 'UX-tutkimus'],
    },
  },
]

const quotes = [
  { text: 'Every certificate is a door you unlocked — not by luck, but by showing up.', author: 'On persistence' },
  { text: 'The expert in anything was once a beginner who simply refused to quit.', author: 'Helen Hayes' },
  { text: 'An investment in knowledge always pays the best dividends.', author: 'Benjamin Franklin' },
  { text: 'Learning is not attained by chance; it must be sought with ardour and diligence.', author: 'Abigail Adams' },
  { text: 'The beautiful thing about learning is that nobody can take it away from you.', author: 'B.B. King' },
]

function SkillPill({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="text-[10px] font-mono px-2.5 py-[3px] rounded-full border"
      style={{
        borderColor: accent + '40',
        color: accent,
        backgroundColor: accent + '12',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </span>
  )
}

function CardPreview({
  cert,
  onClick,
  isCardHovered,
  showHint,
  ctaLabel,
  previewLabel,
}: {
  cert: CertSlide
  onClick: () => void
  isCardHovered: boolean
  showHint: boolean
  ctaLabel: string
  previewLabel: string
}) {
  const isImage = cert.previewType === 'image'

  const pillClass = isCardHovered
    ? 'scale-[1.1] bg-cyan-500 text-black shadow-[0_0_28px_rgba(34,211,238,0.75)]'
    : showHint
      ? 'scale-[1.08] bg-cyan-200/90 text-cyan-900 shadow-[0_0_16px_rgba(34,211,238,0.45)]'
      : 'scale-100 bg-white/80 dark:bg-white/75 text-zinc-900 shadow-md shadow-black/20'

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full h-[130px] md:h-[140px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      {isImage ? (
        <Image
          src={cert.previewSrc}
          alt={cert.title}
          fill
          sizes="(max-width: 768px) 260px, 280px"
          className={[
            'object-cover blur-[1px] brightness-[0.78] dark:brightness-[0.85] transition-transform duration-500',
            isCardHovered ? 'scale-[1.06]' : 'scale-[1.03]',
          ].join(' ')}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 10% 0%, ${cert.accent}22 0, transparent 55%), radial-gradient(circle at 90% 100%, ${cert.accent}33 0, #020617 65%)`,
          }}
        >
          <div className="h-11 w-11 rounded-2xl border border-white/30 bg-black/30 flex items-center justify-center backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>
        </div>
      )}

      <div className={['absolute inset-0 transition-colors duration-300', isCardHovered ? 'bg-black/45' : 'bg-black/10'].join(' ')} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={[
            'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-mono',
            'transition-all duration-200 ease-out',
            pillClass,
          ].join(' ')}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M9 5l7 7-7 7" />
          </svg>
          {ctaLabel}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/55 to-transparent flex items-end justify-between px-3 pb-1.5">
        <span className="text-[9px] font-mono text-zinc-300 opacity-80">{previewLabel}</span>
        <span className="text-[9px] font-mono" style={{ color: cert.accent }}>
          {cert.year}
        </span>
      </div>
    </button>
  )
}

function ModalViewer({ cert }: { cert: CertSlide }) {
  if (cert.previewType === 'image') {
    return (
      <div className="relative w-full bg-zinc-900" style={{ maxHeight: '62vh', minHeight: 320 }}>
        <Image
          src={cert.modalSrc}
          alt={cert.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-contain"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full bg-zinc-900" style={{ height: '62vh' }}>
      <iframe
        src={cert.modalSrc + '#toolbar=1&navpanes=0&scrollbar=1'}
        className="w-full h-full border-0"
        title={cert.title}
      />
    </div>
  )
}

export default function Certifications() {
  const { locale } = useLang()
  const isFI = locale === 'fi'

  const ui = useMemo(
    () => ({
      section: '// 05',
      title: isFI ? 'Sertifikaatit' : 'Certifications',
      subtitle: isFI
        ? 'Korttipakka sertifikaateista — selaa kortteja ja avaa mikä tahansa nähdäksesi koko dokumentin.'
        : 'A stacked deck of certificates — flip through the cards, then open any one to view the full document.',
      preview: isFI ? 'Esikatselu' : 'Preview',
      viewFull: isFI ? 'Näytä koko sertifikaatti' : 'View full certificate',
      statCertificates: isFI ? 'Sertifikaatteja' : 'Certificates',
      statLearningSince: isFI ? 'Oppiminen alkanut' : 'Learning since',
      statPlatforms: isFI ? 'Alustoja' : 'Platforms',
      card: isFI ? 'Kortti' : 'Card',
      keysHint: isFI ? '← → näppäimet tai pyyhkäisy' : '← → keys or swipe',
      modalPdfHint: isFI
        ? 'PDF näkyy tässä — käytä työkalupalkkia zoomaukseen, lataukseen tai tulostukseen.'
        : 'PDF rendered inline — use the built-in toolbar to zoom, download or print.',
      modalIssuedBy: isFI ? 'Myöntäjä:' : 'Issued by',
      modalOpenDownload: isFI ? 'Avaa / Lataa' : 'Open / Download',
    }),
    [isFI],
  )

  const slides: CertSlide[] = useMemo(() => {
    const l: Locale = isFI ? 'fi' : 'en'
    return CERTS.map((c) => ({
      id: c.id,
      title: c.title,
      provider: c.provider,
      year: c.year,
      accent: c.accent,
      iconLabel: c.iconLabel,
      previewType: c.previewType,
      previewSrc: c.previewSrc,
      modalSrc: c.modalSrc,
      description: c.description[l],
      skills: c.skills[l],
    }))
  }, [isFI])

  const [activeIndex, setActiveIndex] = useState(0)
  const [modalSlide, setModalSlide] = useState<CertSlide | null>(null)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [ctaHint, setCtaHint] = useState(true)
  const [isCardHovered, setIsCardHovered] = useState(false)

  // Safe index with wrap + guards
  const safeActiveIndex =
    slides.length === 0 ? 0 : ((activeIndex % slides.length) + slides.length) % slides.length
  const active = slides.length === 0 ? null : slides[safeActiveIndex]

  // CTA hint trigger (NO setState in effects)
  const ctaTimerRef = useRef<number | null>(null)
  const triggerCtaHint = useCallback(() => {
    setCtaHint(true)
    setIsCardHovered(false)
    if (ctaTimerRef.current) window.clearTimeout(ctaTimerRef.current)
    ctaTimerRef.current = window.setTimeout(() => setCtaHint(false), 1200)
  }, [])

  useEffect(() => {
    return () => {
      if (ctaTimerRef.current) window.clearTimeout(ctaTimerRef.current)
    }
  }, [])

  const goNext = useCallback(() => {
    if (slides.length === 0) return
    setActiveIndex((p) => (p + 1) % slides.length)
    triggerCtaHint()
  }, [slides.length, triggerCtaHint])

  const goPrev = useCallback(() => {
    if (slides.length === 0) return
    setActiveIndex((p) => (p === 0 ? slides.length - 1 : p - 1))
    triggerCtaHint()
  }, [slides.length, triggerCtaHint])

  useEffect(() => {
    const t = window.setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 6000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalSlide(null)
        return
      }
      if (modalSlide) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalSlide, goNext, goPrev])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const dx = e.changedTouches[0].clientX - touchStartX
    if (dx > 40) goPrev()
    else if (dx < -40) goNext()
    setTouchStartX(null)
  }

  if (!active) {
    return (
      <section id="certifications" className="py-24 bg-[#f5f5f5] dark:bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-6 xl:px-0">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">No certificates to display.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="py-24 bg-[#f5f5f5] dark:bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-1/4 w-[420px] h-[420px] bg-cyan-500/8 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-1/5 w-[380px] h-[380px] bg-violet-500/6 dark:bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-6 xl:px-0 relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-cyan-500 text-xs font-mono tracking-[0.25em]">{ui.section}</span>
          <div className="w-10 h-px bg-cyan-500" />
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {ui.title}
          </h2>
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800" />
        </div>

        <p className="text-xs md:text-sm font-mono text-zinc-700 dark:text-zinc-400 max-w-xl mb-12">
          {ui.subtitle}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] gap-12 xl:gap-20 items-start">
          {/* LEFT */}
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="relative rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 px-7 py-8 overflow-hidden">
              <div
                className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full transition-all duration-500"
                style={{ background: `linear-gradient(to bottom, ${active.accent}, #8b5cf6)` }}
              />
              <span
                className="absolute top-1 left-5 text-[100px] leading-none select-none font-serif pointer-events-none"
                style={{ color: active.accent + '10' }}
              >
                &ldquo;
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="relative min-h-[96px] flex flex-col justify-center"
                >
                  <p
                    className="text-base md:text-[17px] leading-relaxed text-zinc-900 dark:text-zinc-50 italic mb-3"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {quotes[quoteIndex].text}
                  </p>
                  <p className="text-[11px] font-mono tracking-[0.12em]" style={{ color: active.accent }}>
                    — {quotes[quoteIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 mt-5">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuoteIndex(i)}
                    className="h-[5px] rounded-full transition-all duration-300"
                    style={{
                      width: i === quoteIndex ? 20 : 6,
                      backgroundColor: i === quoteIndex ? active.accent : 'rgba(161,161,170,0.35)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: `${slides.length}+`, label: ui.statCertificates },
                { val: '2019', label: ui.statLearningSince },
                { val: '5+', label: ui.statPlatforms },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 px-5 py-4 text-left"
                >
                  <p
                    className="text-[22px] md:text-[24px] font-bold text-zinc-900 dark:text-white tracking-tight mb-1"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {s.val}
                  </p>
                  <p className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 px-5 py-4">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.12em]">
                  {ui.card} {String(safeActiveIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono" style={{ color: active.accent }}>
                  {active.year}
                </span>
              </div>

              <div className="h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${active.accent}, #8b5cf6)` }}
                  animate={{ width: `${((safeActiveIndex + 1) / slides.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">{active.description}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center lg:pl-10 xl:pl-14 min-h-[440px]">
            <div className="relative flex justify-center items-center flex-1 w-full">
              <div className="pointer-events-none absolute w-[260px] md:w-[280px] h-[340px]">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-zinc-200 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 translate-y-5 -translate-x-3 -rotate-[6deg] shadow-[0_18px_50px_rgba(0,0,0,0.55)]" />
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-700 dark:to-zinc-900 translate-y-2 translate-x-2 rotate-[4deg] shadow-[0_16px_45px_rgba(0,0,0,0.55)]" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${locale}-${active.id}`}
                  initial={{ opacity: 0, y: 26, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.97 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="relative w-[260px] md:w-[280px] h-[340px] rounded-[32px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-[0_26px_80px_rgba(0,0,0,0.55)] px-5 py-5 flex flex-col gap-3 touch-pan-y overflow-hidden"
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseLeave={() => setIsCardHovered(false)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.16em] leading-snug">
                      {active.provider}
                    </p>
                    <div
                      className="shrink-0 h-7 min-w-[32px] px-2 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white"
                      style={{ backgroundColor: active.accent }}
                    >
                      {active.iconLabel}
                    </div>
                  </div>

                  <h3
                    className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-50 leading-snug -mt-1"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {active.title}
                  </h3>

                  <CardPreview
                    cert={active}
                    onClick={() => {
                      setModalSlide(active)
                      triggerCtaHint()
                    }}
                    isCardHovered={isCardHovered}
                    showHint={ctaHint}
                    ctaLabel={ui.viewFull}
                    previewLabel={ui.preview}
                  />

                  <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {active.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {active.skills.map((s) => (
                      <SkillPill key={s} label={s} accent={active.accent} />
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                      {String(safeActiveIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 hidden md:block">
                      {ui.keysHint}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* arrows */}
            <div className="mt-auto pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="h-9 w-9 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-300 hover:border-cyan-400 hover:text-cyan-500 transition-all flex items-center justify-center text-sm"
              >
                ←
              </button>

              <div className="flex gap-1.5 items-center">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveIndex(i)
                      triggerCtaHint()
                    }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === safeActiveIndex ? 18 : 5,
                      height: 5,
                      backgroundColor: i === safeActiveIndex ? active.accent : 'rgba(161,161,170,0.3)',
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="h-9 w-9 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-300 hover:border-cyan-400 hover:text-cyan-500 transition-all flex items-center justify-center text-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalSlide && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalSlide(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-zinc-950/95 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-zinc-800/60">
                <div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.18em] mb-1">
                    {modalSlide.provider}
                  </p>
                  <h3 className="text-lg font-semibold text-white leading-snug" style={{ fontFamily: 'var(--font-syne)' }}>
                    {modalSlide.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {modalSlide.skills.map((s) => (
                      <SkillPill key={s} label={s} accent={modalSlide.accent} />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalSlide(null)}
                  className="shrink-0 h-8 w-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-xs"
                >
                  &#x2715;
                </button>
              </div>

              <ModalViewer cert={modalSlide} />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-zinc-800/60">
                <p className="text-[10px] font-mono text-zinc-500">
                  {modalSlide.previewType === 'pdf'
                    ? ui.modalPdfHint
                    : `${ui.modalIssuedBy} ${modalSlide.provider} · ${modalSlide.year}`}
                </p>

                <a
                  href={modalSlide.modalSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono border transition-colors"
                  style={{ borderColor: modalSlide.accent + '70', color: modalSlide.accent }}
                >
                  {ui.modalOpenDownload} &#x2197;
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}