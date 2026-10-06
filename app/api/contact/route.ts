import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'sankalpaneupane7@gmail.com'
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ')

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const toSafeUrl = (value: string) => {
  if (!value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = clean(body.email, 254)
  const message = clean(body.message, 5000)
  const subject = singleLine(clean(body.subject, 150))
  const category = singleLine(clean(body.category, 60))
  const urgency = singleLine(clean(body.urgency, 30)) || 'normal'
  const portfolioUrl = toSafeUrl(clean(body.portfolioUrl, 300))
  const ticketId =
    singleLine(clean(body.ticketId, 40)) || `TKT-${Date.now().toString(36).toUpperCase()}`

  if (!email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const title = subject || category || 'New message'

  const html = `
    <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#09090b;color:#e4e4e7;border-radius:16px;">
      <p style="color:#06b6d4;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 24px 0;">
        ● New ticket · Portfolio
      </p>

      <h2 style="color:#ffffff;font-size:22px;margin:0 0 4px 0;">${escapeHtml(title)}</h2>
      <p style="color:#52525b;font-size:12px;margin:0 0 28px 0;">${escapeHtml(ticketId)}</p>

      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
        <tr>
          <td style="padding:10px 0;color:#71717a;width:130px;border-bottom:1px solid #27272a;">From</td>
          <td style="padding:10px 0;color:#e4e4e7;border-bottom:1px solid #27272a;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#71717a;border-bottom:1px solid #27272a;">Category</td>
          <td style="padding:10px 0;color:#06b6d4;border-bottom:1px solid #27272a;">${escapeHtml(category || '—')}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#71717a;border-bottom:1px solid #27272a;">Priority</td>
          <td style="padding:10px 0;color:#e4e4e7;border-bottom:1px solid #27272a;">${escapeHtml(urgency)}</td>
        </tr>
        ${
          portfolioUrl
            ? `<tr>
          <td style="padding:10px 0;color:#71717a;">Portfolio / CV</td>
          <td style="padding:10px 0;"><a href="${escapeHtml(portfolioUrl)}" style="color:#06b6d4;">${escapeHtml(portfolioUrl)}</a></td>
        </tr>`
            : ''
        }
      </table>

      <div style="background:#18181b;border-radius:10px;border-left:3px solid #06b6d4;padding:20px;margin-bottom:28px;">
        <p style="color:#71717a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px 0;">Message</p>
        <p style="color:#e4e4e7;font-size:14px;line-height:1.7;white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
      </div>

      <p style="color:#3f3f46;font-size:11px;margin:0;">
        Hit <strong style="color:#52525b;">Reply</strong> to respond directly to ${escapeHtml(email)}
      </p>
    </div>
  `

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[${ticketId}] ${title} — ${urgency}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}