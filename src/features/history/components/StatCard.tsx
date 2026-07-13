type StatCardProps = {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-[18px] bg-surface-muted p-4">
      <p className="text-[13px] text-text-secondary">{label}</p>
      <p className="mt-1 text-[20px] font-semibold tabular-nums text-text-primary">{value}</p>
      {hint ? <p className="mt-0.5 text-[12px] text-text-secondary">{hint}</p> : null}
    </div>
  )
}
