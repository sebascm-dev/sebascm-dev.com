'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

interface WeekdayData {
  day: string
  commits: number
}

interface WeekdayChartProps {
  data: WeekdayData[]
}

interface TooltipPayloadEntry {
  value: number
  name: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border border-[#22d3ee] px-3 py-2 text-sm"
      style={{ background: '#1a1a1a' }}
    >
      <p className="text-gray-400">{label}</p>
      <p className="font-mono font-bold text-white">{payload[0].value} commits</p>
    </div>
  )
}

export function WeekdayChart({ data }: WeekdayChartProps) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 flex flex-col justify-end h-full">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-4">
        Commits por día
      </p>
      <ResponsiveContainer width="100%" height="100%" className="flex-1">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34,211,238,0.05)' }} />
          <Bar dataKey="commits" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
