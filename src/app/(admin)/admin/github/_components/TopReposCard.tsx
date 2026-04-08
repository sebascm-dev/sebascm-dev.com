import { IconStar, IconGitCommit, IconExternalLink } from '@tabler/icons-react'
import type { RepoWithStats } from '@/lib/github.types'

interface TopReposCardProps {
  repos: RepoWithStats[]
}

export function TopReposCard({ repos }: TopReposCardProps) {
  const topRepos = [...repos]
    .sort((a, b) => b.totalCommits - a.totalCommits)
    .slice(0, 3)

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest font-medium">Top 3 repos por commits</h3>
      </div>
      {topRepos.length === 0 ? (
        <p className="text-gray-500 text-sm px-4 py-6">No hay repositorios</p>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_auto_auto_90px] text-left text-xs text-gray-500 border-b border-[#1a1a1a] px-4 py-2">
            <span className="font-medium">Nombre</span>
            <span className="font-medium text-right pr-4">Stars</span>
            <span className="font-medium text-right pr-4">Commits</span>
            <span className="font-medium text-right">Lenguaje</span>
          </div>
          <div className="flex flex-col flex-1 divide-y divide-[#1a1a1a]">
            {topRepos.map((repo) => (
              <div
                key={repo.name}
                className="grid grid-cols-[1fr_auto_auto_90px] items-center flex-1 px-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-sm font-medium text-white hover:text-[#22d3ee] transition-colors py-3"
                >
                  {repo.name}
                  <IconExternalLink size={12} className="text-gray-600 shrink-0" />
                </a>
                <span className="inline-flex items-center justify-end gap-1 text-gray-400 text-sm pr-4">
                  <IconStar size={12} className="text-gray-500" />
                  {repo.stargazerCount}
                </span>
                <span className="inline-flex items-center justify-end gap-1 text-gray-400 text-sm pr-4">
                  <IconGitCommit size={12} className="text-gray-500" />
                  {repo.totalCommits.toLocaleString()}
                </span>
                <div className="text-right">
                  {repo.language ? (
                    <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
