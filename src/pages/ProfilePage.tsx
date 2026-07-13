import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSignOut } from '@/features/auth/hooks/auth-mutations'
import { ProfileForm } from '@/features/profile/components/ProfileForm'
import { useProfile } from '@/features/profile/hooks/useProfile'

function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="h-12 rounded-[20px] bg-surface-muted" />
      <div className="h-36 rounded-[20px] bg-surface-muted" />
      <div className="h-44 rounded-[20px] bg-surface-muted" />
      <div className="h-44 rounded-[20px] bg-surface-muted" />
      <div className="h-52 rounded-[20px] bg-surface-muted" />
    </div>
  )
}

export function ProfilePage() {
  const { user } = useAuth()
  const { data: profile, isLoading, isError, refetch } = useProfile()
  const signOut = useSignOut()

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 pb-6 pt-6">
      <header className="pb-6 text-center">
        <h1 className="text-[30px] font-semibold text-text-primary">Perfil</h1>
      </header>

      {isLoading ? (
        <ProfileSkeleton />
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
          <p className="text-[15px] text-text-secondary">
            No se ha podido cargar tu perfil. Comprueba tu conexión.
          </p>
          <Button variant="surface" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : profile ? (
        <div className="flex flex-col gap-6">
          {user?.email ? (
            <p className="text-center text-[14px] text-text-secondary">{user.email}</p>
          ) : null}

          <ProfileForm profile={profile} />

          <div className="pt-2">
            {signOut.isError ? (
              <p role="alert" className="mb-3 text-center text-[14px] text-error">
                No se ha podido cerrar sesión. Inténtalo de nuevo.
              </p>
            ) : null}
            <Button
              variant="surface"
              size="lg"
              className="w-full"
              onClick={() => signOut.mutate()}
              disabled={signOut.isPending}
            >
              {signOut.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
