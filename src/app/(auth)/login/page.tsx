// Server component — metadata + renders LoginForm
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import LoginForm from './LoginForm'

// Keep this page off search engines — the admin panel is a secret easter egg
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage() {
  // Redirect authenticated users straight to admin
  const session = await auth()
  if (session) redirect('/admin')

  return <LoginForm />
}
