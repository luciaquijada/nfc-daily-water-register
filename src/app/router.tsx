import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RequireAnon } from '@/features/auth/components/RequireAnon'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { RedirectIfOnboarded } from '@/features/onboarding/components/RedirectIfOnboarded'
import { RequireOnboarding } from '@/features/onboarding/components/RequireOnboarding'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { LoginPage } from '@/pages/LoginPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { QuickAddPage } from '@/pages/QuickAddPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { TodayPage } from '@/pages/TodayPage'
import { UpdatePasswordPage } from '@/pages/UpdatePasswordPage'
import { routes } from './routes'

export function AppRouter() {
  return (
    <Routes>
      {/* Solo invitados: si ya hay sesión, los guards redirigen a la app */}
      <Route element={<RequireAnon />}>
        <Route element={<AuthLayout />}>
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.signUp} element={<SignUpPage />} />
          <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Restablecer contraseña: se accede con la sesión temporal del enlace */}
      <Route element={<AuthLayout />}>
        <Route path={routes.updatePassword} element={<UpdatePasswordPage />} />
      </Route>

      {/* Autenticado */}
      <Route element={<RequireAuth />}>
        {/* Onboarding: solo mientras no esté completo */}
        <Route element={<RedirectIfOnboarded />}>
          <Route path={routes.onboarding} element={<OnboardingPage />} />
        </Route>

        {/* App: requiere onboarding completo */}
        <Route element={<RequireOnboarding />}>
          {/* Registro rápido (NFC / atajos): pantalla completa, sin barra inferior */}
          <Route path={routes.quickAdd} element={<QuickAddPage />} />

          <Route element={<AppLayout />}>
            <Route path={routes.today} element={<TodayPage />} />
            <Route path={routes.history} element={<HistoryPage />} />
            <Route path={routes.profile} element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={routes.today} replace />} />
    </Routes>
  )
}
