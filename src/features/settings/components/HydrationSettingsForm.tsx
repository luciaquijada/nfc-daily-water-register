import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AmountStep,
  GoalStep,
  TimezoneStep,
} from '@/features/onboarding/components/onboarding-steps'
import { useSettings } from '@/features/settings/SettingsProvider'
import { SettingsSection } from '@/features/settings/components/SettingsSection'
import { useUpdateHydrationSettings } from '@/features/profile/hooks/profile-mutations'
import {
  hydrationSettingsSchema,
  type HydrationSettingsValues,
} from '@/features/profile/schemas/profile-schemas'
import type { Profile } from '@/features/profile/types'

type HydrationSettingsFormProps = {
  profile: Profile
}

function profileToFormValues(profile: Profile): HydrationSettingsValues {
  return {
    dailyGoalMl: profile.daily_goal_ml,
    defaultAmountMl: profile.default_amount_ml,
    timezone: profile.timezone,
  }
}

export function HydrationSettingsForm({ profile }: HydrationSettingsFormProps) {
  const { translate } = useSettings()
  const updateSettings = useUpdateHydrationSettings()

  const form = useForm<HydrationSettingsValues>({
    resolver: zodResolver(hydrationSettingsSchema),
    defaultValues: profileToFormValues(profile),
    mode: 'onTouched',
  })

  useEffect(() => {
    form.reset(profileToFormValues(profile))
  }, [form, profile])

  function onSubmit(values: HydrationSettingsValues) {
    updateSettings.mutate(values, {
      onSuccess: () => {
        toast.success(translate('settings', 'saved'))
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
        <SettingsSection
          title={translate('settings', 'goal')}
          description={translate('settings', 'goalDescription')}
        >
          <GoalStep />
        </SettingsSection>

        <SettingsSection
          title={translate('settings', 'quickAmount')}
          description={translate('settings', 'quickAmountDescription')}
        >
          <AmountStep />
        </SettingsSection>

        <SettingsSection
          title={translate('settings', 'timezone')}
          description={translate('settings', 'timezoneDescription')}
        >
          <TimezoneStep />
        </SettingsSection>

        {updateSettings.isError ? (
          <p role="alert" className="text-center text-[14px] text-error">
            {translate('settings', 'saveError')}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isDirty || !isValid || updateSettings.isPending}
        >
          {updateSettings.isPending
            ? translate('settings', 'saving')
            : translate('settings', 'save')}
        </Button>
      </form>
    </FormProvider>
  )
}
