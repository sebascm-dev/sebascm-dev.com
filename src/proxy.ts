// Next.js 16 proxy (formerly middleware.ts) — edge-safe
// Named export `proxy` is required (not `middleware`, not default export)
import NextAuth from 'next-auth'
import { authConfig } from './lib/auth.config'

const { auth } = NextAuth(authConfig)

export const proxy = auth

export const config = {
  matcher: ['/admin/:path*'],
}
