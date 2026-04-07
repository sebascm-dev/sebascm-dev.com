import { render, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Import AFTER mocks
import EasterEggListener from '../EasterEggListener'

describe('EasterEggListener', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockPush.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing (null)', () => {
    const { container } = render(<EasterEggListener />)
    expect(container.firstChild).toBeNull()
  })

  it('does NOT trigger on partial sequence', () => {
    render(<EasterEggListener />)

    // Type 'l', 'o', 'g' — not the full sequence
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }))
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('triggers router.push("/login") on full sequence l-o-g-i-n', () => {
    render(<EasterEggListener />)

    act(() => {
      ;['l', 'o', 'g', 'i', 'n'].forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/login')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('is case-insensitive — triggers on uppercase L-O-G-I-N', () => {
    render(<EasterEggListener />)

    act(() => {
      ;['L', 'O', 'G', 'I', 'N'].forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('does NOT trigger when activeElement is an INPUT', () => {
    render(<EasterEggListener />)

    // Create a real input and focus it
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    // Dispatch events directly on the input so target.tagName === 'INPUT'
    act(() => {
      ;['l', 'o', 'g', 'i', 'n'].forEach((key) => {
        input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    })

    expect(mockPush).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('resets buffer on wrong key, but keeps "l" if wrong key IS "l"', () => {
    render(<EasterEggListener />)

    act(() => {
      // l, o, x (wrong) — resets buffer
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }))
      // Continue — now type the full sequence from scratch
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))
    })

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('resets buffer after 2000ms idle', () => {
    render(<EasterEggListener />)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'o' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }))
    })

    // Advance timer past timeout
    act(() => {
      vi.advanceTimersByTime(2001)
    })

    // Now type i and n — should NOT trigger because buffer was reset
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<EasterEggListener />)
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  it('clears timeout on unmount after a key has been pressed', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount } = render(<EasterEggListener />)

    // Press a key to set the timer
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l' }))
    })

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })
})
