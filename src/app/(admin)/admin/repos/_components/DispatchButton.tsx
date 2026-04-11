'use client'

import { useState, useTransition } from 'react'
import { toast } from '@/lib/toast'
import { IconPlayerPlay, IconLoader2 } from '@tabler/icons-react'

interface DispatchButtonProps {
  repo: string
  workflowId: string
  defaultRef?: string
}

export function DispatchButton({ repo, workflowId, defaultRef = 'main' }: DispatchButtonProps) {
  const [loading, setLoading] = useState(false)
  const [, startTransition] = useTransition()

  const handleDispatch = () => {
    startTransition(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/github/workflows/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo, workflowId, ref: defaultRef }),
        })
        if (!res.ok) {
          const data = (await res.json()) as { error?: string }
          throw new Error(data.error ?? `Error ${res.status}`)
        }
        toast.success(`Workflow lanzado en ${repo}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Error al lanzar el workflow')
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <button
      onClick={handleDispatch}
      disabled={loading}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#F59E0B]/40 text-xs bg-[#1a1a2a] text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <IconLoader2 size={12} className="animate-spin" /> : <IconPlayerPlay size={12} />}
      {loading ? 'Ejecutando...' : 'Deploy'}
    </button>
  )
}
