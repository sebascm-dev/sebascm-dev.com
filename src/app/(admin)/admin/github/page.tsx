import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { fetchReposWithStats, fetchLanguageBreakdown } from '@/lib/github.server'
import { SummaryStats } from './_components/SummaryStats'
import { ContributionsChart } from './_components/ContributionsChart'
import { TopReposCard } from './_components/TopReposCard'
import { LanguageBreakdown } from './_components/LanguageBreakdown'
import type { ContributionDay } from '@/lib/github.types'

export const revalidate = 300

function SectionSkeleton({ height = 180 }: { height?: number }) {
  return (
    <div
      className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl animate-pulse"
      style={{ height }}
    />
  )
}

async function fetchContributions(): Promise<ContributionDay[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/github/activity`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = (await res.json()) as { history?: ContributionDay[] }
    return data.history ?? []
  } catch {
    return []
  }
}

export default async function GithubPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const [repos, languages, contributions] = await Promise.all([
    fetchReposWithStats(),
    fetchLanguageBreakdown(),
    fetchContributions(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white font-[var(--font-fira-code)]">GitHub</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de actividad y repositorios</p>
      </div>

      <Suspense fallback={<SectionSkeleton height={88} />}>
        <SummaryStats repos={repos} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={260} />}>
        <ContributionsChart data={contributions} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SectionSkeleton height={280} />}>
          <TopReposCard repos={repos} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton height={280} />}>
          <LanguageBreakdown data={languages} />
        </Suspense>
      </div>
    </div>
  )
}
