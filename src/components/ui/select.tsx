import type { Ref, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: Ref<HTMLSelectElement>
}

// Select nativo estilizado: usa el picker del sistema (ideal en iOS).
export function Select({ className, ref, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-12 w-full appearance-none rounded-md border border-border-soft bg-surface px-4 pr-10 text-[16px] text-text-primary outline-none transition-[border-color,box-shadow] focus-visible:border-water-primary focus-visible:ring-2 focus-visible:ring-water-primary/30',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
    </div>
  )
}
