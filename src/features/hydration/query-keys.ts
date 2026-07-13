export const hydrationKeys = {
  all: ['hydration'] as const,
  day: (userId: string | undefined, dayKey: string) =>
    ['hydration', userId, 'day', dayKey] as const,
  history: (userId: string | undefined, fromKey: string, toKey: string) =>
    ['hydration', userId, 'history', fromKey, toKey] as const,
}
