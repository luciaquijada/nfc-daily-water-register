import { useReducedMotion } from 'motion/react'
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMl } from '@/features/hydration/utils/progress'
import type { WeekBar } from '../hooks/useHistorySummary'

type WeeklyHydrationChartProps = {
  bars: WeekBar[]
  goalMl: number
  className?: string
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: WeekBar }>
}) {
  if (!active || !payload?.[0]?.payload) {
    return null
  }

  const bar = payload[0].payload

  return (
    <div className="rounded-xl border border-border-soft bg-surface px-3 py-2 shadow-[var(--shadow-soft)]">
      <p className="text-[12px] capitalize text-text-secondary">{bar.dateLabel}</p>
      <p className="text-[15px] font-semibold tabular-nums text-text-primary">
        {formatMl(bar.totalMl)} ml
      </p>
      <p className="text-[12px] text-text-secondary">
        {bar.goalMet ? 'Objetivo cumplido' : `Objetivo: ${formatMl(bar.goalMl)} ml`}
      </p>
    </div>
  )
}

export function WeeklyHydrationChart({ bars, goalMl, className }: WeeklyHydrationChartProps) {
  const reduced = useReducedMotion() ?? false
  const maxValue = Math.max(goalMl, ...bars.map((bar) => bar.totalMl), 1)

  return (
    <div className={className ?? 'h-40 w-full'} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bars}
          margin={{ top: 16, right: 4, bottom: 0, left: 4 }}
          barCategoryGap="22%"
        >
          <YAxis hide domain={[0, maxValue * 1.08]} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontWeight: 500 }}
          />
          <Tooltip
            cursor={{ fill: 'var(--water-primary)', opacity: 0.08, radius: 8 }}
            content={<ChartTooltip />}
          />
          <ReferenceLine
            y={goalMl}
            stroke="var(--water-primary)"
            strokeDasharray="4 4"
            strokeOpacity={0.45}
          />
          <Bar dataKey="totalMl" radius={[10, 10, 4, 4]} isAnimationActive={!reduced} maxBarSize={36}>
            {bars.map((bar) => (
              <Cell
                key={bar.dayKey}
                fill={bar.goalMet ? 'var(--water-primary)' : 'var(--water-light)'}
                fillOpacity={bar.totalMl > 0 ? (bar.goalMet ? 1 : 0.55) : 0.25}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
