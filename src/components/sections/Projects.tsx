'use client'

import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import ProjectCard from '@/components/ui/ProjectCard'

const featuredProjects = projects.filter((p) => p.featured)
const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects

export default function Projects() {
  return (
    <section id="proyectos" className="py-24 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-sm text-[var(--accent)] mb-12 tracking-widest uppercase">
          Proyectos
        </p>

        <div className="grid gap-8">
          {displayProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
