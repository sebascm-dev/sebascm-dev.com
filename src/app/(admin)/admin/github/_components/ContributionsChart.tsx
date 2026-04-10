'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { ContributionDay } from '@/lib/github.types'

interface ContributionsChartProps {
  data: ContributionDay[]
}

function formatMonthLabel(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { month: 'short' })
}

function xAxisTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  const date = new Date(payload.value)
  if (date.getDate() !== 1) return <g />
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#6b7280"
        fontSize={11}
      >
        {formatMonthLabel(payload.value)}
      </text>
    </g>
  )
}

export function ContributionsChart({ data }: ContributionsChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6 flex items-center justify-center h-48">
        <p className="text-gray-500 text-sm">Sin datos de contribuciones</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Actividad de contribuciones</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="contributionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
          <XAxis
            dataKey="date"
            tick={xAxisTick as unknown as boolean}
            axisLine={false}
            tickLine={false}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: '#1a1a1a',
              border: '1px solid #22d3ee',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 12,
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value) => [value ?? 0, 'Contribuciones']}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#contributionsGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
