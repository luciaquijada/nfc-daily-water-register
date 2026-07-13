import { createContext, useContext, type ReactNode } from 'react'
import { useOfflineSync } from './hooks/useOfflineSync'

type OfflineContextValue = {
  syncNow: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextValue | null>(null)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const { syncNow } = useOfflineSync()

  return <OfflineContext.Provider value={{ syncNow }}>{children}</OfflineContext.Provider>
}

export function useOfflineActions() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOfflineActions debe usarse dentro de OfflineProvider')
  }
  return context
}
