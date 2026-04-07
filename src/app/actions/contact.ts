'use server'

import { resend } from '@/lib/resend'

interface ContactPayload {
  name: string
  email: string
  message: string
}

interface ContactResult {
  success: boolean
  error?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendContactEmail(payload: ContactPayload): Promise<ContactResult> {
  const { name, email, message } = payload

  if (!name.trim()) return { success: false, error: 'El nombre es obligatorio.' }
  if (!email.trim()) return { success: false, error: 'El email es obligatorio.' }
  if (!EMAIL_REGEX.test(email)) return { success: false, error: 'El formato del email no es válido.' }
  if (!message.trim()) return { success: false, error: 'El mensaje es obligatorio.' }

  const { data, error } = await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL ?? 'spanolocabo@gmail.com',
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
  })

  if (error || !data) {
    console.error('[Resend error]', error)
    return { success: false, error: 'No se pudo enviar el mensaje. Intentá de nuevo más tarde.' }
  }

  return { success: true }
}
