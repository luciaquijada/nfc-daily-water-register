import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TodayHeaderProps = {
  userName: string
  onOpenSettings: () => void
}

export function TodayHeader({ userName, onOpenSettings }: TodayHeaderProps) {
  return (
    <header className="flex items-start justify-between px-6 pt-4">
      <h1 className="min-w-0">
        <span className="block text-[16px] font-normal text-text-secondary">Hola,</span>
        <span className="block truncate text-[26px] font-semibold leading-tight text-text-primary">
          {userName}
        </span>
      </h1>
      <Button
        variant="surface"
        size="icon"
        aria-label="Abrir ajustes"
        onClick={onOpenSettings}
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </Button>
    </header>
  )
}
