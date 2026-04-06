import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock resend antes de importar el action
vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}))

import { sendContactEmail } from '../contact'
import { resend } from '@/lib/resend'

const mockSend = vi.mocked(resend.emails.send)

describe('sendContactEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna error cuando el nombre está vacío', async () => {
    const result = await sendContactEmail({ name: '', email: 'test@test.com', message: 'Hola' })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('retorna error cuando el email está vacío', async () => {
    const result = await sendContactEmail({ name: 'Seba', email: '', message: 'Hola' })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('retorna error cuando el mensaje está vacío', async () => {
    const result = await sendContactEmail({ name: 'Seba', email: 'test@test.com', message: '' })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('retorna error cuando el email tiene formato inválido', async () => {
    const result = await sendContactEmail({ name: 'Seba', email: 'no-es-un-email', message: 'Hola' })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('retorna success cuando los datos son válidos y Resend responde ok', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'email-123' }, error: null } as never)
    const result = await sendContactEmail({ name: 'Seba', email: 'seba@test.com', message: 'Quiero trabajar con vos' })
    expect(result.success).toBe(true)
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('retorna error cuando Resend falla', async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: { message: 'API error' } } as never)
    const result = await sendContactEmail({ name: 'Seba', email: 'seba@test.com', message: 'Mensaje válido' })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
