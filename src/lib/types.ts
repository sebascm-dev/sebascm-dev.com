export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  stack: string[]
  demoUrl?: string
  repoUrl?: string
  featured: boolean
  image?: string
}

export interface Skill {
  name: string
  icon: string
  level?: 'básico' | 'intermedio' | 'avanzado'
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface About {
  name: string
  role: string
  tagline: string
  bio: string
  photo: string
  email: string
  github: string
  linkedin: string
}
