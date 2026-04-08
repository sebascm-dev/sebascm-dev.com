import { IconStar, IconGitFork, IconCode, IconGitCommit } from '@tabler/icons-react'
import type { RepoWithStats } from '@/lib/github.types'

interface SummaryStatsProps {
  repos: RepoWithStats[]
}

interface StatCard {
  label: string
  value: number | string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export function SummaryStats({ repos }: SummaryStatsProps) {
  const totalRepos = repos.length
  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0)
  const totalForks = repos.reduce((sum, r) => sum + r.forkCount, 0)
  const totalCommits = repos.reduce((sum, r) => sum + r.totalCommits, 0)

  const cards: StatCard[] = [
    { label: 'Repositorios', value: totalRepos, icon: IconCode },
    { label: 'Stars', value: totalStars, icon: IconStar },
    { label: 'Forks', value: totalForks, icon: IconGitFork },
    { label: 'Commits totales', value: totalCommits.toLocaleString(), icon: IconGitCommit },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#22d3ee]/30 transition-colors"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
            {label}
          </span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold font-mono text-white">{value}</p>
            <Icon size={20} className="text-[#22d3ee] shrink-0" />
          </div>
        </div>
      ))}
    </div>
  )
}
