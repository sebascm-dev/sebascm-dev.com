import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getProfile } from '@/app/actions/profile'
import { ProfileLayout } from './_components/ProfileLayout'

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const profileData = await getProfile()

  return (
    <ProfileLayout
      initialData={profileData}
      cvUrl={profileData?.cvUrl ?? null}
    />
  )
}
