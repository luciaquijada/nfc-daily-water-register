import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { routes } from '@/app/routes'
import { useAuth } from '../hooks/useAuth'
import { SplashScreen } from './SplashScreen'

// Rutas solo para invitados (login, registro, recuperar). Si ya hay sesión,
// redirige a la app (o al destino guardado por RequireAuth).
export function RequireAnon() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <SplashScreen />
  }

  if (status === 'authenticated') {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? routes.today} replace />
  }

  return <Outlet />
}
