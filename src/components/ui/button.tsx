import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-water-primary text-text-on-water shadow-[var(--shadow-soft)] hover:bg-water-deep',
        surface:
          'border border-border-soft bg-surface text-text-primary hover:bg-surface-muted',
        muted: 'bg-surface-muted text-text-primary hover:bg-border-soft',
        ghost: 'bg-transparent text-text-primary hover:bg-surface-muted',
      },
      size: {
        sm: 'h-9 rounded-md px-3 text-sm',
        md: 'h-11 rounded-lg px-5 text-[15px]',
        lg: 'h-14 rounded-xl px-6 text-base',
        icon: 'size-11 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
