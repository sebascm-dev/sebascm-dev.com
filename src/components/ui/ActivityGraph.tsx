'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  ReferenceDot
} from 'recharts';
import { IconBrandGithub } from '@tabler/icons-react';
import { processGithubEvents } from '@/lib/github';

interface RepoDetail {
  name: string;
  totalCommits: number;
}

interface DataPoint {
  activity: number;
  repos: string[];
  repoDetails: RepoDetail[];
  date: string;
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (!payload.repos || payload.repos.length === 0) return null;

  return (
    <g>
      {/* Halo exterior */}
      <circle cx={cx} cy={cy} r="10" fill="#22d3ee" opacity="0.08" />
      {/* Halo medio */}
      <circle cx={cx} cy={cy} r="6" fill="#22d3ee" opacity="0.15" />
      {/* Punto principal */}
      <circle cx={cx} cy={cy} r="3.5" fill="#67e8f9" />
      {/* Brillo central */}
      <circle cx={cx} cy={cy} r="1.5" fill="white" opacity="0.8" />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data.repos || data.repos.length === 0) return null;

    const repoDetails: RepoDetail[] = data.repoDetails ?? data.repos.map((name: string) => ({ name, totalCommits: 0 }));
    const date = new Date(data.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const totalCommits = repoDetails.reduce((acc, r) => acc + r.totalCommits, 0);

    return (
      <div className="pointer-events-none select-none" style={{ filter: 'drop-shadow(0 0 16px rgba(34,211,238,0.12))', position: 'relative', zIndex: 50 }}>
        <div className="relative bg-[#0d1a1f]/95 backdrop-blur-2xl border border-cyan-400/40 rounded-xl overflow-hidden w-56" style={{ boxShadow: '0 0 12px rgba(34,211,238,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' }}>

          {/* Barra superior de acento */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Glow interno sutil */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          <div className="px-4 pt-3 pb-4 relative">

            {/* Fecha */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              <span className="text-[10px] font-semibold text-cyan-400/80 uppercase tracking-[0.18em]">
                {date}
              </span>
            </div>

            {/* Repos */}
            <div className="space-y-1.5 mb-3">
              {repoDetails.map((repo, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <IconBrandGithub size={13} className="text-white/30 flex-shrink-0" />
                  <span className="text-[13px] font-semibold text-white/90 tracking-tight leading-tight truncate">
                    {repo.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer — barritas de actividad + total commits */}
            <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Actividad</span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-[3px] items-end h-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-cyan-400/60"
                      style={{ height: `${Math.min(100, (totalCommits / 150) * 100 * (0.4 + i * 0.15))}%` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-cyan-400">{totalCommits}</span>
                <span className="text-[10px] text-white/30">commits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ActivityGraph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/github/activity');
        const json = await response.json();
        
        const history = json.history || [];
        const repos = json.repos || [];
        
        const processedData = processGithubEvents(history, repos);
        setData(processedData);
      } catch (error) {
        console.error('Error loading activity graph:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || data.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 select-none">
      {/* El chart ocupa la mitad superior del hero — los picos quedan en el área libre sobre el texto */}
      <div className="absolute top-[10%] left-0 right-0 h-[85%] pointer-events-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.18} />
                <stop offset="55%" stopColor="#22d3ee" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              offset={16}
              wrapperStyle={{ zIndex: 50 }}
            />

            <Area
              type="natural"
              dataKey="activity"
              stroke="#22d3ee"
              strokeWidth={1.2}
              strokeOpacity={0.7}
              fillOpacity={1}
              fill="url(#colorActivity)"
              dot={<CustomDot />}
              isAnimationActive={true}
              animationDuration={6000}
              animationEasing="ease-in-out"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* NOW — posicionado proporcionalmente a la altura del último punto */}
      {(() => {
        const maxActivity = Math.max(...data.map(d => d.activity));
        const lastActivity = data[data.length - 1].activity;
        // El chart ocupa desde top-[10%] con h-[85%] del contenedor padre
        // Dentro, margin top=20px. Calculamos % relativo al contenedor del gráfico
        const raw = (1 - lastActivity / maxActivity) * 75 + 12;
        const pct = Math.max(38, raw); // nunca más arriba del 38%
        return (
          <div
            className="absolute right-2 flex flex-col items-end gap-1 pointer-events-none z-10"
            style={{ top: `${pct}%` }}
          >
            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-[0.2em]">Now</span>
            <div className="w-[1px] h-4 bg-gradient-to-b from-cyan-400/60 to-transparent" />
          </div>
        );
      })()}

      {/* Label Actividad en Tiempo Real — bottom derecho absoluto */}
      <div className="absolute bottom-4 right-6 flex items-center gap-2 pointer-events-none z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.2em]">
          Actividad en Tiempo Real
        </span>
      </div>

      {/* Fade superior */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      {/* Fade inferior — cubre la zona del texto para que el gráfico no compita */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
      {/* Fade lateral izquierdo */}
      <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
      {/* Fade lateral derecho */}
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}
