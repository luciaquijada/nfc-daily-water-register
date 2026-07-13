import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { routes } from '@/app/routes'
import { useAuth } from '../hooks/useAuth'
import { SplashScreen } from './SplashScreen'

// Protege rutas privadas: redirige a login si no hay sesión y recuerda el
// destino para volver a él tras iniciar sesión.
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <SplashScreen />
  }

  if (status === 'unauthenticated') {
    // Conserva ruta + query (p. ej. /quick-add?amount=600) para volver tras login.
    return (
      <Navigate
        to={routes.login}
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <Outlet />
}
