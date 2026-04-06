import type { Project } from '@/lib/types'
import { SiGithub } from 'react-icons/si'
import { HiArrowUpRight } from 'react-icons/hi2'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--accent)]/40 transition-colors duration-300">
      {/* Image placeholder / proyecto image */}
      <div className="aspect-video bg-[var(--background)] relative overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`Captura de ${project.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-sm text-[var(--foreground)]/20">{project.title}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-[var(--foreground)]/60 text-sm leading-relaxed mb-4">
          {project.longDescription ?? project.description}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono bg-[var(--accent-muted)] text-[var(--accent)] rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-[var(--background)] text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Ver demo <HiArrowUpRight size={14} />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] text-[var(--foreground)]/70 text-sm font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <SiGithub size={14} /> Código
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
