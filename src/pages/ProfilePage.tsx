import { Button } from '@/components/ui/button'
import { useSignOut } from '@/features/auth/hooks/auth-mutations'

export function ProfilePage() {
  const signOut = useSignOut()

  return (
    <div className="flex h-full flex-col px-6 pt-6">
      <header className="pb-8 text-center">
        <h1 className="text-[30px] font-semibold text-text-primary">Perfil</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="max-w-[16rem] text-[15px] text-text-secondary">
          Aquí ajustarás tu nombre, objetivo diario y cantidad rápida. Disponible en una
          próxima fase.
        </p>
      </div>

      <div className="pb-8">
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
  )
}
