'use client'

import { forwardRef, useRef, useImperativeHandle } from 'react'
import type { TextareaHTMLAttributes } from 'react'

/**
 * Drop-in <textarea> replacement with per-character slide-up animation.
 * Pass the same className you'd put on a native textarea.
 *
 * The real textarea sits in normal flow (determines height) with transparent
 * text. An absolute overlay div renders the animated character spans on top.
 */
const AnimatedTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (
    { className = '', value, style, placeholder, disabled, ...props },
    ref
  ) => {
    const displayValue = String(value ?? '')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Sync external ref with internal ref
    useImperativeHandle(ref, () => textareaRef.current!)

    const handleScroll = () => {
      if (overlayRef.current && textareaRef.current) {
        overlayRef.current.scrollTop = textareaRef.current.scrollTop
      }
    }

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
          ref={textareaRef}
          value={value}
          disabled={disabled}
          placeholder=""
          onScroll={handleScroll}
          className={`relative z-10 w-full bg-transparent caret-white border-0 rounded-[inherit] ${contentClasses} resize-none disabled:cursor-not-allowed`}
          style={{ 
            outline: 'none',
            fontKerning: 'none',
            textRendering: 'optimizeSpeed',
            color: 'transparent'
          }}
          {...props}
        />

        <div
          ref={overlayRef}
          className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${contentClasses} whitespace-pre-wrap break-words`}
          style={{ fontKerning: 'none', textRendering: 'optimizeSpeed' }}
          aria-hidden="true"
        >
          {displayValue.length === 0 && placeholder ? (
            <span className="opacity-40 select-none">{placeholder}</span>
          ) : (
            displayValue.split(/(\s+)/).map((part, i) => {
              if (part === '') return null
              if (/\s/.test(part)) {
                return part.split('').map((char, j) => {
                  if (char === '\n') {
                    return <br key={`${i}-${j}`} />
                  }
                  return (
                    <span key={`${i}-${j}`} className="inline-block animate-char-enter whitespace-pre">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  )
                })
              }
              return (
                <span key={i} className="inline-block">
                  {part.split('').map((char, j) => (
                    <span key={`${i}-${j}`} className="inline-block animate-char-enter whitespace-pre">
                      {char}
                    </span>
                  ))}
                </span>
              )
            })
          )}
        </div>
      </div>
    )
  }
)

AnimatedTextarea.displayName = 'AnimatedTextarea'
export default AnimatedTextarea
