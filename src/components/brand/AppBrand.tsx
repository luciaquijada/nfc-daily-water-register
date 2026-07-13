import { cn } from '@/lib/utils'

const APP_NAME = 'Glup glup'

type AppBrandProps = {
  size?: 'sm' | 'md'
  showName?: boolean
  className?: string
}

export function AppBrand({ size = 'md', showName = true, className }: AppBrandProps) {
  const logoSize = size === 'sm' ? 'size-7' : 'size-9'
  const textSize = size === 'sm' ? 'text-[16px]' : 'text-[20px]'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/logo.png"
        alt={showName ? '' : APP_NAME}
        className={cn(logoSize, 'object-contain')}
        aria-hidden={showName}
      />
      {showName ? (
        <span className={cn(textSize, 'font-semibold text-text-primary')}>{APP_NAME}</span>
      ) : null}
    </div>
  )
}
