'use client'

import { motion } from 'framer-motion'
import { about } from '@/data/about'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-16"
    >
      <div className="max-w-5xl mx-auto px-6 py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="font-mono text-sm text-[var(--accent)] mb-6 tracking-widest uppercase"
          >
            Hola, soy
          </motion.p>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-7xl font-bold tracking-tight leading-none mb-4"
          >
            {about.name.split(' ')[0]}
            <br />
            <span className="text-[var(--foreground)]/30">{about.name.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl sm:text-2xl text-[var(--accent)] font-medium mb-6"
          >
            {about.role}
          </motion.p>

          <motion.p
            variants={item}
            className="text-base sm:text-lg text-[var(--foreground)]/60 max-w-xl leading-relaxed mb-12"
          >
            {about.tagline}
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#proyectos"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--accent)] text-[var(--background)] font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Ver proyectos
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-6 py-3 border border-[var(--border)] text-[var(--foreground)]/70 font-semibold text-sm rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              Contactar
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
