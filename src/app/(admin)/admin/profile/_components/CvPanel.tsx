'use client'

import { useRef, useState, useTransition, useImperativeHandle, forwardRef } from 'react'
import { updateProfile } from '@/app/actions/profile'

interface CvPanelProps {
  cvUrl: string | null
}

export interface CvPanelHandle {
  openFilePicker: () => void
  isPending: boolean
  hasCv: boolean
}

export const CvPanel = forwardRef<CvPanelHandle, CvPanelProps>(function CvPanel(
  { cvUrl: initialCvUrl },
  ref,
) {
  const [cvUrl, setCvUrl] = useState(initialCvUrl)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    openFilePicker: () => fileRef.current?.click(),
    isPending,
    hasCv: !!cvUrl,
  }))

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('cv', file)
    formData.append('existingCvUrl', cvUrl ?? '')
    formData.append('existingCvKey', '')
    formData.append('existingAvatarUrl', '')
    formData.append('existingAvatarKey', '')

    startTransition(async () => {
      const result = await updateProfile({ success: false }, formData)
      if (result.success) {
        window.location.reload()
      }
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {cvUrl ? (
        <div className="rounded-lg overflow-hidden border border-[#1a1a1a] flex-1 min-h-0 relative">
          <iframe
            src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title="CV Preview"
            style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              width: 'calc(100% + 24px)',
              height: 'calc(100% + 36px)',
              border: 'none',
              display: 'block',
            }}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#1a1a1a] bg-[#0d0d0d] flex-1 min-h-0 flex flex-col items-center justify-center gap-2 text-gray-600">
          <span className="text-3xl">📄</span>
          <p className="text-sm">Sin CV subido</p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
})
