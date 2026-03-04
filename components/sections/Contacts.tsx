'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/lib/i18n/LangContext'

type Category = 'job' | 'collab' | 'question'
type Urgency = 'exploring' | 'soon' | 'asap'

type FormState = {
  category: Category | ''
  urgency: Urgency
  email: string
  subject: string
  message: string
  attachPortfolio: boolean
  portfolioUrl: string
}

type ContactCategories = { job: string; collab: string; question: string }
type ContactUrgency = { exploring: string; soon: string; asap: string }

const MESSAGE_MAX = 900

const INITIAL_FORM: FormState = {
  category: '',
  urgency: 'exploring',
  email: '',
  subject: '',
  message: '',
  attachPortfolio: false,
  portfolioUrl: '',
}

function generateTicketId() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `SNK-${new Date().getFullYear()}-${n}`
}

const CATEGORY_ICONS: Record<Category, string> = {
  job: '💼',
  collab: '🤝',
  question: '💬',
}

const URGENCY_COLOURS: Record<Urgency, string> = {
  exploring: '#22c55e',
  soon: '#f59e0b',
  asap: '#ef4444',
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 18 }, (_, i) => i)
  const colours = ['#06b6d4', '#22c55e', '#f59e0b', '#8b5cf6', '#f43f5e', '#ffffff']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
      {pieces.map((i) => {
        const colour = colours[i % colours.length]
        const left = `${10 + ((i * 5) % 80)}%`
        const delay = i * 0.07
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
            transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

export default function Contact() {
  const { t, locale } = useLang()

  const categoriesFallback: ContactCategories = {
    job: locale === 'fi' ? 'Työtarjous' : 'Job Opportunity',
    collab: locale === 'fi' ? 'Yhteistyö' : 'Collaboration',
    question: locale === 'fi' ? 'Kysymys' : 'Question',
  }

  const urgencyFallback: ContactUrgency = {
    exploring: locale === 'fi' ? 'Tutustumassa' : 'Just exploring',
    soon: locale === 'fi' ? 'Pian' : 'Soon',
    asap: locale === 'fi' ? 'Kiireellinen' : 'ASAP',
  }

  const categories: ContactCategories =
    (t?.contact?.categories as ContactCategories | undefined) ?? categoriesFallback

  const urgencyMap: ContactUrgency =
    (t?.contact?.urgency as ContactUrgency | undefined) ?? urgencyFallback

  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [ticketId, setTicketId] = useState('SNK-0000-0000') // stable SSR-safe placeholder
  const [lastTicketId, setLastTicketId] = useState('SNK-0000-0000')
  const [year, setYear] = useState(2025)
  const [hovering, setHovering] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = generateTicketId()
    setTicketId(id)
    setLastTicketId(id)
    setYear(new Date().getFullYear())
  }, [])

  useEffect(() => {
    if (!submitted) return
    window.scrollTo({
      top: document.getElementById('contact')?.offsetTop || 0,
      behavior: 'smooth',
    })
  }, [submitted])

  const charCount = form.message.length
  const charLeft = useMemo(() => MESSAGE_MAX - charCount, [charCount])

  const catLabel = (c: Category) => {
    if (c === 'job') return categories.job
    if (c === 'collab') return categories.collab
    return categories.question
  }

  const urgencyLabel = (u: Urgency) => {
    if (u === 'exploring') return urgencyMap.exploring
    if (u === 'soon') return urgencyMap.soon
    return urgencyMap.asap
  }

  const handleMessageChange = (val: string) => {
    const trimmed = val.length > MESSAGE_MAX ? val.slice(0, MESSAGE_MAX) : val
    setForm((f) => ({ ...f, message: trimmed }))
    setIsTyping(true)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setIsTyping(false), 1200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.message.trim()) return
    if (isSubmitting) return

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
          (locale === 'fi'
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
    setLastTicketId(newId)
    setForm(INITIAL_FORM)
    setSubmitError('')
    setSubmitted(false)
  }

  const activity = (t?.contact?.activity ?? []) as string[]

  const submitIdle = t?.contact?.submit_idle ?? (locale === 'fi' ? 'LÄHETÄ VIESTI' : 'SEND MESSAGE')
  const submitHover = t?.contact?.submit_hover ?? (locale === 'fi' ? 'LUO TIKETTI' : 'CREATE TICKET')
  const submitLoading = t?.contact?.submit_loading ?? (locale === 'fi' ? 'LUODAAN…' : 'CREATING…')

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
          <span className="text-cyan-500 text-xs font-mono tracking-[0.25em]">{t?.contact?.section ?? '// 07'}</span>
          <div className="w-10 h-px bg-cyan-500" />
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {t?.contact?.title ?? 'Contact'}
          </h2>
          <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800" />
        </div>

        {/* ✅ dark mode subtitle brighter */}
        <p className="text-xs md:text-sm font-mono text-zinc-700 dark:text-zinc-300/80 max-w-xl mb-12">
          {t?.contact?.subtitle ?? ''}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-8 xl:gap-16 items-stretch">
          {/* LEFT column */}
          <div className="flex flex-col gap-4 h-full">
            {/* ✅ dark card slightly brighter + borders a touch clearer */}
            <div className="relative rounded-[28px] border border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/75 px-7 py-7 overflow-hidden">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>

                {/* ✅ dark label brighter */}
                <span className="text-[12px] font-mono text-zinc-500 dark:text-zinc-300/70 uppercase tracking-[0.2em]">
                  {t?.contact?.status ?? ''}
                </span>
              </div>

              <h3
                className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-1 leading-snug"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {t?.contact?.heading_line1 ?? ''}
                <br />
                <span className="text-[#00E5FF]">{t?.contact?.heading_name ?? 'Sankalpa'}</span>
              </h3>

              {/* ✅ dark paragraph brighter */}
              <p className="text-[13px] font-mono text-zinc-600 dark:text-zinc-300/80 mb-7">
                {t?.contact?.heading_sub ?? ''}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(['job', 'collab', 'question'] as Category[]).map((cat) => {
                  const isActive = form.category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-mono border transition-all duration-200"
                      style={
                        isActive
                          ? { backgroundColor: '#00E5FF20', borderColor: '#00E5FF70', color: '#00E5FF' }
                          : {
                              backgroundColor: 'transparent',
                              borderColor: 'rgba(161,161,170,0.25)',
                              // ✅ dark inactive text brighter
                              color: 'rgba(228,228,231,0.75)',
                            }
                      }
                    >
                      <span>{CATEGORY_ICONS[cat]}</span>
                      {catLabel(cat)}
                    </button>
                  )
                })}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent mb-6" />

              <div className="flex flex-col gap-3.5 mb-7">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[11px]">⏱️</span>
                  </div>
                  {/* ✅ dark info text brighter */}
                  <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-300/80">
                    {t?.contact?.sla_reply ?? ''}{' '}
                    <span className="text-zinc-900 dark:text-zinc-100">{t?.contact?.sla_reply_val ?? ''}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[11px]">✉️</span>
                  </div>
                  <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-300/80">
                    {t?.contact?.sla_preferred ?? ''}{' '}
                    <span className="text-zinc-900 dark:text-zinc-100">{t?.contact?.sla_preferred_val ?? ''}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[11px]">📍</span>
                  </div>
                  <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-300/80">
                    {t?.contact?.sla_based ?? ''}{' '}
                    <span className="text-zinc-900 dark:text-zinc-100">{t?.contact?.sla_based_val ?? ''}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <span className="text-[12px] font-mono text-zinc-400 dark:text-zinc-300/60 uppercase tracking-[0.18em]">
                  {t?.contact?.ticket_id ?? 'Ticket'}
                </span>
                <span className="text-[13px] font-mono tracking-[0.15em] text-[#00E5FF]">{ticketId}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/75 px-5 py-4">
              <p className="text-[12px] font-mono text-zinc-400 dark:text-zinc-300/60 uppercase tracking-[0.2em] mb-4">
                {t?.contact?.activity_title ?? ''}
              </p>
              <div className="flex flex-col gap-2">
                {activity.slice(0, 3).map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: idx === 0 ? '#22c55e' : idx === 1 ? '#06b6d4' : '#8b5cf6' }}
                    />
                    {/* ✅ dark activity brighter */}
                    <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-300/80">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/75 px-5 py-4 flex items-center gap-3">
              <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-300/60 uppercase tracking-[0.2em] shrink-0">
                {t?.contact?.reach ?? ''}
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

          {/* RIGHT column */}
          <div className="relative h-full">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative rounded-[28px] border border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/75 px-8 py-12 flex flex-col items-center text-center overflow-hidden h-full"
                >
                  {showConfetti && <ConfettiBurst />}

                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6" style={{ border: '1px solid #00E5FF50', backgroundColor: '#00E5FF15' }}>
                    <span className="text-2xl">✅</span>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                    {t?.contact?.success_title ?? 'Ticket created.'}
                  </h3>

                  {/* ✅ dark success text brighter */}
                  <p className="text-[13px] font-mono text-zinc-500 dark:text-zinc-300/80 mb-6 max-w-xs">
                    {t?.contact?.success_sub ?? ''}
                  </p>

                  <div className="px-5 py-2.5 rounded-full text-[13px] font-mono tracking-[0.15em] mb-8" style={{ border: '1px solid #00E5FF50', color: '#00E5FF', backgroundColor: '#00E5FF0F' }}>
                    {(t?.contact?.success_ref ?? 'Ticket Ref:')} {lastTicketId}
                  </div>

                  <p className="text-[13px] font-mono text-zinc-400 dark:text-zinc-300/70 italic mb-10">
                    {t?.contact?.success_quote ?? ''}
                  </p>

                  <motion.button
                    type="button"
                    onClick={handleReset}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-[12px] font-mono border transition-all duration-200"
                    style={{ borderColor: 'rgba(161,161,170,0.35)', color: 'rgba(228,228,231,0.75)' }}
                  >
                    ↺ {t?.contact?.send_another ?? 'Send another message'}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-[28px] border border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/75 px-7 py-8 flex flex-col gap-6 h-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-mono text-zinc-400 dark:text-zinc-300/60 uppercase tracking-[0.2em] mb-1">
                        {t?.contact?.form_new ?? 'New request'}
                      </p>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                        {t?.contact?.form_title ?? 'Ticket details'}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <p className="text-[12px] font-mono text-zinc-400 dark:text-zinc-300/60 uppercase tracking-[0.15em]">
                        {t?.contact?.priority ?? 'Priority'}
                      </p>
                      <div className="flex gap-1">
                        {(['exploring', 'soon', 'asap'] as Urgency[]).map((u) => {
                          const isActive = form.urgency === u
                          const c = URGENCY_COLOURS[u]
                          return (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, urgency: u }))}
                              className="px-3 py-1.5 rounded-full text-[11px] font-mono border transition-all duration-200"
                              style={
                                isActive
                                  ? { backgroundColor: c + '20', borderColor: c + '60', color: c }
                                  : {
                                      backgroundColor: 'transparent',
                                      borderColor: 'rgba(161,161,170,0.25)',
                                      color: 'rgba(228,228,231,0.70)',
                                    }
                              }
                            >
                              {urgencyLabel(u)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-800/80 my-1" />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-mono text-zinc-500 dark:text-zinc-300/70 uppercase tracking-[0.15em]">
                      {t?.contact?.field_email ?? 'Contact handle'} <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t?.contact?.field_email_placeholder ?? 'your@email.com'}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-mono text-zinc-500 dark:text-zinc-300/70 uppercase tracking-[0.15em]">
                      {t?.contact?.field_subject ?? 'What can I help you with?'}
                    </label>
                    <input
                      type="text"
                      placeholder={t?.contact?.field_subject_placeholder ?? 'e.g. Frontend role at Acme Corp'}
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-mono text-zinc-500 dark:text-zinc-300/70 uppercase tracking-[0.15em]">
                        {t?.contact?.field_message ?? 'Describe your request'} <span className="text-[#00E5FF]">*</span>
                      </label>

                      <AnimatePresence>
                        {isTyping && (
                          <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} className="flex items-center gap-2">
                            <span className="text-[12px] font-mono text-[#00E5FF] tracking-wide">{t?.contact?.building ?? 'building ticket'}</span>
                            <span className="flex gap-1">
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
                      required
                      rows={5}
                      placeholder={t?.contact?.field_message_placeholder ?? ''}
                      value={form.message}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all resize-none"
                    />

                    {/* ✅ dark counter brighter */}
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-300/60">
                      <span>{t?.contact?.char_limit ?? 'Up to 900 characters'}</span>
                      <span className={charLeft <= 0 ? 'text-red-400' : ''}>
                        {charCount} / {MESSAGE_MAX}
                      </span>
                    </div>
                  </div>

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
                          borderColor: form.attachPortfolio ? '#00E5FF80' : 'rgba(161,161,170,0.35)',
                        }}
                      >
                        <div
                          className="absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: form.attachPortfolio ? '#00E5FF' : 'rgba(228,228,231,0.55)',
                            left: form.attachPortfolio ? '17px' : '1px',
                          }}
                        />
                      </div>

                      {/* ✅ dark toggle label brighter */}
                      <span className="text-[13px] font-mono text-zinc-600 dark:text-zinc-300/75 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {t?.contact?.attach_toggle ?? 'Attach a CV / portfolio link'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {form.attachPortfolio && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <input
                            type="url"
                            placeholder={t?.contact?.attach_placeholder ?? 'https://your-portfolio.com'}
                            value={form.portfolioUrl}
                            onChange={(e) => setForm((f) => ({ ...f, portfolioUrl: e.target.value }))}
                            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3.5 text-[14px] font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] transition-all"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {submitError && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] font-mono text-red-400">
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !form.email.trim() || !form.message.trim()}
                    onHoverStart={() => setHovering(true)}
                    onHoverEnd={() => setHovering(false)}
                    whileTap={{ scale: 0.97 }}
                    className="
                      mt-2 w-full rounded-full py-4
                      font-mono text-[13px] font-semibold tracking-[0.25em]
                      bg-[#00E5FF] text-black
                      shadow-[0_10px_25px_rgba(0,229,255,0.25)]
                      hover:shadow-[0_0_35px_rgba(0,229,255,0.6)]
                      transition-all duration-300
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

                    {isSubmitting ? submitLoading : hovering ? submitHover : submitIdle}
                  </motion.button>

                  {/* ✅ dark footer note brighter */}
                  <p className="text-[13px] font-mono text-zinc-400 dark:text-zinc-300/70 text-center mt-3">
                    {t?.contact?.footer_note ?? ''}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-6 xl:px-0 mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* ✅ dark footer brighter */}
          <p className="text-[13px] font-mono text-zinc-500 dark:text-zinc-300/70 tracking-[0.08em]">
            © {year} Sankalpa Neupane. {t?.contact?.footer_rights ?? ''}
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/sankalpaneupane7/"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-mono text-zinc-500 dark:text-zinc-300/70 hover:text-[#00E5FF] transition-colors tracking-[0.08em]"
            >
              LinkedIn
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <a
              href="https://github.com/Sankalpa7"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-mono text-zinc-500 dark:text-zinc-300/70 hover:text-[#00E5FF] transition-colors tracking-[0.08em]"
            >
              GitHub
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <a
              href="mailto:sankalpaneupane7@gmail.com"
              className="text-[13px] font-mono text-zinc-500 dark:text-zinc-300/70 hover:text-[#00E5FF] transition-colors tracking-[0.08em]"
            >
              Email
            </a>
          </div>

          {/* ✅ dark footer brighter */}
          <p className="text-[13px] font-mono text-zinc-500 dark:text-zinc-300/70 tracking-[0.08em]">
            {t?.contact?.footer_built ?? 'Built with Next.js & Tailwind'}
          </p>
        </div>
      </div>
    </section>
  )
}