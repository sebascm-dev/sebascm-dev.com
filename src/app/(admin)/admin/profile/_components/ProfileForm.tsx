'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from '@/lib/toast'
import Image from 'next/image'
import {
  IconUser, IconId, IconPhone, IconMail,
  IconMapPin, IconMap2, IconMailbox, IconWorld,
  IconBriefcase, IconSchool, IconClock, IconAlignLeft, IconCalendar,
  IconBrandGithub, IconBrandLinkedin, IconBrandX,
  IconBrandInstagram, IconBrandYoutube, IconLink,
} from '@tabler/icons-react'
import { updateProfile, type ProfileActionResult } from '@/app/actions/profile'
import type { profile } from '@/lib/schema'
import type { InferSelectModel } from 'drizzle-orm'

type Profile = InferSelectModel<typeof profile>

export interface ProfileFormProps {
  initialData: Profile | null
}

const initialState: ProfileActionResult = { success: false }

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  className,
  icon: Icon,
  inputProps,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | number | null
  placeholder?: string
  className?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}) {
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${className ?? ''}`}>
      <label className="text-xs text-gray-500 font-[var(--font-fira-code)]">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        )}
        <input
          type={type}
          name={name}
          defaultValue={defaultValue ?? ''}
          placeholder={placeholder}
          className={`bg-[#111] border border-[#1a1a1a] rounded-lg py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22d3ee] transition-colors w-full ${Icon ? 'pl-8 pr-3' : 'px-3'}`}
          {...inputProps}
        />
      </div>
    </div>
  )
}

// Convierte YYYY-MM-DD → dd/mm/yyyy para mostrar
function isoToDisplay(iso: string | null | undefined): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

// Convierte dd/mm/yyyy → YYYY-MM-DD para la DB
function displayToIso(display: string): string {
  const [d, m, y] = display.split('/')
  if (!d || !m || !y) return display
  return `${y}-${m}-${d}`
}

