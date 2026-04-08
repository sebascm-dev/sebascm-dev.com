import { describe, it, expect } from 'vitest';
import { processGithubEvents } from '../github';

describe('processGithubEvents', () => {
  it('should process history and repos into activity points', () => {
    const history = [
      { date: '2024-01-01', count: 5 },
      { date: '2024-01-02', count: 3 },
      { date: '2024-01-03', count: 2 },
    ];
    const repos = [
      { name: 'repo1', createdAt: '2024-01-01T00:00:00Z', totalCommits: 10 },
    ];

    const result = processGithubEvents(history, repos);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(point => {
      expect(typeof point.activity).toBe('number');
      expect(typeof point.commits).toBe('number');
      expect(typeof point.date).toBe('string');
      expect(Array.isArray(point.repos)).toBe(true);
    });
  });

  it('should return empty array for empty history', () => {
    const result = processGithubEvents([], []);
    expect(result).toHaveLength(0);
  });

  it('should handle repos with no totalCommits', () => {
    const history = [{ date: '2024-01-01', count: 1 }];
    const repos = [{ name: 'repo1', createdAt: '2024-01-01T00:00:00Z' }];
    const result = processGithubEvents(history, repos);
    expect(Array.isArray(result)).toBe(true);
  });
});
