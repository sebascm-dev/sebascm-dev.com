'use client'

import { useState } from 'react'
import { IconChevronUp, IconChevronDown, IconLock } from '@tabler/icons-react'
import { DispatchButton } from './DispatchButton'
import type { RepoWithStats } from '@/lib/github.types'

interface RepoTableProps {
  repos: RepoWithStats[]
}

type SortKey = 'name' | 'stargazerCount' | 'forkCount' | 'totalCommits'
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
      className={`pb-2 font-medium cursor-pointer select-none hover:text-gray-300 transition-colors ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          current.dir === 'asc' ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />
        ) : (
          <IconChevronDown size={12} className="opacity-30" />
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
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-12 text-center">
        <p className="text-gray-500 text-sm">No repositories found</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-[#1a1a1a]">
              <SortHeader label="Nombre" sortKey="name" current={sort} onSort={handleSort} align="left" />
              <th className="pb-2 font-medium text-right pr-4">Lenguaje</th>
              <SortHeader label="Stars" sortKey="stargazerCount" current={sort} onSort={handleSort} />
              <SortHeader label="Forks" sortKey="forkCount" current={sort} onSort={handleSort} />
              <SortHeader label="Commits" sortKey="totalCommits" current={sort} onSort={handleSort} />
              <th className="pb-2 font-medium text-right">Actualizado</th>
              <th className="pb-2 font-medium text-center">Privado</th>
              <th className="pb-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((repo) => (
              <tr key={repo.name} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#111] transition-colors">
                <td className="py-3 pr-4">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#22d3ee] transition-colors font-medium"
                  >
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{repo.description}</p>
                  )}
                </td>
                <td className="py-3 pr-4 text-right">
                  {repo.language ? (
                    <span className="text-xs bg-[#1a1a1a] text-gray-300 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="py-3 text-right text-gray-400">{repo.stargazerCount}</td>
                <td className="py-3 text-right text-gray-400">{repo.forkCount}</td>
                <td className="py-3 text-right text-gray-400">{repo.totalCommits.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                  {formatDate(repo.updatedAt)}
                </td>
                <td className="py-3 text-center">
                  {repo.isPrivate ? (
                    <IconLock size={14} className="text-yellow-600 mx-auto" />
                  ) : null}
                </td>
                <td className="py-3 text-right">
                  <DispatchButton
                    repo={repo.fullName}
                    workflowId="deploy.yml"
                    defaultRef={repo.defaultBranch}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
