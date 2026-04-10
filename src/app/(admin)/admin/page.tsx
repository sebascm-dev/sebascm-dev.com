// Admin dashboard — Server Component
import { auth } from '@/lib/auth'

export default async function AdminPage() {
  const session = await auth()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">
        Hola, {session?.user?.name ?? 'Admin'} 👋
      </h1>
      <p className="text-gray-400 text-sm">
        Bienvenido al panel de administración de sebascm.dev.
      </p>
    </div>
  )
}
