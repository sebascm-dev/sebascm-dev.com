'use client'

import { motion } from 'framer-motion'
import { skillCategories } from '@/data/skills'
import SkillBadge from '@/components/ui/SkillBadge'

export default function Skills() {
  return (
    <section id="skills" className="py-24 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 py-24 w-full">
        <p className="font-mono text-sm text-[var(--accent)] mb-12 tracking-widest uppercase">
          Stack técnico
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {skillCategories.map((category, ci) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: ci * 0.1, ease: 'easeOut' }}
            >
              <h3 className="text-xs font-mono text-[var(--foreground)]/40 uppercase tracking-widest mb-4">
                {category.name}
              </h3>
              <div className="flex flex-col gap-2">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
