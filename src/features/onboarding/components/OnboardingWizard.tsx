import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCompleteOnboarding } from '@/features/profile/hooks/profile-mutations'
import {
  onboardingSchema,
  type OnboardingValues,
} from '@/features/profile/schemas/profile-schemas'
import { AmountStep, GoalStep, NameStep, TimezoneStep } from './onboarding-steps'

const DEFAULT_TIMEZONE = 'Europe/Madrid'

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE
  } catch {
    return DEFAULT_TIMEZONE
  }
}

const STEPS = [
  {
    title: '¿Cómo te llamamos?',
    subtitle: 'Usaremos este nombre para saludarte.',
    fields: ['displayName'] as const,
    render: () => <NameStep />,
  },
  {
    title: 'Tu objetivo diario',
    subtitle: 'Cuánta agua quieres beber al día. Podrás cambiarlo cuando quieras.',
    fields: ['dailyGoalMl'] as const,
    render: () => <GoalStep />,
  },
  {
    title: 'Tu cantidad rápida',
    subtitle: 'La cantidad del botón principal para registrar con un toque.',
    fields: ['defaultAmountMl'] as const,
    render: () => <AmountStep />,
  },
  {
    title: 'Tu zona horaria',
    subtitle: 'Para agrupar tus registros por día correctamente.',
    fields: ['timezone'] as const,
    render: () => <TimezoneStep />,
  },
]

export function OnboardingWizard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const reduce = useReducedMotion() ?? false
  const completeOnboarding = useCompleteOnboarding()

  const [step, setStep] = useState(0)
  const [defaults] = useState<OnboardingValues>(() => ({
    displayName: user?.email?.split('@')[0] ?? '',
    dailyGoalMl: 2000,
    defaultAmountMl: 600,
    timezone: detectTimezone(),
  }))

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaults,
    mode: 'onTouched',
  })

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  async function goNext() {
    const valid = await form.trigger(current?.fields ?? [])
    if (!valid) {
      return
    }
    if (isLast) {
      form.handleSubmit((values) =>
        completeOnboarding.mutate(values, {
          onSuccess: () => navigate(routes.today, { replace: true }),
        }),
      )()
      return
    }
    setStep((value) => value + 1)
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),1.5rem)]">
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          aria-label="Paso anterior"
          disabled={step === 0}
          className="grid size-9 shrink-0 place-items-center rounded-full text-text-secondary disabled:opacity-0"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          <motion.div
            className="h-full rounded-full bg-water-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <FormProvider {...form}>
        <div className="flex flex-1 flex-col justify-center py-8">
          <header className="mb-6 flex flex-col gap-1">
            <h1 className="text-[26px] font-semibold text-text-primary">{current?.title}</h1>
            <p className="text-[15px] text-text-secondary">{current?.subtitle}</p>
          </header>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduce ? 0.15 : 0.25 }}
            >
              {current?.render()}
            </motion.div>
          </AnimatePresence>

          {completeOnboarding.isError ? (
            <p role="alert" className="mt-4 text-[14px] text-error">
              No se ha podido guardar tu perfil. Inténtalo de nuevo.
            </p>
          ) : null}
        </div>
      </FormProvider>

      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={goNext}
        disabled={completeOnboarding.isPending}
      >
        {isLast
          ? completeOnboarding.isPending
            ? 'Guardando…'
            : 'Empezar'
          : 'Continuar'}
      </Button>
    </div>
  )
}
