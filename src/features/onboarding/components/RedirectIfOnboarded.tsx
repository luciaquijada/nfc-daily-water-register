import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '@/app/routes'
import { SplashScreen } from '@/features/auth/components/SplashScreen'
import { useProfile } from '@/features/profile/hooks/useProfile'

// La ruta de onboarding solo tiene sentido si aún no se ha completado.
export function RedirectIfOnboarded() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return <SplashScreen />
  }

  if (profile?.onboarding_completed) {
    return <Navigate to={routes.today} replace />
  }

  return <Outlet />
}
