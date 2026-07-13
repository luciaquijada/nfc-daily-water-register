import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TodayHeaderProps = {
  onOpenSettings: () => void
}

export function TodayHeader({ onOpenSettings }: TodayHeaderProps) {
  return (
    <header className="compact-short flex shrink-0 items-center justify-between page-px pt-2 pb-1">
      <span className="text-[15px] font-semibold text-water-primary">Glup glup</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Abrir ajustes"
        onClick={onOpenSettings}
        className="size-9 text-text-secondary hover:text-text-primary"
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </Button>
    </header>
  )
}
