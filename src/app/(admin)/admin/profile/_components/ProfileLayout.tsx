'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { IconDeviceFloppy, IconFileArrowLeft, IconDownload } from '@tabler/icons-react'
import { CvPanel, type CvPanelHandle } from './CvPanel'
import { ProfileForm, type ProfileFormProps } from './ProfileForm'

const sectionLabel = 'text-xs font-semibold text-gray-500 uppercase tracking-widest font-[var(--font-fira-code)]'

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      form="profile-form"
      disabled={pending}
      className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22d3ee] text-black text-sm font-semibold rounded-lg hover:bg-[#06b6d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <IconDeviceFloppy size={16} />
      {pending ? 'Guardando...' : 'Guardar perfil'}
    </button>
  )
}

export function ProfileLayout({ initialData, cvUrl }: ProfileFormProps & { cvUrl: string | null }) {
  const cvRef = useRef<CvPanelHandle>(null)

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Layout: izquierda fija 680px + derecha auto-width basada en ratio A4 */}
      <div className="flex gap-8 flex-1 min-h-0">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 680 }}>
          <p className={sectionLabel}>Datos personales</p>
          <div className="overflow-y-auto flex-1 pr-3 scrollbar-thin">
            <ProfileForm initialData={initialData} />
          </div>
          <SaveButton />
        </div>

        {/* Columna derecha — ancho determinado por ratio A4 de la altura disponible */}
        <div className="flex flex-col gap-4 min-h-0" style={{ width: 'calc((100vh - 140px - 96px) * 210 / 297)' }}>
          <p className={sectionLabel}>Vista previa del CV</p>
          <CvPanel ref={cvRef} cvUrl={cvUrl} />
          <div className="shrink-0 flex gap-2">
            <button
              type="button"
              onClick={() => cvRef.current?.openFilePicker()}
              className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#1a1a1a] rounded-lg text-sm text-gray-300 hover:text-white hover:border-[#22d3ee] transition-colors"
            >
              <IconFileArrowLeft size={16} />
              {cvUrl ? 'Reemplazar CV' : 'Subir CV'}
            </button>
            {cvUrl && (
              <a
                href={cvUrl}
                download
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a] rounded-lg text-sm text-gray-300 hover:text-white hover:border-[#22d3ee] transition-colors"
              >
                <IconDownload size={16} />
                Descargar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
