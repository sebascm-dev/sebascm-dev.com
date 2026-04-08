'use client'

import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GithubError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="flex items-center gap-2 text-red-400">
        <IconAlertTriangle size={20} />
        <span className="text-sm font-medium">Error al cargar datos de GitHub</span>
      </div>
      <p className="text-xs text-gray-500 max-w-sm text-center">{error.message}</p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-[#262626] transition-colors"
      >
        <IconRefresh size={14} />
        Reintentar
      </button>
    </div>
  )
}
