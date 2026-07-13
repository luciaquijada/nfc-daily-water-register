import { useSyncExternalStore } from 'react'

export function isBrowserOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

function subscribeOnlineStatus(onStoreChange: () => void) {
  window.addEventListener('online', onStoreChange)
  window.addEventListener('offline', onStoreChange)
  return () => {
    window.removeEventListener('online', onStoreChange)
    window.removeEventListener('offline', onStoreChange)
  }
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribeOnlineStatus,
    isBrowserOnline,
    () => true,
  )
}

/** Errores de red o sin conectividad real que justifican encolar el registro. */
export function isNetworkError(error: unknown): boolean {
  if (!isBrowserOnline()) {
    return true
  }

  if (error instanceof TypeError) {
    return true
  }

  if (error && typeof error === 'object') {
    const record = error as { name?: string; message?: string; status?: number }
    if (
      record.name === 'AuthRetryableFetchError' ||
      record.name === 'FetchError' ||
      record.message?.toLowerCase().includes('fetch') ||
      record.message?.toLowerCase().includes('network')
    ) {
      return true
    }
    if (record.status === 0) {
      return true
    }
  }

  return false
}
