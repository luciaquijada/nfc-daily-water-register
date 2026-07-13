import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { NameStep } from '@/features/onboarding/components/onboarding-steps'
import { useSettings } from '@/features/settings/SettingsProvider'
import { SettingsSection } from '@/features/settings/components/SettingsSection'
import { useUpdateProfileAccount } from '../hooks/profile-mutations'
import { profileAccountSchema, type ProfileAccountValues } from '../schemas/profile-schemas'
import type { Profile } from '../types'

type ProfileAccountFormProps = {
  profile: Profile
}

function profileToFormValues(profile: Profile): ProfileAccountValues {
  return {
    displayName: profile.display_name ?? '',
  }
}

export function ProfileAccountForm({ profile }: ProfileAccountFormProps) {
  const { translate } = useSettings()
  const updateAccount = useUpdateProfileAccount()

  const form = useForm<ProfileAccountValues>({
    resolver: zodResolver(profileAccountSchema),
    defaultValues: profileToFormValues(profile),
    mode: 'onTouched',
  })

  useEffect(() => {
    form.reset(profileToFormValues(profile))
  }, [form, profile])

  function onSubmit(values: ProfileAccountValues) {
    updateAccount.mutate(values, {
      onSuccess: () => {
        toast.success(translate('profile', 'saved'))
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
          title={translate('profile', 'name')}
          description={translate('profile', 'nameDescription')}
        >
          <NameStep />
        </SettingsSection>

        {updateAccount.isError ? (
          <p role="alert" className="text-center text-[14px] text-error">
            {translate('profile', 'saveError')}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isDirty || !isValid || updateAccount.isPending}
        >
          {updateAccount.isPending
            ? translate('profile', 'saving')
            : translate('profile', 'save')}
        </Button>
      </form>
    </FormProvider>
  )
}
