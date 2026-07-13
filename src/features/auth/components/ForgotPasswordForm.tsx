import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { getAuthErrorMessage } from '../api/auth-errors'
import { useSendPasswordReset } from '../hooks/auth-mutations'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas/auth-schemas'

export function ForgotPasswordForm() {
  const sendReset = useSendPasswordReset()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit((values) => {
    sendReset.mutate(values.email)
  })

  if (sendReset.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-surface text-water-primary shadow-[var(--shadow-soft)]">
          <MailCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="text-[24px] font-semibold text-text-primary">Comprueba tu correo</h1>
        {/* Mensaje neutro: no revela si existe una cuenta con ese correo. */}
        <p className="text-[15px] text-text-secondary">
          Si existe una cuenta con{' '}
          <span className="text-text-primary">{getValues('email')}</span>, te hemos enviado un
          enlace para restablecer la contraseña.
        </p>
        <Link
          to={routes.login}
          className="mt-2 font-medium text-water-primary underline-offset-2 hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold text-text-primary">Recupera tu contraseña</h1>
        <p className="text-[15px] text-text-secondary">
          Te enviaremos un enlace para crear una nueva.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          id="email"
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          error={errors.email?.message}
          {...register('email')}
        />

        {sendReset.isError ? (
          <p role="alert" className="text-[14px] text-error">
            {getAuthErrorMessage(sendReset.error)}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={sendReset.isPending}>
          {sendReset.isPending ? 'Enviando…' : 'Enviar enlace'}
        </Button>
      </form>

      <Link
        to={routes.login}
        className="flex items-center justify-center gap-1.5 text-[14px] text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a iniciar sesión
      </Link>
    </div>
  )
}
