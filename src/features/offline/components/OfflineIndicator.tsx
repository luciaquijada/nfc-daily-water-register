import { CloudOff, RefreshCw } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePendingSyncCount } from '@/features/hydration/hooks/usePendingEntries'
import { useOfflineActions } from '@/features/offline/offline-context'
import { useOnlineStatus } from '@/lib/offline/network'
import { cn } from '@/lib/utils'

export function OfflineIndicator() {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const { data: pendingCount = 0 } = usePendingSyncCount(user?.id)
  const { syncNow } = useOfflineActions()

  if (isOnline && pendingCount === 0) {
    return null
  }

  return (
    <div
      role="status"
      className={cn(
        'sticky top-2 z-20 mx-4 flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3 py-2 text-[13px] shadow-[var(--shadow-soft)]',
        !isOnline && 'border-warning/40 bg-[#fffbeb]',
      )}
    >
      {isOnline ? (
        <RefreshCw className="h-4 w-4 shrink-0 text-water-primary" aria-hidden="true" />
      ) : (
        <CloudOff className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      )}
      <p className="flex-1 leading-snug text-text-primary">
        {!isOnline
          ? 'Sin conexión. Los registros se guardarán localmente.'
          : pendingCount === 1
            ? '1 registro pendiente de sincronizar'
            : `${pendingCount} registros pendientes de sincronizar`}
      </p>
      {isOnline && pendingCount > 0 ? (
        <button
          type="button"
          onClick={() => void syncNow()}
          className="shrink-0 font-medium text-water-primary"
        >
          Sincronizar
        </button>
      ) : null}
    </div>
  )
}
