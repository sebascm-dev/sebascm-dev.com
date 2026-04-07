import { describe, it, expect, vi } from 'vitest'
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server'
// NOTE: Next.js 16 docs call this `unstable_doesProxyMatch` but this version ships
// the function as `unstable_doesMiddlewareMatch` (the middleware→proxy rename is
// partially rolled out — file convention changed but testing util name hasn't)

// Mock next-auth to avoid edge-runtime-only imports failing in jsdom
vi.mock('next-auth', () => ({
  default: () => ({ auth: vi.fn() }),
}))

vi.mock('../lib/auth.config', () => ({
  authConfig: { providers: [], pages: { signIn: '/login' } },
}))

// Import only the config export, not the proxy function itself
// (the proxy function depends on next-auth which has edge-only imports)
import { config } from '../proxy'

describe('proxy — matcher config', () => {
  it('matches /admin exactly', () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: '/admin',
      })
    ).toBe(true)
  })

  it('matches /admin/settings (nested path)', () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: '/admin/settings',
      })
    ).toBe(true)
  })

  it('does NOT match /login', () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: '/login',
      })
    ).toBe(false)
  })

  it('does NOT match / (root)', () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: '/',
      })
    ).toBe(false)
  })

  it('does NOT match /about', () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: '/about',
      })
    ).toBe(false)
  })
})
