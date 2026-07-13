import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import type { ReactNode } from 'react'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { OfflineProvider } from '@/features/offline/offline-context'
import { SettingsProvider } from '@/features/settings/SettingsProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OfflineProvider>
          <SettingsProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </SettingsProvider>
          <Toaster position="top-center" richColors offset={16} />
        </OfflineProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
