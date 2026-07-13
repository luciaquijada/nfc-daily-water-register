import { Outlet } from 'react-router-dom'
import { AuthBrand } from './AuthBrand'

export function AuthLayout() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),1.5rem)]">
      <div className="pt-2">
        <AuthBrand />
      </div>
      <main className="flex flex-1 flex-col justify-center py-8">
        <Outlet />
      </main>
    </div>
  )
}
