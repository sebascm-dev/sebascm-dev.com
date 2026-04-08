'use client'

import { useState } from 'react'
import { IconChevronUp, IconChevronDown, IconLock, IconGitBranch, IconAlertCircle, IconCircleCheck } from '@tabler/icons-react'
import type { RepoWithStats } from '@/lib/github.types'

interface RepoTableProps {
  repos: RepoWithStats[]
}

type SortKey = 'name' | 'stargazerCount' | 'forkCount' | 'totalCommits' | 'openIssues'
type SortDir = 'asc' | 'desc'

const DEFAULT_SORT: { key: SortKey; dir: SortDir } = { key: 'totalCommits', dir: 'desc' }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface SortHeaderProps {
  label: string
  sortKey: SortKey
  current: { key: SortKey; dir: SortDir }
  onSort: (key: SortKey) => void
  align?: 'left' | 'right'
}

function SortHeader({ label, sortKey, current, onSort, align = 'right' }: SortHeaderProps) {
  const isActive = current.key === sortKey
  return (
    <th
      className={`px-4 py-3 font-medium cursor-pointer select-none transition-colors ${align === 'right' ? 'text-right' : 'text-left'} ${isActive ? 'text-[#22d3ee]' : 'text-gray-600 hover:text-gray-400'}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          current.dir === 'asc'
            ? <IconChevronUp size={12} className="text-[#22d3ee]" />
            : <IconChevronDown size={12} className="text-[#22d3ee]" />
        ) : (
          <IconChevronDown size={12} className="text-gray-600" />
        )}
      </span>
    </th>
  )
}

export function RepoTable({ repos }: RepoTableProps) {
  const [sort, setSort] = useState(DEFAULT_SORT)

  const handleSort = (key: SortKey) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' ? 'asc' : 'desc' }
    )
  }

  const sorted = [...repos].sort((a, b) => {
    const aVal = a[sort.key]
    const bVal = b[sort.key]
    const cmp =
      typeof aVal === 'string' && typeof bVal === 'string'
        ? aVal.localeCompare(bVal)
        : (aVal as number) - (bVal as number)
    return sort.dir === 'asc' ? cmp : -cmp
  })

  if (repos.length === 0) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-12 text-center flex flex-col items-center gap-3">
        <IconGitBranch size={32} className="text-gray-700" />
        <p className="text-gray-500 text-sm">No se encontraron repositorios</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-full" />
            <col className="w-32" />
            <col className="w-20" />
            <col className="w-20" />
            <col className="w-24" />
            <col className="w-32" />
            <col className="w-24" />
            <col className="w-36" />
          </colgroup>
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-[#1a1a1a]">
              <SortHeader label="Nombre" sortKey="name" current={sort} onSort={handleSort} align="left" />
              <th className="px-4 py-3 font-medium text-right">Lenguaje</th>
              <SortHeader label="Stars" sortKey="stargazerCount" current={sort} onSort={handleSort} />
              <SortHeader label="Forks" sortKey="forkCount" current={sort} onSort={handleSort} />
              <SortHeader label="Commits" sortKey="totalCommits" current={sort} onSort={handleSort} />
              <th className="px-4 py-3 font-medium text-right">Actualizado</th>
              <th className="px-4 py-3 font-medium text-center">Privado</th>
              <SortHeader label="Issues" sortKey="openIssues" current={sort} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((repo) => (
              <tr key={repo.name} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-medium text-white hover:text-[#22d3ee] transition-colors cursor-pointer"
                  >
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{repo.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {repo.language ? (
                    <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">{repo.stargazerCount}</td>
                <td className="px-4 py-3 text-right text-gray-400">{repo.forkCount}</td>
                <td className="px-4 py-3 text-right text-gray-400">{repo.totalCommits.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                  {formatDate(repo.updatedAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  {repo.isPrivate ? (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">
                      <IconLock size={10} />
                      Privado
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`${repo.url}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                      repo.openIssues > 0
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {repo.openIssues > 0 ? (
                      <>
                        <IconAlertCircle size={12} />
                        {repo.openIssues} abiertos
                      </>
                    ) : (
                      <>
                        <IconCircleCheck size={12} />
                        Sin issues
                      </>
                    )}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
