/**
 * Cálculos puros de hidratación. Sin React ni dependencias externas:
 * son la base testeable del progreso diario y se reutilizarán con datos reales.
 */

// useGrouping 'always': es-ES no agrupa 4 cifras por defecto (1800), pero
// queremos el separador de millares también ahí (1.800).
const mlFormatter = new Intl.NumberFormat('es-ES', { useGrouping: 'always' })

/** Progreso 0..1 acotado. Un objetivo <= 0 o datos inválidos devuelven 0. */
export function computeProgress(consumedMl: number, dailyGoalMl: number): number {
  if (dailyGoalMl <= 0) {
    return 0
  }

  const ratio = consumedMl / dailyGoalMl

  if (!Number.isFinite(ratio) || ratio <= 0) {
    return 0
  }

  return Math.min(ratio, 1)
}

/** Mililitros que faltan para el objetivo; nunca negativo. */
export function computeRemainingMl(consumedMl: number, dailyGoalMl: number): number {
  return Math.max(dailyGoalMl - consumedMl, 0)
}

export function hasReachedGoal(consumedMl: number, dailyGoalMl: number): boolean {
  return dailyGoalMl > 0 && consumedMl >= dailyGoalMl
}

/** Porcentaje entero para lectores de pantalla y textos accesibles. */
export function progressToPercent(progress: number): number {
  return Math.round(progress * 100)
}

/** Formatea mililitros al estilo español (1.800). */
export function formatMl(value: number): string {
  return mlFormatter.format(Math.max(Math.round(value), 0))
}

/** Suma total de mililitros de una lista de registros. */
export function sumEntriesMl(entries: ReadonlyArray<{ amount_ml: number }>): number {
  return entries.reduce((total, entry) => total + entry.amount_ml, 0)
}
