import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, company, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    await resend.emails.send({
      from: 'contact@upsera.co.in',
      to: 'upseramedia@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <h2>New UPSERA Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to send' })
  }
}