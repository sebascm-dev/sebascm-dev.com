import { describe, it, expect } from 'vitest'
import { authConfig } from '../auth.config'

// Helper to call the authorized callback
type AuthorizedParams = {
  auth: { user: { email: string } } | null
  request: { nextUrl: { pathname: string } }
}

function callAuthorized(params: AuthorizedParams): boolean {
  const callbacks = authConfig.callbacks as {
    authorized: (params: AuthorizedParams) => boolean
  }
  return callbacks.authorized(params)
}

describe('auth.config — authorized callback', () => {
  it('returns false for /admin route when there is no session', () => {
    const result = callAuthorized({
      auth: null,
      request: { nextUrl: { pathname: '/admin' } },
    })
    expect(result).toBe(false)
  })

  it('returns true for /admin route when user is authenticated', () => {
    const result = callAuthorized({
      auth: { user: { email: 'admin@test.com' } },
      request: { nextUrl: { pathname: '/admin' } },
    })
    expect(result).toBe(true)
  })

  it('returns true for public route "/" even without session', () => {
    const result = callAuthorized({
      auth: null,
      request: { nextUrl: { pathname: '/' } },
    })
    expect(result).toBe(true)
  })

  it('returns true for /login without session (public route)', () => {
    const result = callAuthorized({
      auth: null,
      request: { nextUrl: { pathname: '/login' } },
    })
    expect(result).toBe(true)
  })

  it('has signIn page set to /login', () => {
    expect(authConfig.pages?.signIn).toBe('/login')
  })

  it('has no Node.js-only providers (edge-safe)', () => {
    // The providers array should be empty in auth.config (edge-safe)
    expect(authConfig.providers).toHaveLength(0)
  })
})
