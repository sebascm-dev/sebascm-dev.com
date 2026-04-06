import { about } from '@/data/about'
import { SiGithub } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--foreground)]/40 font-mono">
          © {year} {about.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={about.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors"
          >
            <SiGithub size={16} />
          </a>
          <a
            href={about.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors"
          >
            <FaLinkedin size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
