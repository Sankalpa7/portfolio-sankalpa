import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, subject, message, urgency, category, portfolioUrl, ticketId } =
      await req.json()

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'sankalpaneupane7@gmail.com',
      replyTo: email,
      subject: `[${ticketId}] ${subject || category || 'New message'} — ${urgency}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#09090b;color:#e4e4e7;border-radius:16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
            <div style="width:8px;height:8px;border-radius:50%;background:#06b6d4;"></div>
            <span style="color:#06b6d4;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">New ticket · Portfolio</span>
          </div>

          <h2 style="color:#ffffff;font-size:22px;margin:0 0 4px 0;">
            ${subject || category || 'New message'}
          </h2>
          <p style="color:#52525b;font-size:12px;margin:0 0 28px 0;">${ticketId}</p>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;color:#71717a;width:130px;border-bottom:1px solid #27272a;">From</td>
              <td style="padding:10px 0;color:#e4e4e7;border-bottom:1px solid #27272a;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#71717a;border-bottom:1px solid #27272a;">Category</td>
              <td style="padding:10px 0;color:#06b6d4;border-bottom:1px solid #27272a;">${category || '—'}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#71717a;border-bottom:1px solid #27272a;">Priority</td>
              <td style="padding:10px 0;color:#e4e4e7;border-bottom:1px solid #27272a;">${urgency}</td>
            </tr>
            ${
              portfolioUrl
                ? `<tr>
              <td style="padding:10px 0;color:#71717a;">Portfolio / CV</td>
              <td style="padding:10px 0;"><a href="${portfolioUrl}" style="color:#06b6d4;">${portfolioUrl}</a></td>
            </tr>`
                : ''
            }
          </table>

          <div style="background:#18181b;border-radius:10px;border-left:3px solid #06b6d4;padding:20px;margin-bottom:28px;">
            <p style="color:#71717a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px 0;">Message</p>
            <p style="color:#e4e4e7;font-size:14px;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
          </div>

          <p style="color:#3f3f46;font-size:11px;margin:0;">
            Hit <strong style="color:#52525b;">Reply</strong> to respond directly to ${email}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}