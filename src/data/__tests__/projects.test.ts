import { describe, it, expect } from 'vitest'
import { projects } from '../projects'
import type { Project } from '@/lib/types'

describe('projects data', () => {
  it('tiene al menos un proyecto', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('cada proyecto cumple la interfaz Project', () => {
    projects.forEach((project: Project) => {
      expect(project.id).toBeDefined()
      expect(typeof project.id).toBe('string')
      expect(project.title).toBeDefined()
      expect(typeof project.title).toBe('string')
      expect(project.description).toBeDefined()
      expect(Array.isArray(project.stack)).toBe(true)
      expect(project.stack.length).toBeGreaterThan(0)
      expect(typeof project.featured).toBe('boolean')
    })
  })

  it('tiene al menos un proyecto con featured: true', () => {
    const featured = projects.filter((p) => p.featured)
    expect(featured.length).toBeGreaterThan(0)
  })

  it('demoUrl es string válido cuando está definido', () => {
    projects.forEach((project) => {
      if (project.demoUrl !== undefined) {
        expect(typeof project.demoUrl).toBe('string')
        expect(project.demoUrl.startsWith('http')).toBe(true)
      }
    })
  })
})
