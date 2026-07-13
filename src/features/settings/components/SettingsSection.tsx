import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SettingsSectionProps = {
  title: string
  description?: string
  children: ReactNode
  compact?: boolean
}

export function SettingsSection({
  title,
  description,
  children,
  compact = false,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-[20px] bg-surface shadow-[var(--shadow-soft)]',
        compact ? 'gap-2 p-3' : 'gap-3 p-4',
      )}
    >
      <header className="flex flex-col gap-0.5">
        <h2
          className={cn(
            'font-semibold text-text-primary',
            compact ? 'text-[14px]' : 'text-[16px]',
          )}
        >
          {title}
        </h2>
        {description && !compact ? (
          <p className="text-[14px] text-text-secondary">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}
