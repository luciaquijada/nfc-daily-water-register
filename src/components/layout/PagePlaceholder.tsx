import type { LucideIcon } from 'lucide-react'

type PagePlaceholderProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function PagePlaceholder({ title, description, icon: Icon }: PagePlaceholderProps) {
  return (
    <div className="flex h-full flex-col px-6 pt-6">
      <header className="pb-8 text-center">
        <h1 className="text-[30px] font-semibold text-text-primary">{title}</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
        <span className="grid size-16 place-items-center rounded-xl bg-surface text-water-primary shadow-[var(--shadow-soft)]">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="max-w-[15rem] text-[15px] text-text-secondary">{description}</p>
      </div>
    </div>
  )
}
