// Server-only. Never import from client components.
import type { RepoWithStats, LanguageStat, WorkflowDispatchPayload } from './github.types'

const GITHUB_API = 'https://api.github.com'
const GITHUB_GRAPHQL = 'https://api.github.com/graphql'
const OWNER = 'sebascm-dev'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#FF5D01',
  MDX: '#fcb32c',
}

function getToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN environment variable is not set')
  return token
}

async function gqlFetch(query: string, variables: Record<string, unknown> = {}): Promise<unknown> {
  const token = getToken()
  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = (await res.json()) as { message?: string }
    throw new Error(`GitHub GraphQL error ${res.status}: ${body.message ?? 'Unknown error'}`)
  }

  return res.json()
}

async function restFetch(path: string, options?: RequestInit): Promise<unknown> {
  const token = getToken()
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options?.headers,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(`GitHub REST error ${res.status}: ${body.message ?? 'Unknown error'}`)
  }

  return res.json()
}

const REPOS_QUERY = `
  query($login: String!, $first: Int!) {
    user(login: $login) {
      repositories(first: $first, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          url
          description
          stargazerCount
          forkCount
          primaryLanguage { name }
          createdAt
          updatedAt
          isPrivate
          defaultBranch: defaultBranchRef { name }
          defaultBranchRef {
            target {
              ... on Commit {
                history { totalCount }
              }
            }
          }
          openIssues: issues(states: OPEN) { totalCount }
        }
      }
    }
  }
`

interface GqlRepo {
  name: string
  url: string
  description: string | null
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string } | null
  createdAt: string
  updatedAt: string
  isPrivate: boolean
  defaultBranch: { name: string } | null
  defaultBranchRef: { target: { history: { totalCount: number } } | null } | null
  openIssues: { totalCount: number }
}

interface GqlResponse {
  data: {
    user: {
      repositories: {
        nodes: GqlRepo[]
      }
    }
  }
}

export async function fetchReposWithStats(): Promise<RepoWithStats[]> {
  const raw = await gqlFetch(REPOS_QUERY, { login: OWNER, first: 100 }) as GqlResponse
  const nodes = raw.data.user.repositories.nodes

  const repos = await Promise.all(
    nodes.map(async (node) => {
      let languages: LanguageStat[] = []
      try {
        const langData = await restFetch(`/repos/${OWNER}/${node.name}/languages`) as Record<string, number>
        const total = Object.values(langData).reduce((s, b) => s + b, 0)
        if (total > 0) {
          languages = Object.entries(langData)
            .map(([lang, bytes]) => ({
              language: lang,
              bytes,
              percentage: (bytes / total) * 100,
              color: LANGUAGE_COLORS[lang] ?? '#8b949e',
            }))
            .sort((a, b) => b.bytes - a.bytes)
        }
      } catch {
        // language fetch failure is non-fatal
      }

      return {
        name: node.name,
        fullName: `${OWNER}/${node.name}`,
        description: node.description,
        language: node.primaryLanguage?.name ?? null,
        stargazerCount: node.stargazerCount,
        forkCount: node.forkCount,
        updatedAt: node.updatedAt,
        createdAt: node.createdAt,
        url: node.url,
        isPrivate: node.isPrivate,
        defaultBranch: node.defaultBranch?.name ?? 'main',
        totalCommits: node.defaultBranchRef?.target?.history?.totalCount ?? 0,
        openIssues: node.openIssues.totalCount,
        languages,
      } satisfies RepoWithStats
    })
  )

  return repos
}

export async function fetchLanguageBreakdown(): Promise<LanguageStat[]> {
  const repoList = await restFetch(`/users/${OWNER}/repos?per_page=100`) as { name: string }[]

  const allBytes: Record<string, number> = {}

  await Promise.all(
    repoList.map(async (repo) => {
      try {
        const langData = await restFetch(`/repos/${OWNER}/${repo.name}/languages`) as Record<string, number>
        for (const [lang, bytes] of Object.entries(langData)) {
          allBytes[lang] = (allBytes[lang] ?? 0) + bytes
        }
      } catch {
        // non-fatal
      }
    })
  )

  const total = Object.values(allBytes).reduce((s, b) => s + b, 0)
  if (total === 0) return []

  return Object.entries(allBytes)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: (bytes / total) * 100,
      color: LANGUAGE_COLORS[language] ?? '#8b949e',
    }))
    .sort((a, b) => b.bytes - a.bytes)
}

export async function dispatchWorkflow(
  payload: WorkflowDispatchPayload
): Promise<{ accepted: true; repo: string; workflowId: string }> {
  const token = getToken()

  const res = await fetch(
    `${GITHUB_API}/repos/${payload.repo}/actions/workflows/${payload.workflowId}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: payload.ref, inputs: payload.inputs ?? {} }),
      cache: 'no-store',
    }
  )

  if (res.status !== 204) {
    throw new Error(`GitHub dispatch failed: ${res.status}`)
  }

  return { accepted: true, repo: payload.repo, workflowId: payload.workflowId }
}
