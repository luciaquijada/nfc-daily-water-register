import { useEffect, useRef, useState } from 'react'

const ENTRY_FILL_MS = 1800

/** easeOutCubic — sensación de líquido llenando un recipiente */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

/**
 * Anima el progreso del agua desde vacío hasta el valor real al entrar en la pantalla.
 * Tras la animación inicial, sigue el progreso con transiciones normales.
 */
export function useWaterEntryAnimation(targetProgress: number, reducedMotion: boolean) {
  const entryComplete = useRef(reducedMotion)
  const [displayProgress, setDisplayProgress] = useState(() =>
    reducedMotion ? targetProgress : 0,
  )

  useEffect(() => {
    if (reducedMotion) {
      setDisplayProgress(targetProgress)
      entryComplete.current = true
      return
    }

    if (!entryComplete.current) {
      const id = requestAnimationFrame(() => setDisplayProgress(targetProgress))
      return () => cancelAnimationFrame(id)
    }

    setDisplayProgress(targetProgress)
  }, [targetProgress, reducedMotion])

  function markEntryComplete() {
    entryComplete.current = true
  }

  return {
    displayProgress,
    isEntryAnimating: !entryComplete.current,
    markEntryComplete,
  }
}

/**
 * Cuenta desde 0 hasta el valor objetivo en la misma duración que el relleno del agua.
 */
export function useCountUpOnEntry(targetValue: number, reducedMotion: boolean) {
  const entryComplete = useRef(reducedMotion)
  const [displayValue, setDisplayValue] = useState(() => (reducedMotion ? targetValue : 0))

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(targetValue)
      entryComplete.current = true
      return
    }

    if (!entryComplete.current) {
      const from = 0
      const to = targetValue
      const start = performance.now()

      function tick(now: number) {
        const elapsed = now - start
        const t = Math.min(elapsed / ENTRY_FILL_MS, 1)
        setDisplayValue(Math.round(from + (to - from) * easeOutCubic(t)))

        if (t < 1) {
          requestAnimationFrame(tick)
        } else {
          entryComplete.current = true
        }
      }

      const id = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(id)
    }

    setDisplayValue(targetValue)
  }, [targetValue, reducedMotion])

  return displayValue
}

export { ENTRY_FILL_MS }
