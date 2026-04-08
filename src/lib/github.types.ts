import type React from 'react'

export interface GithubRepo {
  name: string
  fullName: string
  description: string | null
  language: string | null
  stargazerCount: number
  forkCount: number
  updatedAt: string
  createdAt: string
  url: string
  isPrivate: boolean
  defaultBranch: string
  totalCommits: number
  openIssues: number
}

export interface ContributionDay {
  date: string
  count: number
}

export interface LanguageStat {
  language: string
  bytes: number
  percentage: number
  color: string
}

export interface RepoWithStats extends GithubRepo {
  languages: LanguageStat[]
}

export interface GithubSummary {
  totalRepos: number
  totalStars: number
  totalCommitsThisYear: number
  topLanguage: string
  publicRepos: number
  privateRepos: number
}

export interface WorkflowDispatchPayload {
  repo: string
  workflowId: string
  ref: string
  inputs?: Record<string, string>
}

export type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}
