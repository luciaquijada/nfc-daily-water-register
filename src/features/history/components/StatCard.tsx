import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: string
  hint?: string
  icon?: LucideIcon
  variant?: 'default' | 'highlight'
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[20px] border p-4 shadow-[var(--shadow-soft)]',
        variant === 'highlight'
          ? 'border-water-primary/20 bg-linear-to-br from-water-primary/10 to-surface'
          : 'border-border-soft bg-surface',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-text-secondary">{label}</p>
        {Icon ? (
          <span
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-full',
              variant === 'highlight'
                ? 'bg-water-primary/15 text-water-primary'
                : 'bg-surface-muted text-water-primary',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-[22px] font-semibold tabular-nums leading-none text-text-primary">
          {value}
        </p>
        {hint ? <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">{hint}</p> : null}
      </div>
    </div>
  )
}
