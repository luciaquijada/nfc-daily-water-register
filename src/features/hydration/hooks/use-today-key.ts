import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { formatDayKey, getDayRangeUtc } from '../utils/dates'

const DEFAULT_TIMEZONE = 'Europe/Madrid'

// Contexto del día actual (usuario, zona horaria del perfil, clave y rango UTC).
// Query y mutaciones comparten la misma clave para que los updates optimistas
// apunten a la caché correcta.
export function useTodayKey() {
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const timezone = profile?.timezone ?? DEFAULT_TIMEZONE
  const now = new Date()

  return {
    userId: user?.id,
    timezone,
    dayKey: formatDayKey(timezone, now),
    range: getDayRangeUtc(timezone, now),
  }
}
