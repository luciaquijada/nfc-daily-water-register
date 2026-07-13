import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ProgressRingProps = {
  progress: number
  size?: number
  strokeWidth?: number
  goalReached?: boolean
  children?: ReactNode
  className?: string
}

const VIEWBOX_SIZE = 100
const DEFAULT_STROKE_VB = 6

function RingSvg({
  progress,
  strokeWidthVb,
  goalReached,
}: {
  progress: number
  strokeWidthVb: number
  goalReached: boolean
}) {
  const radius = (VIEWBOX_SIZE - strokeWidthVb) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(progress, 0), 1)
  const offset = circumference * (1 - clamped)

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      className="h-full w-full -rotate-90"
      aria-hidden="true"
    >
      <circle
        cx={VIEWBOX_SIZE / 2}
        cy={VIEWBOX_SIZE / 2}
        r={radius}
        fill="none"
        stroke="var(--border-soft)"
        strokeWidth={strokeWidthVb}
        opacity={0.6}
      />
      <circle
        cx={VIEWBOX_SIZE / 2}
        cy={VIEWBOX_SIZE / 2}
        r={radius}
        fill="none"
        stroke={goalReached ? 'var(--water-primary)' : 'var(--water-light)'}
        strokeWidth={strokeWidthVb}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </svg>
  )
}

export function ProgressRing({
  progress,
  size,
  strokeWidth = 12,
  goalReached = false,
  children,
  className,
}: ProgressRingProps) {
  if (size !== undefined) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const clamped = Math.min(Math.max(progress, 0), 1)
    const offset = circumference * (1 - clamped)

    return (
      <div
        className={cn('relative grid place-items-center', className)}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-soft)"
            strokeWidth={strokeWidth}
            opacity={0.6}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={goalReached ? 'var(--water-primary)' : 'var(--water-light)'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">{children}</div>
      </div>
    )
  }

  const strokeWidthVb = (strokeWidth / 168) * VIEWBOX_SIZE

  return (
    <div
      className={cn(
        'relative grid aspect-square place-items-center',
        'h-[var(--progress-ring-size)] w-[var(--progress-ring-size)]',
        className,
      )}
    >
      <RingSvg progress={progress} strokeWidthVb={strokeWidthVb || DEFAULT_STROKE_VB} goalReached={goalReached} />
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}
