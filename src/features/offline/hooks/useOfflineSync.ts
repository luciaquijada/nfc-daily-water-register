import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { isBrowserOnline } from '@/lib/offline/network'
import { syncPendingEntries } from '@/features/hydration/offline/sync-pending-entries'

export function useOfflineSync() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const syncingRef = useRef(false)

  const runSync = useCallback(async () => {
    if (!user?.id || syncingRef.current || !isBrowserOnline()) {
      return
    }

    syncingRef.current = true
    try {
      const result = await syncPendingEntries(queryClient, user.id)
      if (result.synced > 0) {
        toast.success(
          result.synced === 1
            ? '1 registro sincronizado'
            : `${result.synced} registros sincronizados`,
        )
      }
    } finally {
      syncingRef.current = false
    }
  }, [queryClient, user?.id])

  useEffect(() => {
    void runSync()
  }, [runSync])

  useEffect(() => {
    function handleOnline() {
      void runSync()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [runSync])

  return { syncNow: runSync }
}
