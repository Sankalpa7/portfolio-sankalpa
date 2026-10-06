"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n/LangContext";

type Category = "Job Opportunity" | "Collaboration" | "Question";
type Urgency = "Just exploring" | "Soon" | "ASAP";

type FormState = {
  email: string;
  subject: string;
  message: string;
  urgency: Urgency;
  portfolioUrl: string;
  attachPortfolio: boolean;
  category: Category | "";
};

const MESSAGE_MAX = 900;

const INITIAL_FORM: FormState = {
  email: "",
  subject: "",
  message: "",
  urgency: "Just exploring",
  portfolioUrl: "",
  attachPortfolio: false,
  category: "",
};

const CATEGORIES: Category[] = ["Job Opportunity", "Collaboration", "Question"];

const CATEGORY_ICONS: Record<Category, string> = {
  "Job Opportunity": "💼",
  Collaboration: "🤝",
  Question: "💬",
};

const URGENCY_OPTIONS: Urgency[] = ["Just exploring", "Soon", "ASAP"];

const URGENCY_COLOURS: Record<Urgency, string> = {
  "Just exploring": "#22c55e",
  Soon: "#f59e0b",
  ASAP: "#ef4444",
};

const CARD =
  "rounded-[28px] border border-zinc-200 bg-white/85 dark:border-zinc-800 dark:bg-zinc-950/70";
const INPUT =
  "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 font-mono text-[14px] text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#00E5FF80] focus:ring-2 focus:ring-[#00E5FF30] dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder-zinc-600";
const LABEL = "font-mono text-[12px] uppercase tracking-[0.15em] text-zinc-500";

