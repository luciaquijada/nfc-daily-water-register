import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '@/app/routes'
import { FullScreenState } from '@/components/feedback/FullScreenState'
import { SplashScreen } from '@/features/auth/components/SplashScreen'
import { useProfile } from '@/features/profile/hooks/useProfile'

// Protege la app: si el onboarding no está completo, lleva al wizard.
export function RequireOnboarding() {
  const { data: profile, isLoading, isError, refetch } = useProfile()

  if (isLoading) {
    return <SplashScreen />
  }

  if (isError) {
    return (
      <FullScreenState
        title="No se ha podido cargar tu perfil"
        description="Comprueba tu conexión e inténtalo de nuevo."
        action={{ label: 'Reintentar', onClick: () => void refetch() }}
      />
    )
  }

  if (!profile?.onboarding_completed) {
    return <Navigate to={routes.onboarding} replace />
  }

  return <Outlet />
}
