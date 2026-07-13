import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'

type HistorySummaryHeaderProps = {
  eyebrow: string
  totalMl: number
  subtitle: string
  comparisonPct?: number | null
  compact?: boolean
}

export function HistorySummaryHeader({
  eyebrow,
  totalMl,
  subtitle,
  comparisonPct = null,
  compact = false,
}: HistorySummaryHeaderProps) {
  const TrendIcon =
    comparisonPct !== null && comparisonPct < 0 ? TrendingDown : TrendingUp

  return (
    <div className="shrink-0">
      <p className="text-[12px] font-medium text-water-primary">{eyebrow}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p
          className={cn(
            'font-bold tabular-nums leading-none text-text-primary',
            compact
              ? 'text-[clamp(1.5rem,7vw,2rem)]'
              : 'text-[clamp(1.75rem,8vw,2.375rem)]',
          )}
        >
          {formatMl(totalMl)}
          <span className="ml-1 text-[clamp(0.8125rem,3.5vw,1rem)] font-semibold text-text-secondary">ml</span>
        </p>
        {comparisonPct !== null ? (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums',
              comparisonPct >= 0
                ? 'bg-water-primary/15 text-water-primary'
                : 'bg-surface-muted text-text-secondary',
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {comparisonPct >= 0 ? '+' : '−'}
            {Math.abs(comparisonPct)}%
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 text-[13px] text-text-secondary">{subtitle}</p>
    </div>
  )
}
