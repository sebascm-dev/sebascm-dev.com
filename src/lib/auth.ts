// Node.js only — NOT imported by proxy.ts
// Contains bcryptjs (Node.js dependency) and full Credentials provider
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Return null on any failure — never throw, never reveal details
        if (!credentials?.email || !credentials?.password) return null

        if (credentials.email !== process.env.ADMIN_EMAIL) return null

        const hash = process.env.ADMIN_PASSWORD_HASH
        if (!hash) return null

        const valid = await bcrypt.compare(credentials.password as string, hash)
        if (!valid) return null

        // Return minimal user object on success
        return { id: '1', email: credentials.email as string, name: 'Admin' }
      },
    }),
  ],
  session: { strategy: 'jwt' },
})
