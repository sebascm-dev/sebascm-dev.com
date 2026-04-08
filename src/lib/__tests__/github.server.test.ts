import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('fetchReposWithStats', () => {
  const originalToken = process.env.GITHUB_TOKEN

  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'test-token'
    mockFetch.mockReset()
  })

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.GITHUB_TOKEN
    } else {
      process.env.GITHUB_TOKEN = originalToken
    }
  })

  it('should return RepoWithStats[] on happy path', async () => {
    const gqlResponse = {
      data: {
        user: {
          repositories: {
            nodes: [
              {
                name: 'test-repo',
                url: 'https://github.com/sebascm-dev/test-repo',
                description: 'A test repo',
                stargazerCount: 5,
                forkCount: 2,
                primaryLanguage: { name: 'TypeScript' },
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-06-01T00:00:00Z',
                isPrivate: false,
                defaultBranch: { name: 'main' },
                defaultBranchRef: {
                  target: {
                    history: { totalCount: 42 }
                  }
                },
                openIssues: { totalCount: 3 },
              }
            ]
          }
        }
      }
    }

    const languagesResponse = { TypeScript: 10000, JavaScript: 2000 }

    // GraphQL call returns repos, REST call returns languages
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => gqlResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => languagesResponse,
      })

    const { fetchReposWithStats } = await import('../github.server')
    const repos = await fetchReposWithStats()

    expect(Array.isArray(repos)).toBe(true)
    expect(repos.length).toBe(1)
    expect(repos[0].name).toBe('test-repo')
    expect(repos[0].totalCommits).toBe(42)
    expect(repos[0].stargazerCount).toBe(5)
    expect(Array.isArray(repos[0].languages)).toBe(true)
  })

  it('should throw when GITHUB_TOKEN is missing', async () => {
    delete process.env.GITHUB_TOKEN
    // Re-import fresh module without token
    vi.resetModules()
    const { fetchReposWithStats } = await import('../github.server')
    await expect(fetchReposWithStats()).rejects.toThrow(/token/i)
  })

  it('should throw on GitHub 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Bad credentials' }),
    })

    vi.resetModules()
    process.env.GITHUB_TOKEN = 'bad-token'
    const { fetchReposWithStats } = await import('../github.server')
    await expect(fetchReposWithStats()).rejects.toThrow(/401|unauthorized|bad credentials/i)
  })
})

describe('fetchLanguageBreakdown', () => {
  const originalToken = process.env.GITHUB_TOKEN

  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'test-token'
    mockFetch.mockReset()
    vi.resetModules()
  })

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.GITHUB_TOKEN
    } else {
      process.env.GITHUB_TOKEN = originalToken
    }
  })

  it('should return sorted LanguageStat[] on happy path', async () => {
    // First call: list repos
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'repo1' }, { name: 'repo2' }],
      })
      // Second call: languages for repo1
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ TypeScript: 50000, JavaScript: 10000 }),
      })
      // Third call: languages for repo2
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ TypeScript: 20000, Python: 5000 }),
      })

    const { fetchLanguageBreakdown } = await import('../github.server')
    const stats = await fetchLanguageBreakdown()

    expect(Array.isArray(stats)).toBe(true)
    expect(stats.length).toBeGreaterThan(0)
    // Should be sorted by bytes descending
    expect(stats[0].language).toBe('TypeScript')
    expect(stats[0].bytes).toBe(70000) // 50000 + 20000
    // Percentages should sum to ~100
    const total = stats.reduce((sum, s) => sum + s.percentage, 0)
    expect(total).toBeCloseTo(100, 0)
  })

  it('should return empty array when repos have no languages', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'empty-repo' }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

    const { fetchLanguageBreakdown } = await import('../github.server')
    const stats = await fetchLanguageBreakdown()
    expect(stats).toHaveLength(0)
  })
})

describe('dispatchWorkflow', () => {
  const originalToken = process.env.GITHUB_TOKEN

  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'test-token'
    mockFetch.mockReset()
    vi.resetModules()
  })

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.GITHUB_TOKEN
    } else {
      process.env.GITHUB_TOKEN = originalToken
    }
  })

  it('should return {accepted:true} on 204', async () => {
    mockFetch.mockResolvedValueOnce({ status: 204 })

    const { dispatchWorkflow } = await import('../github.server')
    const result = await dispatchWorkflow({
      repo: 'sebascm-dev/test-repo',
      workflowId: 'deploy.yml',
      ref: 'main',
    })

    expect(result.accepted).toBe(true)
    expect(result.repo).toBe('sebascm-dev/test-repo')
    expect(result.workflowId).toBe('deploy.yml')
  })

  it('should throw with status when non-204', async () => {
    mockFetch.mockResolvedValueOnce({ status: 422 })

    const { dispatchWorkflow } = await import('../github.server')
    await expect(
      dispatchWorkflow({
        repo: 'sebascm-dev/test-repo',
        workflowId: 'deploy.yml',
        ref: 'main',
      })
    ).rejects.toThrow(/422/)
  })
})
