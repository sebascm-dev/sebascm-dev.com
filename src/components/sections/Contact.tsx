'use client'

import { useState } from 'react'
import { sendContactEmail } from '@/app/actions/contact'
import { about } from '@/data/about'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import { HiDocumentArrowDown } from 'react-icons/hi2'

interface FormState {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [fieldError, setFieldError] = useState<string>('')

  const validate = (): string => {
    if (!form.name.trim()) return 'El nombre es obligatorio.'
    if (!form.email.trim()) return 'El email es obligatorio.'
    if (!form.message.trim()) return 'El mensaje es obligatorio.'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setFieldError(validationError)
      return
    }
    setFieldError('')
    setStatus('loading')

    const result = await sendContactEmail(form)

    if (result.success) {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Error desconocido.')
    }
  }

  return (
    <section id="contacto" className="py-24 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-sm text-[var(--accent)] mb-12 tracking-widest uppercase">
          Contacto
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              ¿Hablamos?
            </h2>
            <p className="text-[var(--foreground)]/60 leading-relaxed mb-8">
              Estoy buscando mi primera oportunidad profesional como desarrollador web junior. Si tenés un proyecto, una oferta o simplemente querés charlar, escribime.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <SiGithub size={18} /> GitHub
              </a>
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <FaLinkedin size={18} /> LinkedIn
              </a>
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-3 text-sm text-[var(--accent)] hover:opacity-80 transition-opacity"
              >
                <HiDocumentArrowDown size={18} /> Descargar CV
              </a>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-lg font-semibold text-[var(--accent)]">¡Mensaje enviado!</p>
                <p className="text-sm text-[var(--foreground)]/60 mt-2">
                  Te respondo a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-[var(--foreground)]/50 uppercase tracking-wider mb-2">
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[var(--foreground)]/50 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-[var(--foreground)]/50 uppercase tracking-wider mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                    placeholder="Contame en qué puedo ayudarte..."
                  />
                </div>

                {fieldError && (
                  <p className="text-sm text-red-400">{fieldError}</p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-400">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-[var(--accent)] text-[var(--background)] font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
