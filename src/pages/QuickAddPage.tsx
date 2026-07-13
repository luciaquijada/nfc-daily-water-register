import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Droplet } from 'lucide-react'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { useAddEntry } from '@/features/hydration/hooks/hydration-mutations'
import { quickAddParamsSchema } from '@/features/hydration/schemas/quick-add-schema'
import { formatMl } from '@/features/hydration/utils/progress'

function QuickAddShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center gap-6 px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),1.5rem)] text-center">
      {children}
    </div>
  )
}

export function QuickAddPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const addEntry = useAddEntry()
  // Un id por carga de página: la confirmación explícita evita duplicados por
  // recarga, y el mismo id da idempotencia ante reintentos de red.
  const [clientRequestId] = useState(() => crypto.randomUUID())

  const parsed = quickAddParamsSchema.safeParse({
    amount: searchParams.get('amount'),
    source: searchParams.get('source'),
  })

  if (!parsed.success) {
    return (
      <QuickAddShell>
        <h1 className="text-[24px] font-semibold text-text-primary">Enlace no válido</h1>
        <p className="text-[15px] text-text-secondary">
          El enlace de registro rápido no es correcto.
        </p>
        <Button onClick={() => navigate(routes.today, { replace: true })}>Ir a Hoy</Button>
      </QuickAddShell>
    )
  }

  const { amount, source } = parsed.data

  if (addEntry.isSuccess) {
    return (
      <QuickAddShell>
        <span className="grid size-16 place-items-center rounded-2xl bg-water-primary text-text-on-water shadow-[var(--shadow-soft)]">
          <Check className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-text-primary">¡Registrado!</h1>
          <p className="text-[15px] text-text-secondary">
            Has añadido {formatMl(amount)} ml.
          </p>
        </div>
        <Button size="lg" className="w-full" onClick={() => navigate(routes.today, { replace: true })}>
          Volver a Hoy
        </Button>
      </QuickAddShell>
    )
  }

  return (
    <QuickAddShell>
      <span className="grid size-16 place-items-center rounded-2xl bg-surface text-water-primary shadow-[var(--shadow-soft)]">
        <Droplet className="h-8 w-8" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-[18px] text-text-secondary">Registrar agua</h1>
        <p className="text-[44px] font-bold tabular-nums leading-none text-text-primary">
          {formatMl(amount)}
          <span className="ml-1 text-[22px] font-semibold text-text-secondary">ml</span>
        </p>
      </div>

      {addEntry.isError ? (
        <p role="alert" className="text-[14px] text-error">
          No se ha podido registrar. Inténtalo de nuevo.
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-2">
        <Button
          size="lg"
          className="w-full"
          onClick={() => addEntry.mutate({ amountMl: amount, source, clientRequestId })}
          disabled={addEntry.isPending}
        >
          {addEntry.isPending ? 'Registrando…' : `Añadir ${formatMl(amount)} ml`}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate(routes.today, { replace: true })}
        >
          Cancelar
        </Button>
      </div>
    </QuickAddShell>
  )
}
