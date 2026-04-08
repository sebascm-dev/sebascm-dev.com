'use client'

import { useState, useTransition } from 'react'
import { IconPlayerPlay, IconCheck, IconX, IconLoader2 } from '@tabler/icons-react'

interface DispatchButtonProps {
  repo: string
  workflowId: string
  defaultRef?: string
}

type State = 'idle' | 'loading' | 'success' | 'error'

export function DispatchButton({ repo, workflowId, defaultRef = 'main' }: DispatchButtonProps) {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [, startTransition] = useTransition()

  const handleDispatch = () => {
    startTransition(async () => {
      setState('loading')
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
        setState('success')
        setTimeout(() => setState('idle'), 3000)
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : 'Error desconocido')
        setState('error')
        setTimeout(() => setState('idle'), 3000)
      }
    })
  }

  if (state === 'loading') {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
      >
        <IconLoader2 size={12} className="animate-spin" />
        Ejecutando
      </button>
    )
  }

  if (state === 'success') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-green-950 text-green-400">
        <IconCheck size={12} />
        Lanzado
      </span>
    )
  }

  if (state === 'error') {
    return (
      <span
        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-red-950 text-red-400"
        title={errorMsg}
      >
        <IconX size={12} />
        Error
      </span>
    )
  }

  return (
    <button
      onClick={handleDispatch}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-[#1a1a1a] text-gray-300 hover:bg-[#262626] hover:text-white transition-colors"
    >
      <IconPlayerPlay size={12} />
      Deploy
    </button>
  )
}
