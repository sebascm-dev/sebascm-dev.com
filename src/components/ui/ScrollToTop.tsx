'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconArrowUp } from '@tabler/icons-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover="hover"
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] shadow-lg transition-colors hover:bg-[var(--accent)] hover:text-[var(--background)] cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)] group"
          aria-label="Volver arriba"
        >
          {/* Ping effect circle */}
          <motion.div
            variants={{
              initial: { 
                scale: 1, 
                opacity: 0 
              },
              hover: {
                scale: [1, 1.6],
                opacity: [0.5, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeOut"
                }
              }
            }}
            initial="initial"
            animate="initial"
            className="absolute inset-0 rounded-full border-2 border-[var(--accent)] pointer-events-none"
          />
          
          <motion.div
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            initial="initial"
            animate="initial"
            className="relative z-10 flex items-center justify-center"
          >
            <IconArrowUp className="w-6 h-6" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
