// Edge-safe auth config — NO Node.js imports (no bcryptjs, no file system)
// This file is used by proxy.ts which runs at the Edge runtime.
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      if (isOnAdmin) {
        // Protect all /admin/* routes — must be authenticated
        return isLoggedIn
      }

      // All other routes are public
      return true
    },
  },
  // Providers are registered in auth.ts (Node.js only), not here
  providers: [],
}
