import { useReducedMotion } from 'motion/react'
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts'
import type { WeekBar } from '../hooks/useHistorySummary'

type WeeklyHydrationChartProps = {
  bars: WeekBar[]
}

export function WeeklyHydrationChart({ bars }: WeeklyHydrationChartProps) {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="h-40 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bars} margin={{ top: 12, right: 0, bottom: 0, left: 0 }} barCategoryGap="26%">
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
          />
          <Bar dataKey="totalMl" radius={8} isAnimationActive={!reduced}>
            {bars.map((bar) => (
              <Cell
                key={bar.dayKey}
                fill={bar.goalMet ? 'var(--water-primary)' : 'var(--border-soft)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
