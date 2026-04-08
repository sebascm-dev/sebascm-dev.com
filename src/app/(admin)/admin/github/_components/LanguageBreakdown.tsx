'use client'

import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { LanguageStat } from '@/lib/github.types'

interface LanguageBreakdownProps {
  data: LanguageStat[]
}

export function LanguageBreakdown({ data }: LanguageBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Sin datos de lenguajes</p>
      </div>
    )
  }

  const topData = data.slice(0, 5)
  const othersBytes = data.slice(5).reduce((sum, s) => sum + s.bytes, 0)
  const totalBytes = data.reduce((sum, s) => sum + s.bytes, 0)
  const chartData =
    othersBytes > 0
      ? [...topData, { language: 'Otros', bytes: othersBytes, percentage: (othersBytes / totalBytes) * 100, color: '#374151' }]
      : topData

  const topColor = chartData[0]?.color ?? '#22d3ee'
  const topLanguage = chartData[0]?.language ?? ''

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1a1a1a] shrink-0">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest font-medium">Lenguajes</h3>
      </div>

      {/* Content: donut + legend side by side */}
      <div className="flex flex-row items-center gap-4 flex-1 min-h-0 px-4 py-3">
        {/* Donut */}
        <div className="shrink-0" style={{ filter: `drop-shadow(0 0 8px ${topColor}50)` }}>
          <PieChart width={110} height={110}>
            <Pie
              data={chartData}
              dataKey="bytes"
              nameKey="language"
              innerRadius={36}
              outerRadius={50}
              paddingAngle={2}
              strokeWidth={0}
              cx={55}
              cy={55}
            >
              {chartData.map((entry) => (
                <Cell key={entry.language} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#111',
                border: `1px solid ${topColor}`,
                borderRadius: '8px',
                color: '#fff',
                fontSize: 11,
              }}
              formatter={(value: number, name: string) => [`${((value / totalBytes) * 100).toFixed(1)}%`, name]}
            />
            {topLanguage && (
              <text x={55} y={51} textAnchor="middle" dominantBaseline="middle" fill="#e5e7eb" fontSize={9} fontFamily="monospace" fontWeight={700}>
                {topLanguage}
              </text>
            )}
            {chartData[0] && (
              <text x={55} y={63} textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize={9} fontFamily="monospace">
                {chartData[0].percentage.toFixed(1)}%
              </text>
            )}
          </PieChart>
        </div>

        {/* Legend with mini bars */}
        <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
          {chartData.map((stat) => (
            <div key={stat.language} className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                  <span className="text-xs text-gray-400 font-mono truncate">{stat.language}</span>
                </div>
                <span className="text-xs text-gray-600 font-mono shrink-0">{stat.percentage.toFixed(1)}%</span>
              </div>
              <div className="h-px w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${stat.percentage}%`, backgroundColor: stat.color, opacity: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
