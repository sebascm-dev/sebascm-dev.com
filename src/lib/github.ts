export function processGithubEvents(history: { date: string, count: number }[], repos: { name: string, createdAt: string, totalCommits?: number }[]) {
  if (!history || history.length === 0) return [];

  const rawPoints = [];
  const chunkSize = 10;
  
  for (let i = 0; i < history.length; i += chunkSize) {
    const chunk = history.slice(i, i + chunkSize);
    const sum = chunk.reduce((acc, day) => acc + day.count, 0);
    
    const startTs = new Date(chunk[0].date).getTime();
    const endTs = new Date(chunk[chunk.length - 1].date).getTime() + (24 * 60 * 60 * 1000);
    
    const chunkRepos = repos
      .filter(repo => {
        const repoDate = new Date(repo.createdAt).getTime();
        return repoDate >= startTs && repoDate < endTs;
      })
      .map(r => ({ name: r.name, totalCommits: r.totalCommits ?? 0 }));

    rawPoints.push({
      activity: (sum / chunk.length) + 0.1,
      commits: sum,
      repos: chunkRepos.map(r => r.name),
      repoDetails: chunkRepos,
      date: chunk[0].date
    });
  }

  // Suavizado con media móvil de 3 puntos
  const smoothedPoints = rawPoints.map((p, i, arr) => {
    const prev = arr[i - 1]?.activity || p.activity;
    const next = arr[i + 1]?.activity || p.activity;
    return {
      ...p,
      activity: (prev + p.activity + next) / 3,
    };
  });

  return smoothedPoints;
}

// Recharts no necesita calculateSmoothPath manual ya que usa su propia interpolación