// Generated only inside effects/handlers, never during render (no hydration mismatch)
function generateTicketId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SNK-${new Date().getFullYear()}-${n}`;
}

function ConfettiBurst() {
  const colours = [
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#f43f5e",
    "#ffffff",
  ];
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
      aria-hidden="true"
    >
      {Array.from({ length: 18 }, (_, i) => {
        const size = 4 + (i % 4);
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 rounded-sm"
            style={{
              left: `${10 + ((i * 5) % 80)}%`,
              width: size,
              height: size,
              backgroundColor: colours[i % colours.length],
            }}
            initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              y: [-10, -80 - (i % 3) * 30],
              opacity: [1, 1, 0],
              rotate: [0, i % 2 === 0 ? 180 : -180],
              scale: [1, 0.6],
            }}
            transition={{ duration: 1.2, delay: i * 0.07, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          aria-hidden="true"
        >
          {icon}
        </svg>
      </div>
      <span className="font-mono text-[13px] text-zinc-600 dark:text-zinc-400">
        {label}{" "}
        <span className="text-zinc-900 dark:text-zinc-200">{value}</span>
      </span>
    </div>
  );
}

export default function Contact() {
  const { t, locale } = useLang();
  const isFI = locale === "fi";

  // Loosely typed read of the contact translations: a string if present, else the fallback
  const c = ((t as unknown as { contact?: Record<string, unknown> })?.contact ??
    {}) as Record<string, unknown>;
  const tx = (key: string, en: string, fi: string) => {
    const v = c[key];
    return typeof v === "string" ? v : isFI ? fi : en;
  };
  const group = (key: string) =>
    (c[key] ?? {}) as Record<string, string | undefined>;

  const catLabel = (cat: Category) => {
    const m = group("categories");
    if (cat === "Job Opportunity")
      return m.job ?? (isFI ? "Työmahdollisuus" : "Job Opportunity");
    if (cat === "Collaboration")
      return m.collab ?? (isFI ? "Yhteistyö" : "Collaboration");
    return m.question ?? (isFI ? "Kysymys" : "Question");
  };

  const urgencyLabel = (u: Urgency) => {
    const m = group("urgency");
    if (u === "Just exploring")
      return m.explore ?? (isFI ? "Vain kartoitan" : "Just exploring");
    if (u === "Soon") return m.soon ?? (isFI ? "Pian" : "Soon");
    return m.asap ?? (isFI ? "Heti" : "ASAP");
  };

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [lastTicketId, setLastTicketId] = useState("");
  const [hovering, setHovering] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canSubmit = form.email.trim() !== "" && form.message.trim() !== "";

  useEffect(() => {
    const id = generateTicketId();
    setTicketId(id);
    setLastTicketId(id);
  }, []);

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    };
  }, []);

  // Bring the section into view after a successful send (respects scroll-padding-top)
  useEffect(() => {
    if (!submitted) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitted]);

  const handleMessageChange = (val: string) => {
    setForm((f) => ({ ...f, message: val.slice(0, MESSAGE_MAX) }));
    setIsTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 1200);
  };

  const toggleCategory = (cat: Category) => {
    setForm((f) => ({ ...f, category: f.category === cat ? "" : cat }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !canSubmit) return;

    setIsSubmitting(true);
    setSubmitError("");
    const id = ticketId || generateTicketId();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          urgency: form.urgency,
          category: form.category,
          portfolioUrl: form.attachPortfolio ? form.portfolioUrl.trim() : "",
          ticketId: id,
        }),
      });

      if (!res.ok) {
        setSubmitError(
          res.status === 400
            ? tx(
                "error_invalid",
                "Please check your email address and message, then try again.",
                "Tarkista sähköpostiosoite ja viesti ja yritä uudelleen.",
              )
            : tx(
                "error_msg",
                "Message failed to send. Please try again in a moment.",
                "Viestin lähetys epäonnistui. Yritä uudelleen hetken kuluttua.",
              ),
        );
        return;
      }

      setLastTicketId(id);
      setSubmitted(true);
      setShowConfetti(true);
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
      confettiTimer.current = setTimeout(() => setShowConfetti(false), 1800);
    } catch {
      setSubmitError(
        tx(
          "error_msg",
          "Message failed to send. Please try again in a moment.",
          "Viestin lähetys epäonnistui. Yritä uudelleen hetken kuluttua.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const id = generateTicketId();
    setTicketId(id);
    setLastTicketId(id);
    setForm(INITIAL_FORM);
    setSubmitError("");
    setSubmitted(false);
  };

  const submitIdle = tx("submit_idle", "SEND", "LÄHETÄ");
  const submitHover = tx("submit_hover", "SENDING", "LÄHETETÄÄN");
  const submitLoading = tx("submit_loading", "SENDING", "LÄHETETÄÄN");
  const emailPh = tx(
    "field_email_placeholder",
    "you@example.com",
    "sinun@email.fi",
  );
  const subjectPh = tx("field_subject_placeholder", "Subject…", "Aihe…");
  const messagePh = tx(
    "field_message_placeholder",
    "Write your message…",
    "Kirjoita viestisi…",
  );
  const attachPh = tx(
    "attach_placeholder",
    "Portfolio URL (optional)",
    "Portfolio-linkki (valinnainen)",
  );

  const activity = [
    {
      dot: "#22c55e",
      text: tx(
        "activity_1",
        "Master's thesis in progress",
        "Pro gradu käynnissä",
      ),
    },
    {
      dot: "#06b6d4",
      text: tx(
        "activity_2",
        "Actively seeking cloud / IT roles",
        "Haen pilvi-/IT-rooleja",
      ),
    },
    {
      dot: "#8b5cf6",
      text: tx("activity_3", "Portfolio v2 shipped", "Portfolio v2 julkaistu"),
    },
  ];

  const links = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sankalpaneupane7/",
      colour: "#0ea5e9",
    },
    {
      label: "GitHub",
      href: "https://github.com/Sankalpa7",
      colour: "#8b5cf6",
    },
    {
      label: "Email",
      href: "mailto:sankalpaneupane7@gmail.com",
      colour: "#06b6d4",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-[#f5f5f5] py-24 dark:bg-[#050505]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-1/4 top-[-60px] h-[440px] w-[440px] rounded-full bg-cyan-500/8 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute bottom-[-80px] left-1/4 h-[360px] w-[360px] rounded-full bg-violet-500/6 blur-3xl dark:bg-violet-500/8" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-6 xl:px-0">
        {/* heading */}
        <div className="mb-3 flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.25em] text-cyan-500">
            {tx("section", "// 06", "// 06")}
          </span>
          <div className="h-px w-10 bg-cyan-500" />
          <h2 className="font-syne text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {tx("title", "Contact", "Yhteys")}
          </h2>
          <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
        </div>

        <p className="mb-12 max-w-xl font-mono text-xs text-zinc-700 dark:text-zinc-400 md:text-sm">
          {tx(
            "subtitle",
            "Send a message — I’ll get back to you as soon as possible.",
            "Lähetä viesti — vastaan mahdollisimman pian.",
          )}
        </p>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] xl:gap-16">
          {/* LEFT */}
          <div className="flex h-full flex-col gap-4">
            <div className={`${CARD} relative overflow-hidden px-7 py-7`}>
              <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" />

              <div className="mb-5 flex items-center gap-2">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  {tx("status", "Available", "Saatavilla")}
                </span>
              </div>

              <h3 className="mb-1 font-syne text-xl font-bold leading-snug text-zinc-900 dark:text-white md:text-2xl">
                {tx("heading_line1", "Let’s connect", "Otetaan yhteyttä")}
                <br />
                <span className="text-[#00E5FF]">
                  {tx("heading_name", "Sankalpa", "Sankalpa")}
                </span>
              </h3>
              <p className="mb-7 font-mono text-[13px] text-zinc-500 dark:text-zinc-400">
                {tx(
                  "heading_sub",
                  "Pick a category and send a message.",
                  "Valitse aihe ja lähetä viesti.",
                )}
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = form.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-mono text-[12px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      style={
                        isActive
                          ? {
                              backgroundColor: "#00E5FF20",
                              borderColor: "#00E5FF70",
                              color: "#00E5FF",
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: "rgba(161,161,170,0.25)",
                              color: "rgba(161,161,170,0.7)",
                            }
                      }
                    >
                      <span aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                      {catLabel(cat)}
                    </button>
                  );
                })}
              </div>

              <div className="mb-6 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />

              <div className="mb-7 flex flex-col gap-3.5">
                <InfoRow
                  icon={
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </>
                  }
                  label={tx("sla_reply", "Reply time:", "Vastausaika:")}
                  value={tx("sla_reply_val", "24–48h", "24–48h")}
                />
                <InfoRow
                  icon={
                    <>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </>
                  }
                  label={tx("sla_preferred", "Preferred:", "Mieluiten:")}
                  value={tx("sla_preferred_val", "Email", "Sähköposti")}
                />
                <InfoRow
                  icon={
                    <>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </>
                  }
                  label={tx("sla_based", "Based in:", "Sijainti:")}
                  value={tx("sla_based_val", "Finland", "Suomi")}
                />
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                  {tx("ticket_id", "Ticket", "Tunnus")}
                </span>
                <span className="font-mono text-[13px] tracking-[0.15em] text-[#00E5FF]">
                  {ticketId || "…"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white/85 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/70">
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em] text-zinc-400">
                {tx("activity_title", "Currently", "Tällä hetkellä")}
              </p>
              <div className="flex flex-col gap-2">
                {activity.map((item) => (
                  <div key={item.dot} className="flex items-center gap-2.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.dot }}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[13px] text-zinc-600 dark:text-zinc-400">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/85 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/70">
              <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                {tx("reach", "Reach", "Tavoita")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full border px-3.5 font-mono text-[12px] transition-all duration-200 hover:scale-[1.04]"
                    style={{
                      borderColor: l.colour + "50",
                      color: l.colour,
                      backgroundColor: l.colour + "10",
                    }}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative h-full">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`${CARD} relative flex h-full flex-col items-center overflow-hidden px-8 py-12 text-center`}
                >
                  {showConfetti && <ConfettiBurst />}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 14,
                      delay: 0.1,
                    }}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      border: "1px solid #00E5FF50",
                      backgroundColor: "#00E5FF15",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-2 font-syne text-2xl font-bold text-zinc-900 dark:text-white"
                  >
                    {tx("success_title", "Message sent!", "Viesti lähetetty!")}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="mb-6 max-w-xs font-mono text-[13px] text-zinc-500 dark:text-zinc-400"
                  >
                    {tx(
                      "success_sub",
                      "I’ll get back to you soon. Keep an eye on your inbox.",
                      "Palaan asiaan pian. Tarkista sähköpostisi.",
                    )}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36 }}
                    className="mb-8 rounded-full px-5 py-2.5 font-mono text-[13px] tracking-[0.15em]"
                    style={{
                      border: "1px solid #00E5FF50",
                      color: "#00E5FF",
                      backgroundColor: "#00E5FF0F",
                    }}
                  >
                    {tx("success_ref", "Reference:", "Tunnus:")} {lastTicketId}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.44 }}
                    className="mb-10 font-mono text-[13px] italic text-zinc-400"
                  >
                    {tx(
                      "success_quote",
                      "“Thank you for reaching out. – Sankalpa”",
                      "“Kiitos yhteydenotosta. – Sankalpa”",
                    )}
                  </motion.p>

                  <motion.button
                    type="button"
                    onClick={handleReset}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 rounded-full border border-[rgba(161,161,170,0.3)] px-6 py-3 font-mono text-[12px] text-[rgba(161,161,170,0.7)] transition-colors duration-200 hover:border-[#00E5FF] hover:text-[#00E5FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                    </svg>
                    {tx(
                      "send_another",
                      "Send another message",
                      "Lähetä uusi viesti",
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`${CARD} flex h-full flex-col gap-6 px-7 py-8`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 font-mono text-[12px] uppercase tracking-[0.2em] text-zinc-400">
                        {tx("form_new", "New message", "Uusi viesti")}
                      </p>
                      <h3 className="font-syne text-lg font-bold text-zinc-900 dark:text-white">
                        {tx("form_title", "Send a message", "Lähetä viesti")}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-zinc-400">
                        {tx("priority", "Priority", "Prioriteetti")}
                      </p>
                      <div className="flex gap-1">
                        {URGENCY_OPTIONS.map((u) => {
                          const isActive = form.urgency === u;
                          return (
                            <button
                              key={u}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() =>
                                setForm((f) => ({ ...f, urgency: u }))
                              }
                              className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                              style={
                                isActive
                                  ? {
                                      backgroundColor:
                                        URGENCY_COLOURS[u] + "20",
                                      borderColor: URGENCY_COLOURS[u] + "60",
                                      color: URGENCY_COLOURS[u],
                                    }
                                  : {
                                      backgroundColor: "transparent",
                                      borderColor: "rgba(161,161,170,0.2)",
                                      color: "rgba(161,161,170,0.5)",
                                    }
                              }
                            >
                              {urgencyLabel(u)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />

                  {/* email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className={LABEL}>
                      {tx("field_email", "Email", "Sähköposti")}{" "}
                      <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={254}
                      placeholder={emailPh}
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className={INPUT}
                    />
                  </div>

                  {/* subject */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className={LABEL}>
                      {tx("field_subject", "Subject", "Aihe")}
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      maxLength={150}
                      placeholder={
                        form.category ? catLabel(form.category) : subjectPh
                      }
                      value={form.subject}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      className={INPUT}
                    />
                  </div>

                  {/* message */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="contact-message" className={LABEL}>
                        {tx("field_message", "Message", "Viesti")}{" "}
                        <span className="text-[#00E5FF]">*</span>
                      </label>

                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, x: 6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 6 }}
                            className="flex items-center gap-1.5"
                            aria-hidden="true"
                          >
                            <span className="font-mono text-[12px] tracking-wide text-[#00E5FF]">
                              {tx("building", "Typing", "Kirjoitetaan")}
                            </span>
                            <span className="flex gap-0.5">
                              {[0, 1, 2].map((i) => (
                                <motion.span
                                  key={i}
                                  className="inline-block h-1 w-1 rounded-full bg-[#00E5FF]"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                  }}
                                />
                              ))}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      maxLength={MESSAGE_MAX}
                      placeholder={messagePh}
                      value={form.message}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      className={`${INPUT} resize-none`}
                    />
                    <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                      <span>
                        {tx("chars_up_to", "Up to", "Enintään")} {MESSAGE_MAX}{" "}
                        {tx("chars_label", "characters", "merkkiä")}
                      </span>
                      <span
                        className={
                          form.message.length >= MESSAGE_MAX
                            ? "text-red-400"
                            : ""
                        }
                      >
                        {form.message.length} / {MESSAGE_MAX}
                      </span>
                    </div>
                  </div>

                  {/* attach portfolio */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.attachPortfolio}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          attachPortfolio: !f.attachPortfolio,
                        }))
                      }
                      className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      <div
                        className="relative h-5 w-9 rounded-full border transition-all duration-300"
                        style={{
                          backgroundColor: form.attachPortfolio
                            ? "#00E5FF30"
                            : "transparent",
                          borderColor: form.attachPortfolio
                            ? "#00E5FF80"
                            : "rgba(161,161,170,0.3)",
                        }}
                      >
                        <div
                          className="absolute top-0.5 h-4 w-4 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: form.attachPortfolio
                              ? "#00E5FF"
                              : "rgba(161,161,170,0.5)",
                            left: form.attachPortfolio ? "17px" : "1px",
                          }}
                        />
                      </div>
                      <span className="font-mono text-[13px] text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                        {tx(
                          "attach_toggle",
                          "Attach portfolio link",
                          "Liitä portfolio-linkki",
                        )}
                      </span>
                    </button>

                    <AnimatePresence>
                      {form.attachPortfolio && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {/* type="text": the browser's url check rejects "example.com"; the API adds https:// */}
                          <input
                            type="text"
                            inputMode="url"
                            autoComplete="url"
                            maxLength={300}
                            aria-label={attachPh}
                            placeholder={attachPh}
                            value={form.portfolioUrl}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                portfolioUrl: e.target.value,
                              }))
                            }
                            className={INPUT}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* error banner */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-[12px] text-red-400"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !canSubmit}
                    onHoverStart={() => setHovering(true)}
                    onHoverEnd={() => setHovering(false)}
                    whileTap={{ scale: 0.97 }}
                    className="relative mt-2 w-full overflow-hidden rounded-full bg-[#00E5FF] py-4 font-mono text-[13px] font-semibold tracking-[0.25em] text-black shadow-[0_10px_25px_rgba(0,229,255,0.25)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <AnimatePresence>
                      {hovering && !isSubmitting && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>

                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black"
                        />
                        {submitLoading}
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

                  <p className="mt-3 text-center font-mono text-[13px] text-zinc-400">
                    {tx(
                      "footer_note",
                      "I don’t store your data — the message is sent via email only.",
                      "En tallenna tietojasi — viesti lähetetään vain sähköpostina.",
                    )}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mx-auto mt-20 max-w-6xl border-t border-zinc-200 px-6 pt-8 dark:border-zinc-700 md:px-10 lg:px-6 xl:px-0">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[13px] tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            Sankalpa Neupane.{" "}
            {tx(
              "footer_rights",
              "All rights reserved.",
              "Kaikki oikeudet pidätetään.",
            )}
          </p>
          <div className="flex items-center gap-5">
            {links.map((l, i) => (
              <span key={l.label} className="flex items-center gap-5">
                {i > 0 && (
                  <span
                    className="-ml-5 mr-0 text-zinc-300 dark:text-zinc-600"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
                <a
                  href={l.href}
                  target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="font-mono text-[13px] tracking-[0.08em] text-zinc-500 transition-colors hover:text-[#00E5FF] dark:text-zinc-400"
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
          <p className="font-mono text-[13px] tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
            {tx(
              "built_with",
              "Built with Next.js & Tailwind",
              "Built with Next.js & Tailwind",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
