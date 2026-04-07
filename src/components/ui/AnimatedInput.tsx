'use client'

import { forwardRef, useRef, useImperativeHandle } from 'react'
import type { InputHTMLAttributes } from 'react'

const AnimatedInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (
    { className = '', type, value, style, placeholder, disabled, ...props },
    ref
  ) => {
    const displayValue = String(value ?? '')
    const inputRef = useRef<HTMLInputElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Sync external ref with internal ref
    useImperativeHandle(ref, () => inputRef.current!)

    const handleScroll = () => {
      if (overlayRef.current && inputRef.current) {
        overlayRef.current.scrollLeft = inputRef.current.scrollLeft
      }
    }

    const isPassword = type === 'password'

    // These classes affect how text is laid out. We must apply them to BOTH the real element AND the overlay.
    const contentClasses = (className.match(/\b(p[xylrtb]?-|text-|font-|tracking-|leading-|italic|antialiased)[\w.[/\]]+/g) ?? []).join(' ')
    // Container gets everything EXCEPT content classes, with focus: → focus-within:
    const containerClass = className
      .replace(/\bfocus:/g, 'focus-within:')
      .replace(/\b(p[xylrtb]?-|text-|font-|tracking-|leading-|italic|antialiased)[\w.[/\]]+/g, '')

    return (
      <div
        className={`relative ${containerClass} ${disabled ? 'opacity-40' : ''}`}
        style={{ transition: 'border-color 200ms ease', ...style }}
      >
        {/* Sets the container height — invisible */}
        <div className={`${contentClasses} pointer-events-none select-none invisible`} aria-hidden>
          &nbsp;
        </div>

        <div
          ref={overlayRef}
          className={`absolute inset-0 z-0 flex items-center ${contentClasses} pointer-events-none overflow-hidden`}
          style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}
          aria-hidden="true"
        >
          {displayValue.length === 0 && placeholder ? (
            <span className="opacity-40 select-none">{placeholder}</span>
          ) : (
            displayValue.split(/(\s+)/).map((part, i) => {
              if (part === '') return null
              if (/\s/.test(part)) {
                return part.split('').map((char, j) => (
                  <span key={`${i}-${j}`} className="inline-block animate-char-enter whitespace-pre">
                    {isPassword ? '•' : char === ' ' ? '\u00A0' : char}
                  </span>
                ))
              }
              return (
                <span key={i} className="inline-block">
                  {part.split('').map((char, j) => (
                    <span key={`${i}-${j}`} className="inline-block animate-char-enter whitespace-pre">
                      {isPassword ? '•' : char}
                    </span>
                  ))}
                </span>
              )
            })
          )}
        </div>

        {/* Real input — absolute z-10, caret on top of overlay text */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          disabled={disabled}
          placeholder=""
          onScroll={handleScroll}
          className={`absolute inset-0 z-10 w-full h-full bg-transparent caret-white rounded-[inherit] ${contentClasses} border-0 disabled:cursor-not-allowed`}
          style={{ 
            outline: 'none', 
            fontKerning: 'none', 
            textRendering: 'optimizeSpeed',
            color: 'transparent'
          }}
          {...props}
        />
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'
export default AnimatedInput
