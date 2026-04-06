import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '../Contact'

vi.mock('@/app/actions/contact', () => ({
  sendContactEmail: vi.fn(),
}))

import { sendContactEmail } from '@/app/actions/contact'

const mockSend = vi.mocked(sendContactEmail)

describe('Contact', () => {
  it('muestra error de validación cuando los campos están vacíos', async () => {
    render(<Contact />)
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    await userEvent.click(submitButton)
    expect(await screen.findByText(/obligatorio/i)).toBeInTheDocument()
  })

  it('muestra confirmación después de envío exitoso', async () => {
    mockSend.mockResolvedValueOnce({ success: true })
    render(<Contact />)

    await userEvent.type(screen.getByLabelText(/nombre/i), 'Seba')
    await userEvent.type(screen.getByLabelText(/email/i), 'seba@test.com')
    await userEvent.type(screen.getByLabelText(/mensaje/i), 'Quiero trabajar con vos')
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }))

    expect(await screen.findByText(/enviado/i)).toBeInTheDocument()
  })

  it('muestra error cuando el server action falla', async () => {
    mockSend.mockResolvedValueOnce({ success: false, error: 'Error de red' })
    render(<Contact />)

    await userEvent.type(screen.getByLabelText(/nombre/i), 'Seba')
    await userEvent.type(screen.getByLabelText(/email/i), 'seba@test.com')
    await userEvent.type(screen.getByLabelText(/mensaje/i), 'Mensaje de prueba')
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }))

    expect(await screen.findByText(/error de red/i)).toBeInTheDocument()
  })
})
