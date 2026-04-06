import type { Skill } from '@/lib/types'
import * as SiIcons from 'react-icons/si'

interface SkillBadgeProps {
  skill: Skill
}

type SiIconKey = keyof typeof SiIcons

export default function SkillBadge({ skill }: SkillBadgeProps) {
  const IconComponent = SiIcons[skill.icon as SiIconKey] as React.ComponentType<{ size?: number; className?: string }> | undefined

  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent-muted)] transition-all duration-200 group">
      {IconComponent && (
        <IconComponent
          size={18}
          className="text-[var(--foreground)]/40 group-hover:text-[var(--accent)] transition-colors"
        />
      )}
      <span className="text-sm font-medium text-[var(--foreground)]/70 group-hover:text-[var(--foreground)] transition-colors">
        {skill.name}
      </span>
      {skill.level && (
        <span className="ml-auto text-xs font-mono text-[var(--foreground)]/30 capitalize">
          {skill.level}
        </span>
      )}
    </div>
  )
}
