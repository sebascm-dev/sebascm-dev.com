'use client'

import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { LanguageStat } from '@/lib/github.types'

interface LanguageBreakdownProps {
  data: LanguageStat[]
}

export function LanguageBreakdown({ data }: LanguageBreakdownProps) {
  if (data.length === 0) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6 flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Sin datos de lenguajes</p>
      </div>
    )
  }

  // Show top 8 + "Others"
  const topData = data.slice(0, 8)
  const othersBytes = data.slice(8).reduce((sum, s) => sum + s.bytes, 0)
  const totalBytes = data.reduce((sum, s) => sum + s.bytes, 0)
  const chartData =
    othersBytes > 0
      ? [...topData, { language: 'Otros', bytes: othersBytes, percentage: (othersBytes / totalBytes) * 100, color: '#374151' }]
      : topData

  const topLanguage = chartData[0]?.language ?? ''

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Lenguajes</h3>
      <div className="flex flex-row gap-6 items-center">
        {/* Donut */}
        <div className="shrink-0">
          <PieChart width={160} height={160}>
            <Pie
              data={chartData}
              dataKey="bytes"
              nameKey="language"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              strokeWidth={0}
              cx={80}
              cy={80}
            >
              {chartData.map((entry) => (
                <Cell key={entry.language} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1a1a1a',
                border: '1px solid #22d3ee',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => [`${((value / totalBytes) * 100).toFixed(1)}%`, name]}
            />
            {/* Center label */}
            {topLanguage && (
              <text
                x={80}
                y={80}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e5e7eb"
                fontSize={11}
                fontFamily="monospace"
                fontWeight={600}
              >
                {topLanguage}
              </text>
            )}
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-0">
          {chartData.map((stat) => (
            <div key={stat.language} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-xs text-gray-400 truncate">{stat.language}</span>
              <span className="text-xs text-gray-600 ml-auto pl-2 shrink-0">{stat.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
