import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Vitest hoists vi.mock calls — use vi.hoisted() for variables used in factories
const mockSignIn = vi.hoisted(() => vi.fn())
const mockRouterPush = vi.hoisted(() => vi.fn())

vi.mock('next-auth/react', () => ({
  signIn: mockSignIn,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}))

import LoginForm from '../LoginForm'

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email field, password field, and submit button', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('disables button and shows "Entrando…" while pending', async () => {
    // signIn never resolves — stays pending
    mockSignIn.mockReturnValue(new Promise(() => {}))

    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')
    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveTextContent(/entrando/i)
    })
  })

  it('shows "Credenciales incorrectas" and clears password on auth failure', async () => {
    mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' })

    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)

    await user.type(emailInput, 'admin@test.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/credenciales incorrectas/i)
    })

    // Password cleared, email kept
    expect(passwordInput).toHaveValue('')
    expect(emailInput).toHaveValue('admin@test.com')
  })

  it('redirects to /admin on successful login', async () => {
    mockSignIn.mockResolvedValue({ error: null })

    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'correctpassword')
    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/admin')
    })
  })
})
