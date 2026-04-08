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
        className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#F59E0B]/40 text-xs text-[#F59E0B] bg-[#1a1a2a] opacity-70 cursor-not-allowed transition-all duration-200"
      >
        <IconLoader2 size={12} className="animate-spin" />
        Ejecutando
      </button>
    )
  }

  if (state === 'success') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-green-400/40 text-xs text-green-400 transition-all duration-200">
        <IconCheck size={12} />
        Lanzado
      </span>
    )
  }

  if (state === 'error') {
    return (
      <span
        className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-red-400/40 text-xs text-red-400 transition-all duration-200"
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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#F59E0B]/40 text-xs bg-[#1a1a2a] text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all duration-200 cursor-pointer"
    >
      <IconPlayerPlay size={12} />
      Deploy
    </button>
  )
}
