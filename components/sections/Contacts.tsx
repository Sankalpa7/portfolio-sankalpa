'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/i18n/LangContext'

type Category = 'Job Opportunity' | 'Collaboration' | 'Question'
type Urgency = 'Just exploring' | 'Soon' | 'ASAP'

type FormState = {
  email: string
  subject: string
  message: string
  urgency: Urgency
  portfolioUrl: string
  attachPortfolio: boolean
  category: Category | ''
}

const MESSAGE_MAX = 900

const INITIAL_FORM: FormState = {
  email: '',
  subject: '',
  message: '',
  urgency: 'Just exploring',
  portfolioUrl: '',
  attachPortfolio: false,
  category: '',
}

function generateTicketId() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `SNK-2025-${n}`
}

const CATEGORIES: Category[] = ['Job Opportunity', 'Collaboration', 'Question']

const CATEGORY_ICONS: Record<Category, string> = {
  'Job Opportunity': '💼',
  Collaboration: '🤝',
  Question: '💬',
}

const URGENCY_OPTIONS: Urgency[] = ['Just exploring', 'Soon', 'ASAP']

const URGENCY_COLOURS: Record<Urgency, string> = {
  'Just exploring': '#22c55e',
  Soon: '#f59e0b',
  ASAP: '#ef4444',
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 18 }, (_, i) => i)
  const colours = ['#06b6d4', '#22c55e', '#f59e0b', '#8b5cf6', '#f43f5e', '#ffffff']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {pieces.map((i) => {
        const colour = colours[i % colours.length]
        const left = `${10 + ((i * 5) % 80)}%`
        const delay = (i * 0.07).toFixed(2)
        const size = 4 + (i % 4)
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 rounded-sm"
            style={{ left, width: size, height: size, backgroundColor: colour }}
            initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              y: [-10, -80 - (i % 3) * 30],
              opacity: [1, 1, 0],
              rotate: [0, i % 2 === 0 ? 180 : -180],
              scale: [1, 0.6],
            }}
            transition={{ duration: 1.2, delay: parseFloat(delay), ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

export default function Contact() {
  const { t, lang } = useLang()

  // label helpers (no missing catLabel/urgencyLabel functions)
  const catLabel = (c: Category) => {
    const map =
      t?.contact?.categories ??
      ({
        job: lang === 'fi' ? 'Työmahdollisuus' : 'Job Opportunity',
        collab: lang === 'fi' ? 'Yhteistyö' : 'Collaboration',
        question: lang === 'fi' ? 'Kysymys' : 'Question',
      } as any)

    if (c === 'Job Opportunity') return map.job ?? (lang === 'fi' ? 'Työmahdollisuus' : 'Job Opportunity')
    if (c === 'Collaboration') return map.collab ?? (lang === 'fi' ? 'Yhteistyö' : 'Collaboration')
    return map.question ?? (lang === 'fi' ? 'Kysymys' : 'Question')
  }

  const urgencyLabel = (u: Urgency) => {
    const map =
      t?.contact?.urgency ??
      ({
        explore: lang === 'fi' ? 'Vain kartoitan' : 'Just exploring',
        soon: lang === 'fi' ? 'Pian' : 'Soon',
        asap: lang === 'fi' ? 'Heti' : 'ASAP',
      } as any)

    if (u === 'Just exploring') return map.explore ?? (lang === 'fi' ? 'Vain kartoitan' : 'Just exploring')
    if (u === 'Soon') return map.soon ?? (lang === 'fi' ? 'Pian' : 'Soon')
    return map.asap ?? (lang === 'fi' ? 'Heti' : 'ASAP')
  }

  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [ticketId, setTicketId] = useState('SNK-2025-0001')
  const [lastTicketId, setLastTicketId] = useState('SNK-2025-0001')
  const [year, setYear] = useState(2025)
  const [hovering, setHovering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const id = generateTicketId()
    setTicketId(id)
    setLastTicketId(id)
    setYear(new Date().getFullYear())
  }, [])

  const handleMessageChange = (val: string) => {
    const trimmed = val.length > MESSAGE_MAX ? val.slice(0, MESSAGE_MAX) : val
    setForm((f) => ({ ...f, message: trimmed }))
    setIsTyping(true)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setIsTyping(false), 1200)
  }

  const selectCategory = (cat: Category) => {
    setForm((f) => ({ ...f, category: cat }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.message) return
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ticketId }),
      })

      if (!res.ok) throw new Error('Server error')

      setLastTicketId(ticketId)
      setSubmitted(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1800)
    } catch {
      setSubmitError(
        t?.contact?.error_msg ??
          (lang === 'fi'
            ? 'Viestin lähetys epäonnistui. Yritä uudelleen hetken kuluttua.'
            : 'Message failed to send. Please try again in a moment.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    const newId = generateTicketId()
    setTicketId(newId)
    setForm(INITIAL_FORM)
    setSubmitError('')
    setSubmitted(false)
  }

  const submitIdle =
    t?.contact?.submit_idle ?? (lang === 'fi' ? 'LÄHETÄ' : 'SEND')
  const submitHover =
    t?.contact?.submit_hover ?? (lang === 'fi' ? 'LÄHETETÄÄN' : 'SENDING')
  const emailPh =
    t?.contact?.field_email_placeholder ?? (lang === 'fi' ? 'sinun@email.fi' : 'you@example.com')
  const subjectPh =
    t?.contact?.field_subject_placeholder ?? (lang === 'fi' ? 'Aihe…' : 'Subject…')
  const messagePh =
    t?.contact?.field_message_placeholder ?? (lang === 'fi' ? 'Kirjoita viestisi…' : 'Write your message…')
  const attachPh =
    t?.contact?.attach_placeholder ?? (lang === 'fi' ? 'Portfolio-linkki (valinnainen)' : 'Portfolio URL (optional)')

  return (
    <section id="contact" className="py-24 bg-[#f5f5f5] dark:bg-[#050505] relative overflow-hidden">
      {/* background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-60px] right-1/4 w-[440px] h-[440px] bg-cyan-500/8 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/4 w-[360px] h-[360px] bg-violet-500/6 dark:bg-violet-500/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-6 xl:px-0 relative z-10">
        {/* heading */}
        <div className="flex items-center gap-4 mb-3">
          <span className="text-cyan-500 text-xs font-mono tracking-[0.25em]">
            {t?.contact?.section ?? '// 06'}
          </span>
          <div className="w-10 h-px bg-cyan-500" />
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {t?.contact?.title ?? (lang === 'fi' ? 'Yhteys' : 'Contact')}
          </h2>
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800" />
        </div>

        <p className="text-xs md:text-sm font-mono text-zinc-700 dark:text-zinc-400 max-w-xl mb-12">
          {t?.contact?.subtitle ??
            (lang === 'fi'
              ? 'Lähetä viesti — vastaan mahdollisimman pian.'
              : 'Send a message — I’ll get back to you as soon as possible.')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-8 xl:gap-16 items-start">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 px-7 py-7 overflow-hidden">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-[12px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">
                  {t?.contact?.status ?? (lang === 'fi' ? 'Saatavilla' : 'Available')}
                </span>
              </div>

              <h3
                className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-1 leading-snug"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {t?.contact?.heading_line1 ?? (lang === 'fi' ? 'Otetaan yhteyttä' : 'Let’s connect')}
                <br />
                <span className="text-[#00E5FF]">
                  {t?.contact?.heading_name ?? 'Sankalpa'}
                </span>
              </h3>
              <p className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 mb-7">
                {t?.contact?.heading_sub ??
                  (lang === 'fi'
                    ? 'Valitse aihe ja lähetä viesti.'
                    : 'Pick a category and send a message.')}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => {
                  const isActive = form.category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => selectCategory(cat)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-mono border transition-all duration-200"
                      style={
                        isActive
                          ? { backgroundColor: '#00E5FF20', borderColor: '#00E5FF70', color: '#00E5FF' }
                          : { backgroundColor: 'transparent', borderColor: 'rgba(161,161,170,0.25)', color: 'rgba(161,161,170,0.7)' }
                      }
                    >
                      <span>{CATEGORY_ICONS[cat]}</span>
                      {catLabel(cat)}
                    </button>
                  )
                })}
              </div>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />

              <div className="flex flex-col gap-3.5 mb-7">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400">
                    {t?.contact?.sla_reply ?? (lang === 'fi' ? 'Vastausaika:' : 'Reply time:')}{' '}
                    <span className="text-zinc-900 dark:text-zinc-200">
                      {t?.contact?.sla_reply_val ?? (lang === 'fi' ? '24–48h' : '24–48h')}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400">
                    {t?.contact?.sla_preferred ?? (lang === 'fi' ? 'Mieluiten:' : 'Preferred:')}{' '}
                    <span className="text-zinc-900 dark:text-zinc-200">
                      {t?.contact?.sla_preferred_val ?? (lang === 'fi' ? 'Sähköposti' : 'Email')}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400">
                    {t?.contact?.sla_based ?? (lang === 'fi' ? 'Sijainti:' : 'Based in:')}{' '}
                    <span className="text-zinc-900 dark:text-zinc-200">
                      {t?.contact?.sla_based_val ?? (lang === 'fi' ? 'Suomi' : 'Finland')}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-[12px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.18em]">
                  {t?.contact?.ticket_id ?? (lang === 'fi' ? 'Tunnus' : 'Ticket')}
                </span>
                <span className="text-[13px] font-mono tracking-[0.15em] text-[#00E5FF]">{ticketId}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 px-5 py-4">
              <p className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                {t?.contact?.activity_title ?? (lang === 'fi' ? 'Tällä hetkellä' : 'Currently')}
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { dot: '#22c55e', text: t?.contact?.activity_1 ?? (lang === 'fi' ? 'Pro gradu käynnissä' : "Master's thesis in progress") },
                  { dot: '#06b6d4', text: t?.contact?.activity_2 ?? (lang === 'fi' ? 'Haen pilvi-/IT-rooleja' : 'Actively seeking cloud / IT roles') },
                  { dot: '#8b5cf6', text: t?.contact?.activity_3 ?? (lang === 'fi' ? 'Portfolio v2 julkaistu' : 'Portfolio v2 shipped') },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                    <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 px-5 py-4 flex items-center gap-3">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] shrink-0">
                {t?.contact?.reach ?? (lang === 'fi' ? 'Tavoita' : 'Reach')}
              </p>
              <div className="flex gap-2 flex-wrap items-center">
                {[
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sankalpaneupane7/', colour: '#0ea5e9' },
                  { label: 'GitHub', href: 'https://github.com/Sankalpa7', colour: '#8b5cf6' },
                  { label: 'Email', href: 'mailto:sankalpaneupane7@gmail.com', colour: '#06b6d4' },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center justify-center px-3.5 rounded-full text-[12px] font-mono border transition-all duration-200 hover:scale-[1.04] whitespace-nowrap"
                    style={{ borderColor: l.colour + '50', color: l.colour, backgroundColor: l.colour + '10' }}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 px-8 py-12 flex flex-col items-center text-center overflow-hidden"
                >
                  {showConfetti && <ConfettiBurst />}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ border: '1px solid #00E5FF50', backgroundColor: '#00E5FF15' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-zinc-900 dark:text-white mb-2"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {t?.contact?.success_title ?? (lang === 'fi' ? 'Viesti lähetetty!' : 'Message sent!')}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs"
                  >
                    {t?.contact?.success_sub ??
                      (lang === 'fi'
                        ? 'Palaan asiaan pian. Tarkista sähköpostisi.'
                        : "I’ll get back to you soon. Keep an eye on your inbox.")}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36 }}
                    className="px-5 py-2.5 rounded-full text-[13px] font-mono tracking-[0.15em] mb-8"
                    style={{ border: '1px solid #00E5FF50', color: '#00E5FF', backgroundColor: '#00E5FF0F' }}
                  >
                    {(t?.contact?.success_ref ?? (lang === 'fi' ? 'Tunnus:' : 'Reference:'))} {lastTicketId}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.44 }}
                    className="text-[13px] font-mono text-zinc-400 italic mb-10"
                  >
                    {t?.contact?.success_quote ?? '“Thank you for reaching out. – Sankalpa”'}
                  </motion.p>

                  <motion.button
                    type="button"
                    onClick={handleReset}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-[12px] font-mono border transition-all duration-200"
                    style={{
                      borderColor: 'rgba(161,161,170,0.3)',
                      color: 'rgba(161,161,170,0.7)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#00E5FF'
                      e.currentTarget.style.color = '#00E5FF'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(161,161,170,0.3)'
                      e.currentTarget.style.color = 'rgba(161,161,170,0.7)'
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                    </svg>
                    {t?.contact?.send_another ?? (lang === 'fi' ? 'Lähetä uusi viesti' : 'Send another message')}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-[28px] border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/70 px-7 py-8 flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-1">
                        {t?.contact?.form_new ?? (lang === 'fi' ? 'Uusi viesti' : 'New message')}
                      </p>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                        {t?.contact?.form_title ?? (lang === 'fi' ? 'Lähetä viesti' : 'Send a message')}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <p className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.15em]">
                        {t?.contact?.priority ?? (lang === 'fi' ? 'Prioriteetti' : 'Priority')}
                      </p>
                      <div className="flex gap-1">
                        {URGENCY_OPTIONS.map((u) => {
                          const isActive = form.urgency === u
                          return (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, urgency: u }))}
                              className="px-3 py-1.5 rounded-full text-[11px] font-mono border transition-all duration-200"
                              style={
                                isActive
                                  ? { backgroundColor: URGENCY_COLOURS[u] + '20', borderColor: URGENCY_COLOURS[u] + '60', color: URGENCY_COLOURS[u] }
                                  : { backgroundColor: 'transparent', borderColor: 'rgba(161,161,170,0.2)', color: 'rgba(161,161,170,0.5)' }
                              }
                            >
                              {urgencyLabel(u)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

                  {/* email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-mono text-zinc-500 uppercase tracking-[0.15em]">
                      {t?.contact?.field_email ?? (lang === 'fi' ? 'Sähköposti' : 'Email')}{' '}
                      <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={emailPh}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all"
                    />
                  </div>

                  {/* subject */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-mono text-zinc-500 uppercase tracking-[0.15em]">
                      {t?.contact?.field_subject ?? (lang === 'fi' ? 'Aihe' : 'Subject')}
                    </label>
                    <input
                      type="text"
                      placeholder={form.category ? catLabel(form.category as Category) : subjectPh}
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all"
                    />
                  </div>

                  {/* message */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-mono text-zinc-500 uppercase tracking-[0.15em]">
                        {t?.contact?.field_message ?? (lang === 'fi' ? 'Viesti' : 'Message')}{' '}
                        <span className="text-[#00E5FF]">*</span>
                      </label>

                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, x: 6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 6 }}
                            className="flex items-center gap-1.5"
                          >
                            <span className="text-[12px] font-mono text-[#00E5FF] tracking-wide">
                              {t?.contact?.building ?? (lang === 'fi' ? 'Kirjoitetaan' : 'Typing')}
                            </span>
                            <span className="flex gap-0.5">
                              {[0, 1, 2].map((i) => (
                                <motion.span
                                  key={i}
                                  className="h-1 w-1 rounded-full bg-[#00E5FF] inline-block"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                />
                              ))}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <textarea
                      ref={messageRef}
                      required
                      rows={5}
                      placeholder={messagePh}
                      value={form.message}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all resize-none"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>
                        {t?.contact?.chars_up_to ?? (lang === 'fi' ? 'Enintään' : 'Up to')}{' '}
                        {MESSAGE_MAX}{' '}
                        {t?.contact?.chars_label ?? (lang === 'fi' ? 'merkkiä' : 'characters')}
                      </span>
                      <span className={form.message.length >= MESSAGE_MAX ? 'text-red-400' : ''}>
                        {form.message.length} / {MESSAGE_MAX}
                      </span>
                    </div>
                  </div>

                  {/* attach portfolio */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, attachPortfolio: !f.attachPortfolio }))}
                      className="flex items-center gap-3 group"
                    >
                      <div
                        className="relative h-5 w-9 rounded-full border transition-all duration-300"
                        style={{
                          backgroundColor: form.attachPortfolio ? '#00E5FF30' : 'transparent',
                          borderColor: form.attachPortfolio ? '#00E5FF80' : 'rgba(161,161,170,0.3)',
                        }}
                      >
                        <div
                          className="absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: form.attachPortfolio ? '#00E5FF' : 'rgba(161,161,170,0.5)',
                            left: form.attachPortfolio ? '17px' : '1px',
                          }}
                        />
                      </div>
                      <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                        {t?.contact?.attach_toggle ?? (lang === 'fi' ? 'Liitä portfolio-linkki' : 'Attach portfolio link')}
                      </span>
                    </button>

                    <AnimatePresence>
                      {form.attachPortfolio && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="url"
                            placeholder={attachPh}
                            value={form.portfolioUrl}
                            onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* error banner */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] font-mono text-red-400"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !form.email || !form.message}
                    onHoverStart={() => setHovering(true)}
                    onHoverEnd={() => setHovering(false)}
                    whileTap={{ scale: 0.97 }}
                    className="
                      mt-2 w-full rounded-full py-4
                      font-mono text-[13px] font-semibold tracking-[0.25em]
                      bg-[#00E5FF] text-black
                      shadow-md hover:shadow-[0_0_28px_rgba(0,229,255,0.4)]
                      transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed
                      overflow-hidden relative
                    "
                  >
                    <AnimatePresence>
                      {hovering && !isSubmitting && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>

                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="inline-block h-3.5 w-3.5 border-2 border-black/30 border-t-black rounded-full"
                        />
                        {t?.contact?.submit_loading ?? (lang === 'fi' ? 'LÄHETETÄÄN' : 'SENDING')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {hovering ? submitHover : submitIdle}
                        <motion.span
                          animate={hovering ? { x: [0, 3, 0] } : { x: 0 }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        >
                          ↗
                        </motion.span>
                      </span>
                    )}
                  </motion.button>

                  <p className="text-[13px] font-mono text-zinc-400 text-center mt-3">
                    {t?.contact?.footer_note ??
                      (lang === 'fi'
                        ? 'En tallenna tietojasi — viesti lähetetään vain sähköpostina.'
                        : 'I don’t store your data — the message is sent via email only.')}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-6 xl:px-0 mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 tracking-[0.08em]">
            © {year} Sankalpa Neupane. {t?.contact?.footer_rights ?? (lang === 'fi' ? 'Kaikki oikeudet pidätetään.' : 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/sankalpaneupane7/"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-[#00E5FF] transition-colors tracking-[0.08em]"
            >
              LinkedIn
            </a>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <a
              href="https://github.com/Sankalpa7"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-[#00E5FF] transition-colors tracking-[0.08em]"
            >
              GitHub
            </a>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <a
              href="mailto:sankalpaneupane7@gmail.com"
              className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-[#00E5FF] transition-colors tracking-[0.08em]"
            >
              Email
            </a>
          </div>
          <p className="text-[13px] font-mono text-zinc-500 dark:text-zinc-400 tracking-[0.08em]">
            {t?.contact?.built_with ?? 'Built with Next.js & Tailwind'}
          </p>
        </div>
      </div>
    </section>
  )
}