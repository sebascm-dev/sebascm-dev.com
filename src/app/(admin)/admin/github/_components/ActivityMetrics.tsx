import { IconFlame, IconTrophy, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import type { ContributionDay } from '@/lib/github.types'

interface ActivityMetricsProps {
  contributions: ContributionDay[]
}

function getCurrentStreak(days: ContributionDay[]): number {
  const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  for (const day of sorted) {
    if (day.count > 0) streak++
    else break
  }
  return streak
}

function getBestStreak(days: ContributionDay[]): number {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  let best = 0
  let current = 0
  for (const day of sorted) {
    if (day.count > 0) {
      current++
      best = Math.max(best, current)
    } else {
      current = 0
    }
  }
  return best
}

function getWeeklyComparison(
  days: ContributionDay[]
): { thisWeek: number; lastWeek: number; delta: number } {
  const today = new Date()
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - 6)
  const lastWeekStart = new Date(today)
  lastWeekStart.setDate(today.getDate() - 13)
  const lastWeekEnd = new Date(today)
  lastWeekEnd.setDate(today.getDate() - 7)

  const thisWeek = days
    .filter((d) => d.date >= thisWeekStart.toISOString().slice(0, 10))
    .reduce((s, d) => s + d.count, 0)

  const lastWeek = days
    .filter(
      (d) =>
        d.date >= lastWeekStart.toISOString().slice(0, 10) &&
        d.date <= lastWeekEnd.toISOString().slice(0, 10)
    )
    .reduce((s, d) => s + d.count, 0)

  const delta =
    lastWeek === 0 ? 100 : Math.round(((thisWeek - lastWeek) / lastWeek) * 100)

  return { thisWeek, lastWeek, delta }
}

export function ActivityMetrics({ contributions }: ActivityMetricsProps) {
  const currentStreak = getCurrentStreak(contributions)
  const bestStreak = getBestStreak(contributions)
  const { thisWeek, delta } = getWeeklyComparison(contributions)

  const isUp = delta >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Racha actual */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#22d3ee]/30 transition-colors">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Racha actual
        </span>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold font-mono text-white">{currentStreak} días</p>
          </div>
          <IconFlame
            size={20}
            className={currentStreak > 0 ? 'text-orange-400' : 'text-gray-500'}
          />
        </div>
      </div>

      {/* Mejor racha */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#22d3ee]/30 transition-colors">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Mejor racha
        </span>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold font-mono text-white">{bestStreak} días</p>
          </div>
          <IconTrophy size={20} className="text-yellow-400" />
        </div>
      </div>

      {/* Esta semana */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#22d3ee]/30 transition-colors">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Esta semana
        </span>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold font-mono text-white">{thisWeek} commits</p>
            <p className="text-xs text-gray-500 mt-1">
              {delta >= 0 ? '+' : ''}
              {delta}% vs semana pasada
            </p>
          </div>
          {isUp ? (
            <IconTrendingUp size={20} className="text-green-400" />
          ) : (
            <IconTrendingDown size={20} className="text-red-400" />
          )}
        </div>
      </div>
    </div>
  )
}
