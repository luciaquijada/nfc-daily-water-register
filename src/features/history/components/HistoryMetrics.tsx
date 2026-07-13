import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type HistoryMetricProps = {
  icon: LucideIcon
  label: string
  value: string
  accent?: boolean
}

export function HistoryMetric({ icon: Icon, label, value, accent = false }: HistoryMetricProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-surface-muted/60 px-3 py-2.5">
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-full',
          accent ? 'bg-water-primary/15 text-water-primary' : 'bg-surface text-text-secondary',
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] text-text-secondary">{label}</p>
        <p className="truncate text-[13px] font-semibold tabular-nums text-text-primary">{value}</p>
      </div>
    </div>
  )
}

type HistoryMetricsRowProps = {
  children: ReactNode
}

export function HistoryMetricsRow({ children }: HistoryMetricsRowProps) {
  return <div className="flex shrink-0 gap-2">{children}</div>
}
