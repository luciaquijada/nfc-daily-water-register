import { formatInTimeZone } from 'date-fns-tz'
import type { HydrationEntry } from '@/features/hydration/types'

export type DailyTotal = { dayKey: string; totalMl: number; goalMet: boolean }

/** Suma de mililitros por día local (yyyy-MM-dd) en la zona horaria dada. */
export function groupTotalsByDay(
  entries: ReadonlyArray<HydrationEntry>,
  timezone: string,
): Map<string, number> {
  const totals = new Map<string, number>()
  for (const entry of entries) {
    const key = formatInTimeZone(new Date(entry.consumed_at), timezone, 'yyyy-MM-dd')
    totals.set(key, (totals.get(key) ?? 0) + entry.amount_ml)
  }
  return totals
}

/** Serie de totales diarios para un conjunto de días (rellena con 0 los vacíos). */
export function buildDailyTotals(
  dayKeys: ReadonlyArray<string>,
  totalsByDay: Map<string, number>,
  goalMl: number,
): DailyTotal[] {
  return dayKeys.map((dayKey) => {
    const totalMl = totalsByDay.get(dayKey) ?? 0
    return { dayKey, totalMl, goalMet: goalMl > 0 && totalMl >= goalMl }
  })
}

export function sumTotalsMl(totals: ReadonlyArray<DailyTotal>): number {
  return totals.reduce((sum, day) => sum + day.totalMl, 0)
}

export function averageDailyMl(totals: ReadonlyArray<DailyTotal>): number {
  if (totals.length === 0) {
    return 0
  }
  return Math.round(sumTotalsMl(totals) / totals.length)
}

export function daysGoalMet(totals: ReadonlyArray<DailyTotal>): number {
  return totals.filter((day) => day.goalMet).length
}

/** Racha actual: días consecutivos cumpliendo objetivo terminando en el último día. */
export function currentStreak(totalsAsc: ReadonlyArray<DailyTotal>): number {
  let streak = 0
  for (let index = totalsAsc.length - 1; index >= 0; index -= 1) {
    if (totalsAsc[index]?.goalMet) {
      streak += 1
    } else {
      break
    }
  }
  return streak
}

/** Mejor racha dentro del rango cargado. */
export function bestStreak(totalsAsc: ReadonlyArray<DailyTotal>): number {
  let best = 0
  let run = 0
  for (const day of totalsAsc) {
    if (day.goalMet) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 0
    }
  }
  return best
}

export function topDay(totals: ReadonlyArray<DailyTotal>): DailyTotal | null {
  let top: DailyTotal | null = null
  for (const day of totals) {
    if (day.totalMl > 0 && (top === null || day.totalMl > top.totalMl)) {
      top = day
    }
  }
  return top
}
