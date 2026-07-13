import type { ReactNode } from 'react'

type StatChipProps = {
  label: string
  value: ReactNode
}

export function StatChip({ label, value }: StatChipProps) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface px-2.5 py-2 shadow-[var(--shadow-soft)]">
      <p className="truncate text-[10px] text-text-secondary">{label}</p>
      <p className="mt-0.5 truncate text-[13px] font-semibold tabular-nums text-text-primary">
        {value}
      </p>
    </div>
  )
}
