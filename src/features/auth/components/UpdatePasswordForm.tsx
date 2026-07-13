import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { getAuthErrorMessage } from '../api/auth-errors'
import { useAuth } from '../hooks/useAuth'
import { useUpdatePassword } from '../hooks/auth-mutations'
import { updatePasswordSchema, type UpdatePasswordValues } from '../schemas/auth-schemas'

export function UpdatePasswordForm() {
  const { status } = useAuth()
  const navigate = useNavigate()
  const updatePw = useUpdatePassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit((values) => {
    updatePw.mutate(values.password, {
      onSuccess: () => navigate(routes.today, { replace: true }),
    })
  })

  // Se llega aquí con la sesión temporal del enlace de recuperación. Sin sesión,
  // el enlace es inválido o ha caducado.
  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-[24px] font-semibold text-text-primary">Enlace no válido</h1>
        <p className="text-[15px] text-text-secondary">
          El enlace para restablecer la contraseña no es válido o ha caducado.
        </p>
        <Link
          to={routes.forgotPassword}
          className="font-medium text-water-primary underline-offset-2 hover:underline"
        >
          Solicitar uno nuevo
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold text-text-primary">Nueva contraseña</h1>
        <p className="text-[15px] text-text-secondary">Elige una contraseña para tu cuenta.</p>
      </header>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="password"
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          id="confirmPassword"
          label="Repite la contraseña"
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

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={updatePw.isPending}>
          {updatePw.isPending ? 'Guardando…' : 'Guardar contraseña'}
        </Button>
      </form>
    </div>
  )
}
