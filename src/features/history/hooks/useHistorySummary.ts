import { useQuery } from '@tanstack/react-query'
import { formatInTimeZone } from 'date-fns-tz'
import { useTodayKey } from '@/features/hydration/hooks/use-today-key'
import { hydrationKeys } from '@/features/hydration/query-keys'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getEntriesInRange } from '../api/history-api'
import { getHistoryRange } from '../utils/range'
import {
  averageDailyMl,
  bestStreak,
  buildDailyTotals,
  countDaysWithData,
  currentStreak,
  daysGoalMet,
  goalCompletionRate,
  groupTotalsByDay,
  sumTotalsMl,
  topDay,
  type DailyTotal,
} from '../utils/stats'
import { formatHistoryDayLabel, formatHistoryDayLong } from '../utils/format'

const HISTORY_DAYS = 30
const WEEK_DAYS = 7

const WEEKDAY_NARROW = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function weekdayLabel(dayKey: string): string {
  return WEEKDAY_NARROW[new Date(`${dayKey}T00:00:00`).getDay()] ?? ''
}

function toWeekBar(day: DailyTotal, goalMl: number): WeekBar {
  return {
    dayKey: day.dayKey,
    label: weekdayLabel(day.dayKey),
    dateLabel: formatHistoryDayLabel(day.dayKey),
    totalMl: day.totalMl,
    goalMet: day.goalMet,
    goalMl,
    progress: goalMl > 0 ? Math.min(day.totalMl / goalMl, 1) : 0,
  }
}

function buildMonthWeekBars(allTotals: DailyTotal[], goalMl: number): WeekBar[] {
  const chunks: DailyTotal[][] = []
  for (let index = 0; index < allTotals.length; index += 7) {
    chunks.push(allTotals.slice(index, index + 7))
  }

  return chunks.map((chunk, index) => {
    const totalMl = sumTotalsMl(chunk)
    const daysInChunk = chunk.length
    const avgMl = daysInChunk > 0 ? Math.round(totalMl / daysInChunk) : 0
    return {
      dayKey: `week-${index}`,
      label: `S${index + 1}`,
      dateLabel: `Semana ${index + 1}`,
      totalMl: avgMl,
      goalMet: daysGoalMet(chunk) === daysInChunk && daysInChunk > 0,
      goalMl,
      progress: goalMl > 0 ? Math.min(avgMl / goalMl, 1) : 0,
    }
  })
}

export type WeekBar = {
  dayKey: string
  label: string
  dateLabel: string
  totalMl: number
  goalMet: boolean
  goalMl: number
  progress: number
}

export type HistorySummary = {
  goalMl: number
  weekBars: WeekBar[]
  weekTotalMl: number
  weekAverageMl: number
  weekDaysGoalMet: number
  weekDaysActive: number
  weekGoalCompletionPct: number
  weekComparisonPct: number | null
  weekEntriesCount: number
  monthTotalMl: number
  monthAverageMl: number
  monthDaysActive: number
  currentStreak: number
  bestStreak: number
  topDay: DailyTotal | null
  topDayLabel: string | null
  monthTopDay: DailyTotal | null
  monthTopDayLabel: string | null
  monthBars: WeekBar[]
  monthWeekBars: WeekBar[]
  hasData: boolean
  hasTodayData: boolean
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
  const topWeekDay = topDay(weekTotals)
  const topMonthDay = topDay(allTotals)
  const todayKey = range.dayKeys[range.dayKeys.length - 1] ?? ''
  const todayTotal = totalsByDay.get(todayKey) ?? 0

  const weekStartKey = weekTotals[0]?.dayKey
  const weekEntriesCount = weekStartKey
    ? entries.filter(
        (entry) =>
          formatInTimeZone(new Date(entry.consumed_at), timezone, 'yyyy-MM-dd') >= weekStartKey,
      ).length
    : 0

  const summary: HistorySummary = {
    goalMl,
    weekBars: weekTotals.map((day) => toWeekBar(day, goalMl)),
    weekTotalMl,
    weekAverageMl: averageDailyMl(weekTotals),
    weekDaysGoalMet: daysGoalMet(weekTotals),
    weekDaysActive: countDaysWithData(weekTotals),
    weekGoalCompletionPct: goalCompletionRate(weekTotals),
    weekComparisonPct:
      prevWeekTotalMl > 0
        ? Math.round(((weekTotalMl - prevWeekTotalMl) / prevWeekTotalMl) * 100)
        : null,
    weekEntriesCount,
    monthTotalMl: sumTotalsMl(allTotals),
    monthAverageMl: averageDailyMl(allTotals.filter((day) => day.totalMl > 0)),
    monthDaysActive: countDaysWithData(allTotals),
    currentStreak: currentStreak(allTotals),
    bestStreak: bestStreak(allTotals),
    topDay: topWeekDay,
    topDayLabel: topWeekDay ? formatHistoryDayLong(topWeekDay.dayKey) : null,
    monthTopDay: topMonthDay,
    monthTopDayLabel: topMonthDay ? formatHistoryDayLong(topMonthDay.dayKey) : null,
    monthBars: allTotals.map((day) => toWeekBar(day, goalMl)),
    monthWeekBars: buildMonthWeekBars(allTotals, goalMl),
    hasData: entries.length > 0,
    hasTodayData: todayTotal > 0,
  }

  return { isLoading: query.isLoading, isError: query.isError, refetch: query.refetch, summary }
}
