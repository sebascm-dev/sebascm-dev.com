'use client'

import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

const AnimatedInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function AnimatedInput(
    { className = '', type, value, style, placeholder, disabled, ...props },
    ref
  ) {
    const isPassword = type === 'password'

    if (isPassword) {
      return (
        <input
          ref={ref}
          type="password"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          className={className}
          style={{ outline: 'none', transition: 'border-color 200ms ease', ...style }}
          {...props}
        />
      )
    }

    const displayValue = String(value ?? '')

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

        {/* Animated character overlay — absolute z-0, below caret */}
        <div
          className={`absolute inset-0 z-0 flex items-center ${contentClasses} pointer-events-none overflow-hidden`}
          style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}
          aria-hidden="true"
        >
          {displayValue.length === 0 && placeholder ? (
            <span className="opacity-40 select-none">{placeholder}</span>
          ) : (
            displayValue.split('').map((char, i) => (
              <span key={i} className="inline-block animate-char-enter whitespace-pre">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))
          )}
        </div>

        {/* Real input — absolute z-10, caret on top of overlay text */}
        <input
          ref={ref}
          type={type}
          value={value}
          disabled={disabled}
          placeholder=""
          className={`absolute inset-0 z-10 w-full h-full bg-transparent text-transparent caret-white rounded-[inherit] ${contentClasses} border-0 disabled:cursor-not-allowed`}
          style={{ 
            outline: 'none', 
            fontKerning: 'none', 
            textRendering: 'optimizeSpeed'
          }}
          {...props}
        />
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'
export default AnimatedInput
