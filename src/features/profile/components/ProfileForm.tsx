import { useEffect, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AmountStep,
  GoalStep,
  NameStep,
  TimezoneStep,
} from '@/features/onboarding/components/onboarding-steps'
import { useUpdateProfile } from '../hooks/profile-mutations'
import {
  profileUpdateSchema,
  type ProfileUpdateValues,
} from '../schemas/profile-schemas'
import type { Profile } from '../types'

type ProfileFormProps = {
  profile: Profile
}

function profileToFormValues(profile: Profile): ProfileUpdateValues {
  return {
    displayName: profile.display_name ?? '',
    dailyGoalMl: profile.daily_goal_ml,
    defaultAmountMl: profile.default_amount_ml,
    timezone: profile.timezone,
  }
}

function ProfileSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-soft)]">
      <header className="flex flex-col gap-0.5">
        <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
        {description ? (
          <p className="text-[14px] text-text-secondary">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: profileToFormValues(profile),
    mode: 'onTouched',
  })

  useEffect(() => {
    form.reset(profileToFormValues(profile))
  }, [form, profile])

  function onSubmit(values: ProfileUpdateValues) {
    updateProfile.mutate(values, {
      onSuccess: () => {
        toast.success('Perfil actualizado')
        form.reset(values)
      },
    })
  }

  const { isDirty, isValid } = form.formState

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <ProfileSection title="Nombre" description="Cómo te saludaremos en la app.">
          <NameStep />
        </ProfileSection>

        <ProfileSection
          title="Objetivo diario"
          description="Cuánta agua quieres beber cada día."
        >
          <GoalStep />
        </ProfileSection>

        <ProfileSection
          title="Cantidad rápida"
          description="La cantidad del botón principal en la pantalla Hoy."
        >
          <AmountStep />
        </ProfileSection>

        <ProfileSection
          title="Zona horaria"
          description="Para agrupar tus registros por día correctamente."
        >
          <TimezoneStep />
        </ProfileSection>

        {updateProfile.isError ? (
          <p role="alert" className="text-center text-[14px] text-error">
            No se han podido guardar los cambios. Inténtalo de nuevo.
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isDirty || !isValid || updateProfile.isPending}
        >
          {updateProfile.isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </form>
    </FormProvider>
  )
}
