import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const APP_NAME = 'Glup glup'

type SplashPhase = 'intro' | 'hold' | 'outro'

type AnimatedLogoProps = {
  size?: 'sm' | 'lg'
  showName?: boolean
  className?: string
  phase?: SplashPhase
}

const BUBBLES = [
  { left: '38%', size: 'clamp(0.2rem, 1.6vmin, 0.4rem)', delay: 0.9, rise: '-13vmin' },
  { left: '52%', size: 'clamp(0.15rem, 1.2vmin, 0.32rem)', delay: 1.05, rise: '-11vmin' },
  { left: '46%', size: 'clamp(0.18rem, 1.4vmin, 0.36rem)', delay: 1.2, rise: '-14vmin' },
  { left: '58%', size: 'clamp(0.12rem, 1vmin, 0.28rem)', delay: 1.35, rise: '-10vmin' },
]

export function AnimatedLogo({
  size = 'lg',
  showName = true,
  className,
  phase = 'intro',
}: AnimatedLogoProps) {
  const reducedMotion = useReducedMotion() ?? false
  const isLarge = size === 'lg'

  const logoAnimate = reducedMotion
    ? { opacity: phase === 'outro' ? 0 : 1 }
    : phase === 'outro'
      ? { scale: 1.08, y: '-4vmin', opacity: 0, filter: 'blur(6px)' }
      : phase === 'hold'
        ? { scale: 1, y: ['0vmin', '-2.4vmin', '0vmin'], opacity: 1, scaleX: 1, scaleY: 1, rotate: 0 }
        : {
            scale: 1,
            y: 0,
            opacity: 1,
            scaleX: [0.5, 1.18, 0.94, 1.03, 1],
            scaleY: [0.5, 0.82, 1.12, 0.97, 1],
            rotate: [-10, 5, -2, 0],
          }

  const logoTransition = reducedMotion
    ? { duration: 0.25 }
    : phase === 'outro'
      ? { duration: 0.45, ease: 'easeIn' as const }
      : phase === 'hold'
        ? {
            y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const },
            scaleX: { duration: 0.01 },
            scaleY: { duration: 0.01 },
          }
        : {
            scaleX: { duration: 0.72, times: [0, 0.42, 0.62, 0.82, 1], ease: 'easeOut' as const },
            scaleY: { duration: 0.72, times: [0, 0.42, 0.62, 0.82, 1], ease: 'easeOut' as const },
            rotate: { duration: 0.72, ease: 'easeOut' as const },
            y: {
              type: 'spring' as const,
              stiffness: 420,
              damping: 22,
              mass: 0.75,
              velocity: 2,
            },
            opacity: { duration: 0.2 },
          }

  return (
    <div
      className={cn(
        'flex w-full max-w-[min(100%,22rem)] flex-col items-center',
        isLarge ? 'gap-[clamp(0.5rem,2.5vmin,0.875rem)]' : 'gap-2',
        className,
      )}
    >
      <div className="relative grid size-[clamp(7rem,42vmin,10rem)] place-items-center">
        {!reducedMotion && phase !== 'outro'
          ? [0, 1, 2].map((index) => (
              <motion.span
                key={`${phase}-${index}`}
                aria-hidden="true"
                className="absolute size-[clamp(3.5rem,20vmin,4.5rem)] rounded-full bg-water-primary/10 ring-2 ring-water-primary/25"
                initial={{ scale: 0.35, opacity: 0.7 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{
                  duration: 1.35,
                  delay: 0.48 + index * 0.22,
                  ease: 'easeOut' as const,
                  repeat: phase === 'hold' ? Infinity : 0,
                  repeatDelay: 1.1,
                }}
              />
            ))
          : null}

        {!reducedMotion && phase !== 'outro'
          ? BUBBLES.map((bubble, index) => (
              <motion.span
                key={index}
                aria-hidden="true"
                className="absolute bottom-[8%] rounded-full border border-water-highlight/70 bg-water-highlight/40"
                style={{
                  left: bubble.left,
                  width: bubble.size,
                  height: bubble.size,
                }}
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], y: bubble.rise, scale: [0.4, 1, 0.7] }}
                transition={{
                  duration: 1.1,
                  delay: bubble.delay,
                  ease: 'easeOut',
                  repeat: phase === 'hold' ? Infinity : 0,
                  repeatDelay: 1.6,
                }}
              />
            ))
          : null}

        {!reducedMotion ? (
          <motion.span
            aria-hidden="true"
            className="absolute size-[clamp(4rem,24vmin,5.5rem)] rounded-full bg-water-primary/20 blur-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              phase === 'outro'
                ? { opacity: 0, scale: 1.4 }
                : { opacity: [0, 0.85, 0.55], scale: [0.5, 1.15, 1] }
            }
            transition={{ duration: phase === 'outro' ? 0.4 : 0.9, ease: 'easeOut' }}
          />
        ) : null}

        <motion.img
          src="/logo.png"
          alt={showName ? '' : APP_NAME}
          aria-hidden={showName}
          className={cn(
            isLarge
              ? 'size-[clamp(4.25rem,24vmin,6.25rem)]'
              : 'size-9',
            'relative z-10 max-h-[28vmin] max-w-[42vw] object-contain drop-shadow-[0_12px_32px_rgba(51,124,240,0.35)]',
          )}
          initial={reducedMotion ? false : { y: '-18vmin', opacity: 0, scale: 0.45 }}
          animate={logoAnimate}
          transition={logoTransition}
        />
      </div>

      {showName ? (
        <motion.div
          className="flex max-w-full items-baseline justify-center gap-[clamp(0.25rem,1.2vmin,0.5rem)] overflow-hidden px-2"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={
            reducedMotion
              ? { opacity: phase === 'outro' ? 0 : 1 }
              : phase === 'outro'
                ? { opacity: 0, y: '1.5vmin', filter: 'blur(4px)' }
                : { opacity: 1, y: 0, filter: 'blur(0px)' }
          }
          transition={{ duration: phase === 'outro' ? 0.35 : 0.45, delay: phase === 'intro' ? 0.55 : 0 }}
        >
          {APP_NAME.split(' ').map((word, index) => (
            <motion.span
              key={word}
              className={cn(
                isLarge
                  ? 'text-[clamp(1.125rem,5vmin,1.5rem)]'
                  : 'text-[16px]',
                'font-semibold text-water-primary',
              )}
              initial={reducedMotion ? false : { opacity: 0, y: '4vmin' }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? undefined
                  : { delay: 0.62 + index * 0.12, duration: 0.45, ease: 'easeOut' as const }
              }
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      ) : null}
    </div>
  )
}
