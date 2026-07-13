import { Outlet } from 'react-router-dom'
import { AuthBrand } from './AuthBrand'

export function AuthLayout() {
  return (
    <div className="app-shell scroll-page flex flex-col page-px pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),1.5rem)]">
      <div className="pt-2">
        <AuthBrand />
      </div>
      <main className="flex flex-1 flex-col justify-center py-[clamp(1.5rem,6vh,2rem)]">
        <Outlet />
      </main>
    </div>
  )
}
