import { IconStar, IconGitCommit, IconExternalLink } from '@tabler/icons-react'
import type { RepoWithStats } from '@/lib/github.types'

interface TopReposCardProps {
  repos: RepoWithStats[]
}

export function TopReposCard({ repos }: TopReposCardProps) {
  const topRepos = [...repos]
    .sort((a, b) => b.totalCommits - a.totalCommits)
    .slice(0, 5)

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <h3 className="text-sm font-medium text-gray-400">Top repos por commits</h3>
      </div>
      {topRepos.length === 0 ? (
        <p className="text-gray-500 text-sm px-4 py-6">No hay repositorios</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-[#1a1a1a]">
              <th className="px-4 pb-2 pt-3 font-medium">Nombre</th>
              <th className="pb-2 pt-3 font-medium text-right">Stars</th>
              <th className="pb-2 pt-3 font-medium text-right">Commits</th>
              <th className="px-4 pb-2 pt-3 font-medium text-right">Lenguaje</th>
            </tr>
          </thead>
          <tbody>
            {topRepos.map((repo) => (
              <tr
                key={repo.name}
                className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-sm font-medium text-white hover:text-[#22d3ee] transition-colors"
                  >
                    {repo.name}
                    <IconExternalLink size={12} className="text-gray-600 shrink-0" />
                  </a>
                </td>
                <td className="py-3 text-right text-gray-400">
                  <span className="inline-flex items-center justify-end gap-1">
                    <IconStar size={12} className="text-gray-500" />
                    {repo.stargazerCount}
                  </span>
                </td>
                <td className="py-3 text-right text-gray-400">
                  <span className="inline-flex items-center justify-end gap-1">
                    <IconGitCommit size={12} className="text-gray-500" />
                    {repo.totalCommits.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {repo.language ? (
                    <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
