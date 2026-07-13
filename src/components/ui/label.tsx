import type { LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('text-[14px] font-medium text-text-primary', className)}
      {...props}
    />
  )
}
