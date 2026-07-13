import type { InputHTMLAttributes, Ref } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>
}

// text-[16px]: evita el zoom automático de Safari iOS al enfocar el campo.
export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-md border border-border-soft bg-surface px-4 text-[16px] text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-secondary/70 focus-visible:border-water-primary focus-visible:ring-2 focus-visible:ring-water-primary/30 disabled:opacity-60 aria-[invalid=true]:border-error aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error/25',
        className,
      )}
      {...props}
    />
  )
}
