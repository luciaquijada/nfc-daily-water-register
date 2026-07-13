import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FullScreenStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function FullScreenState({
  icon: Icon,
  title,
  description,
  action,
}: FullScreenStateProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      {Icon ? (
        <span className="grid size-16 place-items-center rounded-2xl bg-surface text-water-primary shadow-[var(--shadow-soft)]">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
      ) : null}
      <h1 className="text-[22px] font-semibold text-text-primary">{title}</h1>
      {description ? (
        <p className="max-w-[18rem] text-[15px] text-text-secondary">{description}</p>
      ) : null}
      {action ? (
        <Button variant="surface" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
