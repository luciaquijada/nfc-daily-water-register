import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { useSettings } from '@/features/settings/SettingsProvider'
import { SettingsSection } from '@/features/settings/components/SettingsSection'
import { getAuthErrorMessage } from '@/features/auth/api/auth-errors'
import { useUpdatePassword } from '@/features/auth/hooks/auth-mutations'
import { updatePasswordSchema, type UpdatePasswordValues } from '@/features/auth/schemas/auth-schemas'

export function ChangePasswordForm() {
  const { translate } = useSettings()
  const updatePw = useUpdatePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const onSubmit = handleSubmit((values) => {
    updatePw.mutate(values.password, {
      onSuccess: () => {
        toast.success(translate('profile', 'passwordSaved'))
        reset()
      },
    })
  })

  return (
    <SettingsSection
      title={translate('profile', 'password')}
      description={translate('profile', 'passwordDescription')}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="newPassword"
          label={translate('profile', 'newPassword')}
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          id="confirmNewPassword"
          label={translate('profile', 'confirmPassword')}
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {updatePw.isError ? (
          <p role="alert" className="text-[14px] text-error">
            {getAuthErrorMessage(updatePw.error)}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="surface"
          size="lg"
          className="w-full"
          disabled={!isDirty || !isValid || updatePw.isPending}
        >
          {updatePw.isPending
            ? translate('profile', 'savingPassword')
            : translate('profile', 'savePassword')}
        </Button>
      </form>
    </SettingsSection>
  )
}
