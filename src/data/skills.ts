import type { SkillCategory } from '@/lib/types'

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'Next.js', icon: 'SiNextdotjs', level: 'intermedio' },
      { name: 'React', icon: 'SiReact', level: 'intermedio' },
      { name: 'TypeScript', icon: 'SiTypescript', level: 'básico' },
      { name: 'Tailwind CSS', icon: 'SiTailwindcss', level: 'intermedio' },
      { name: 'Framer Motion', icon: 'SiFramer', level: 'básico' },
    ],
  },
  {
    name: 'Backend & Datos',
    skills: [
      { name: 'Supabase', icon: 'SiSupabase', level: 'intermedio' },
      { name: 'Node.js', icon: 'SiNodedotjs', level: 'básico' },
    ],
  },
  {
    name: 'Herramientas',
    skills: [
      { name: 'Git', icon: 'SiGit', level: 'básico' },
      { name: 'Vercel', icon: 'SiVercel', level: 'básico' },
      { name: 'VS Code', icon: 'SiVisualstudiocode', level: 'intermedio' },
    ],
  },
]