function BirthDateField({ defaultValue }: { defaultValue: string | null | undefined }) {
  const [display, setDisplay] = useState(isoToDisplay(defaultValue))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(/[^\d]/g, '')
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2)
    if (val.length > 5) val = val.slice(0, 5) + '/' + val.slice(5)
    if (val.length > 10) val = val.slice(0, 10)
    setDisplay(val)
  }

  const isoValue = display.length === 10 ? displayToIso(display) : ''

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-xs text-gray-500 font-[var(--font-fira-code)]">Fecha de nacimiento</label>
      <div className="relative">
        <IconCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        <input
          type="text"
          value={display}
          onChange={handleChange}
          placeholder="dd/mm/yyyy"
          maxLength={10}
          className="bg-[#111] border border-[#1a1a1a] rounded-lg py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22d3ee] transition-colors w-full pl-8 pr-3"
        />
        <input type="hidden" name="birthDate" value={isoValue} />
      </div>
    </div>
  )
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatarUrl ?? null)
  const avatarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.success) toast.success('Perfil guardado correctamente.')
    else if (state.error) toast.error(state.error)
  }, [state])

  return (
    <form id="profile-form" action={formAction} className="space-y-6">
      {/* Campos ocultos */}
      <input type="hidden" name="existingAvatarUrl" value={initialData?.avatarUrl ?? ''} />
      <input type="hidden" name="existingAvatarKey" value={initialData?.avatarKey ?? ''} />
      <input type="hidden" name="existingCvUrl" value={initialData?.cvUrl ?? ''} />
      <input type="hidden" name="existingCvKey" value={initialData?.cvKey ?? ''} />

      {/* DATOS PERSONALES */}
      <section className="space-y-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div
            className="relative shrink-0 rounded-lg overflow-hidden bg-[#111] border border-[#1a1a1a] cursor-pointer group"
            style={{ width: 200, height: 268 }}
            onClick={() => avatarRef.current?.click()}
          >
            {avatarPreview ? (
              <Image src={avatarPreview} alt="Avatar" fill sizes="120px" loading="eager" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">?</div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-white">Cambiar</span>
            </div>
            <input
              ref={avatarRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setAvatarPreview(URL.createObjectURL(file))
              }}
            />
          </div>

          {/* Nombre + contacto */}
          <div className="flex-1 flex flex-col gap-3">
            <Field label="Nombre" name="firstName" defaultValue={initialData?.firstName} placeholder="Sebastián" icon={IconUser} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Primer apellido" name="lastName1" defaultValue={initialData?.lastName1} placeholder="Contreras" icon={IconUser} />
              <Field label="Segundo apellido" name="lastName2" defaultValue={initialData?.lastName2} placeholder="Marín" icon={IconUser} />
            </div>
            <Field label="Email" name="email" type="email" defaultValue={initialData?.email} placeholder="correo@ejemplo.com" icon={IconMail} />
            <div className="grid grid-cols-3 gap-3">
              <Field label="DNI" name="dni" defaultValue={initialData?.dni} placeholder="12345678A" icon={IconId} />
              <Field label="Teléfono" name="phone" defaultValue={initialData?.phone} placeholder="+34 600 000 000" icon={IconPhone} />
              <BirthDateField defaultValue={initialData?.birthDate} />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Provincia" name="province" defaultValue={initialData?.province} placeholder="Huelva" icon={IconMap2} />
            <Field label="Comunidad autónoma" name="community" defaultValue={initialData?.community} placeholder="Andalucía" icon={IconMap2} />
            <Field label="País" name="country" defaultValue={initialData?.country} placeholder="España" icon={IconWorld} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Field label="Localidad" name="location" defaultValue={initialData?.location} placeholder="Rociana del Condado" icon={IconMapPin} />
            </div>
            <Field label="Código postal" name="zip" defaultValue={initialData?.zip} placeholder="21730" icon={IconMailbox} />
          </div>
        </div>
      </section>

      {/* PERFIL PROFESIONAL */}
      <section className="space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-[var(--font-fira-code)]">
          Perfil profesional
        </p>
        <div className="flex gap-3 items-end">
          {/* Toggle disponible */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="text-xs text-gray-500 font-[var(--font-fira-code)]">Disponible</span>
            <label className="relative inline-flex items-center cursor-pointer h-[38px] w-16">
              <input
                type="checkbox"
                id="available"
                name="available"
                value="true"
                defaultChecked={initialData?.available ?? false}
                className="sr-only peer"
              />
              <div className="w-16 h-[38px] bg-[#111] border border-[#1a1a1a] rounded-lg peer-checked:bg-[#22d3ee] peer-checked:border-[#22d3ee] transition-colors duration-200" />
              <div className="absolute left-[5px] top-1/2 -translate-y-1/2 w-[14px] h-[26px] bg-white/30 rounded-md shadow transition-all duration-200 peer-checked:translate-x-[40px] peer-checked:bg-white" />
            </label>
          </div>
          <Field label="Puesto de trabajo" name="jobTitle" defaultValue={initialData?.jobTitle} placeholder="Frontend Developer" icon={IconBriefcase} className="flex-1 min-w-0" />
          <Field label="Título / Grado" name="degree" defaultValue={initialData?.degree} placeholder="Ingeniería Informática" icon={IconSchool} className="flex-1 min-w-0" />
          <Field label="Experiencia" name="experience" type="number" defaultValue={initialData?.experience} placeholder="2" icon={IconClock} className="w-20 shrink-0" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-[var(--font-fira-code)]">
            <span className="inline-flex items-center gap-1.5">
              <IconAlignLeft size={14} className="text-gray-600" />
              Bio
            </span>
          </label>
          <textarea
            name="bio"
            defaultValue={initialData?.bio ?? ''}
            rows={4}
            placeholder="Cuéntanos sobre vos..."
            className="bg-[#111] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22d3ee] transition-colors resize-none"
          />
        </div>
      </section>

      {/* REDES SOCIALES */}
      <section className="space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-[var(--font-fira-code)]">
          Redes sociales
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="GitHub" name="github" defaultValue={initialData?.github} placeholder="https://github.com/usuario" icon={IconBrandGithub} />
          <Field label="LinkedIn" name="linkedin" defaultValue={initialData?.linkedin} placeholder="https://linkedin.com/in/usuario" icon={IconBrandLinkedin} />
          <Field label="Twitter / X" name="twitter" defaultValue={initialData?.twitter} placeholder="https://x.com/usuario" icon={IconBrandX} />
          <Field label="Instagram" name="instagram" defaultValue={initialData?.instagram} placeholder="https://instagram.com/usuario" icon={IconBrandInstagram} />
          <Field label="YouTube" name="youtube" defaultValue={initialData?.youtube} placeholder="https://youtube.com/@usuario" icon={IconBrandYoutube} />
          <Field label="Website" name="website" defaultValue={initialData?.website} placeholder="https://tusitio.com" icon={IconLink} />
        </div>
      </section>

    </form>
  )
}
