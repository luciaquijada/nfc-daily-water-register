import { useQuery } from '@tanstack/react-query'
import { useTodayKey } from '@/features/hydration/hooks/use-today-key'
import { hydrationKeys } from '@/features/hydration/query-keys'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getEntriesInRange } from '../api/history-api'
import { getHistoryRange } from '../utils/range'
import {
  averageDailyMl,
  bestStreak,
  buildDailyTotals,
  currentStreak,
  daysGoalMet,
  groupTotalsByDay,
  sumTotalsMl,
  topDay,
  type DailyTotal,
} from '../utils/stats'

const HISTORY_DAYS = 30
const WEEK_DAYS = 7

const WEEKDAY_NARROW = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function weekdayLabel(dayKey: string): string {
  return WEEKDAY_NARROW[new Date(`${dayKey}T00:00:00`).getDay()] ?? ''
}

export type WeekBar = {
  dayKey: string
  label: string
  totalMl: number
  goalMet: boolean
}

export type HistorySummary = {
  goalMl: number
  weekBars: WeekBar[]
  weekTotalMl: number
  weekAverageMl: number
  weekDaysGoalMet: number
  weekComparisonPct: number | null
  currentStreak: number
  bestStreak: number
  topDay: DailyTotal | null
  hasData: boolean
}

export function useHistorySummary() {
  const { userId, timezone } = useTodayKey()
  const { data: profile } = useProfile()
  const goalMl = profile?.daily_goal_ml ?? 2000
  const range = getHistoryRange(timezone, HISTORY_DAYS)

  const fromKey = range.dayKeys[0] ?? ''
  const toKey = range.dayKeys[range.dayKeys.length - 1] ?? ''

  const query = useQuery({
    queryKey: hydrationKeys.history(userId, fromKey, toKey),
    queryFn: () =>
      getEntriesInRange(
        userId as string,
        range.startUtc.toISOString(),
        range.endUtc.toISOString(),
      ),
    enabled: Boolean(userId),
  })

  const entries = query.data ?? []
  const totalsByDay = groupTotalsByDay(entries, timezone)
  const allTotals = buildDailyTotals(range.dayKeys, totalsByDay, goalMl)

  const weekTotals = allTotals.slice(-WEEK_DAYS)
  const prevWeekTotals = allTotals.slice(-WEEK_DAYS * 2, -WEEK_DAYS)
  const weekTotalMl = sumTotalsMl(weekTotals)
  const prevWeekTotalMl = sumTotalsMl(prevWeekTotals)

  const summary: HistorySummary = {
    goalMl,
    weekBars: weekTotals.map((day) => ({
      dayKey: day.dayKey,
      label: weekdayLabel(day.dayKey),
      totalMl: day.totalMl,
      goalMet: day.goalMet,
    })),
    weekTotalMl,
    weekAverageMl: averageDailyMl(weekTotals),
    weekDaysGoalMet: daysGoalMet(weekTotals),
    weekComparisonPct:
      prevWeekTotalMl > 0
        ? Math.round(((weekTotalMl - prevWeekTotalMl) / prevWeekTotalMl) * 100)
        : null,
    currentStreak: currentStreak(allTotals),
    bestStreak: bestStreak(allTotals),
    topDay: topDay(weekTotals),
    hasData: entries.length > 0,
  }

  return { isLoading: query.isLoading, isError: query.isError, refetch: query.refetch, summary }
}
