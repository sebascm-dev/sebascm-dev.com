'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// The secret sequence: l → o → g → i → n (case-insensitive)
const SECRET = ['l', 'o', 'g', 'i', 'n']
const TIMEOUT_MS = 2000

/**
 * Hidden easter egg: typing "login" anywhere on the portfolio routes
 * the user to /login — the secret admin panel entry point.
 *
 * Uses useRef for the buffer (zero re-renders on keystrokes).
 * Ignored when typing inside INPUT, TEXTAREA, SELECT, or contenteditable.
 */
export default function EasterEggListener() {
  const router = useRouter()
  // Buffer holds the last N keys typed (where N = SECRET.length)
  const bufferRef = useRef<string[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip modifier / special keys (length > 1 means Shift, Enter, ArrowUp, etc.)
      if (e.key.length !== 1) return

      // Skip when user is typing in a form field or contenteditable
      const target = e.target as HTMLElement
      const tag = target.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      const key = e.key.toLowerCase()

      // Reset idle timer
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        bufferRef.current = []
      }, TIMEOUT_MS)

      // Rolling buffer: append key and keep only the last N chars
      const next = [...bufferRef.current, key].slice(-SECRET.length)

      // On wrong key: reset buffer. But if the wrong key IS 'l', start fresh with ['l']
      const expectedKey = SECRET[bufferRef.current.length]
      if (key !== expectedKey) {
        bufferRef.current = key === 'l' ? ['l'] : []
        return
      }

      bufferRef.current = next

      // Check for match
      if (bufferRef.current.join('') === SECRET.join('')) {
        bufferRef.current = []
        if (timerRef.current) clearTimeout(timerRef.current)
        router.push('/login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [router])

  // Renders nothing — pure side-effect component
  return null
}
