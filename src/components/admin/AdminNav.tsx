'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { NavItem } from '@/lib/github.types'

interface AdminNavProps {
  navItems: NavItem[]
}

export function AdminNav({ navItems }: AdminNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white bg-[#1a1a1a]'
                : 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors'
            }
          >
            <Icon
              size={16}
              className={active ? 'text-[#22d3ee]' : undefined}
            />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
