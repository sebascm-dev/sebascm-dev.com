'use client'

import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

/**
 * Drop-in <textarea> replacement with per-character slide-up animation.
 * Pass the same className you'd put on a native textarea.
 *
 * The real textarea sits in normal flow (determines height) with transparent
 * text. An absolute overlay div renders the animated character spans on top.
 */
const AnimatedTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function AnimatedTextarea(
    { className = '', value, style, placeholder, disabled, ...props },
    ref
  ) {
    const displayValue = String(value ?? '')

    // Use contentClasses to sync topography/spacing between real and fake layers
    const contentClasses = (className.match(/\b(p[xylrtb]?-|text-|font-|tracking-|leading-|italic|antialiased)[\w.[/\]]+/g) ?? []).join(' ')
    const containerClass = className
      .replace(/\bfocus:/g, 'focus-within:')
      .replace(/\b(p[xylrtb]?-|text-|font-|tracking-|leading-|italic|antialiased)[\w.[/\]]+/g, '')

    return (
      <div
        className={`relative ${containerClass} ${disabled ? 'opacity-40' : ''}`}
        style={{ transition: 'border-color 200ms ease', outline: 'none', ...style }}
      >
        {/* Real textarea: transparent text, visible caret */}
        <textarea
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder=""
          className={`relative z-10 w-full bg-transparent caret-white border-0 rounded-[inherit] ${contentClasses} resize-none disabled:cursor-not-allowed`}
          style={{ 
            outline: 'none',
            fontKerning: 'none',
            textRendering: 'optimizeSpeed',
            color: 'transparent'
          }}
          {...props}
        />

        {/* Animated character overlay — absolute, matches textarea dimensions */}
        <div
          className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${contentClasses} whitespace-pre-wrap break-words`}
          style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}
          aria-hidden="true"
        >
          {displayValue.length === 0 && placeholder ? (
            <span className="opacity-40 select-none">{placeholder}</span>
          ) : (
            displayValue.split('').map((char, i) => (
              <span key={i} className="inline-block animate-char-enter whitespace-pre">
                {char === ' ' || char === '\n' ? (char === '\n' ? <br key={i} /> : '\u00A0') : char}
              </span>
            ))
          )}
        </div>
      </div>
    )
  }
)

AnimatedTextarea.displayName = 'AnimatedTextarea'
export default AnimatedTextarea
