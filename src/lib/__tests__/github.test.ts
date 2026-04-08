import { describe, it, expect } from 'vitest';
import { processGithubEvents, calculateSmoothPath } from '../github';

describe('processGithubEvents', () => {
  it('should group events by 15-day intervals and calculate averages', () => {
    const now = new Date('2024-02-01T10:00:00Z');
    const mockEvents = [
      { created_at: '2024-01-20T10:00:00Z', type: 'PushEvent', payload: { commits: [1, 2] } }, // Bloque 1
      { created_at: '2024-01-25T10:00:00Z', type: 'PushEvent', payload: { commits: [1] } },    // Bloque 1
      { created_at: '2024-01-05T10:00:00Z', type: 'PushEvent', payload: { commits: [1, 2, 3] } }, // Bloque 2
    ];

    const result = processGithubEvents(mockEvents as any, 30, 15, now);
    
    expect(result).toHaveLength(2);
    // Bloque 1 (reciente: 17 ene - 1 feb): 3 commits total / 15 días = 0.2 media
    expect(result[1].average).toBeCloseTo(0.2);
    // Bloque 2 (antiguo: 2 ene - 17 ene): 3 commits total / 15 días = 0.2 media
    expect(result[0].average).toBeCloseTo(0.2);
  });

  it('should return 0 average for empty intervals', () => {
    const result = processGithubEvents([], 30);
    expect(result).toHaveLength(2);
    expect(result[0].average).toBe(0);
  });
});

describe('calculateSmoothPath', () => {
  it('should generate a valid SVG path string', () => {
    const mockData = [
      { average: 0.1 },
      { average: 0.5 },
      { average: 0.2 },
    ];
    const path = calculateSmoothPath(mockData, 100, 100);
    expect(path).toContain('M');
    expect(path).toContain('C'); // Curvas de Bezier
  });
});
