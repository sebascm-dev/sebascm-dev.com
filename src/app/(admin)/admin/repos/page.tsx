import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { fetchReposWithStats } from '@/lib/github.server'
import { RepoTable } from './_components/RepoTable'

export const revalidate = 300

export default async function ReposPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const repos = await fetchReposWithStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Repositorios</h1>
        <p className="text-sm text-gray-500 mt-1">
          {repos.length} repositorios · ordenados por commits
        </p>
      </div>

      <RepoTable repos={repos} />
    </div>
  )
}
