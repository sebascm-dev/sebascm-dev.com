import { getProfile } from '@/app/actions/profile'
import { NextResponse } from 'next/server'

export async function GET() {
  const profile = await getProfile()

  if (!profile?.cvUrl) {
    return new NextResponse('CV no disponible', { status: 404 })
  }

  const response = await fetch(profile.cvUrl)

  if (!response.ok) {
    return new NextResponse('Error al obtener el CV', { status: 502 })
  }

  const buffer = await response.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Currículum - Sebastián Contreras Marín.pdf"; filename*=UTF-8\'\'Curr%C3%ADculum%20-%20Sebasti%C3%A1n%20Contreras%20Mar%C3%ADn.pdf',
    },
  })
}
