// Admin shell layout — Server Component with defense-in-depth auth check
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'
import { about } from '@/data/about'
import { IconLayoutDashboard, IconLogout } from '@tabler/icons-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-[#1a1a1a] bg-[#0d0d0d]">

        {/* User profile */}
        <div className="px-4 py-4 border-b border-[#1a1a1a] flex items-center gap-3">
          <Image
            src={about.photo}
            alt={about.name}
            width={36}
            height={36}
            className="rounded-full object-cover w-9 h-9"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Sebastián</p>
            <p className="text-xs text-gray-500 truncate">{about.email}</p>
          </div>
        </div>

        {/* Nav items — empty for now, ready for future tabs */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white bg-[#1a1a1a]"
          >
            <IconLayoutDashboard size={16} className="text-[#22d3ee]" />
            Dashboard
          </a>
        </nav>

        {/* Logout — pinned to bottom */}
        <div className="px-3 py-4 border-t border-[#1a1a1a]">
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              <IconLogout size={16} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
