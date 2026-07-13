import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { getAuthErrorMessage } from '../api/auth-errors'
import { useSignUp } from '../hooks/auth-mutations'
import { signUpSchema, type SignUpValues } from '../schemas/auth-schemas'

function ConfirmEmailNotice({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-surface text-water-primary shadow-[var(--shadow-soft)]">
        <MailCheck className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="text-[24px] font-semibold text-text-primary">Revisa tu correo</h1>
      <p className="text-[15px] text-text-secondary">
        Te hemos enviado un enlace a <span className="text-text-primary">{email}</span> para
        confirmar tu cuenta. Ábrelo para empezar a usar Gota.
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

export function SignUpForm() {
  const signUp = useSignUp()
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => {
    signUp.mutate(values, {
      onSuccess: (data) => {
        // Sin sesión => Supabase requiere confirmación por correo.
        // Con sesión => los guards redirigen a la app automáticamente.
        if (!data.session) {
          setConfirmEmail(values.email)
        }
      },
    })
  })

  if (confirmEmail) {
    return <ConfirmEmailNotice email={confirmEmail} />
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold text-text-primary">Crea tu cuenta</h1>
        <p className="text-[15px] text-text-secondary">Empieza a registrar tu hidratación.</p>
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
        <TextField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {signUp.isError ? (
          <p role="alert" className="text-[14px] text-error">
            {getAuthErrorMessage(signUp.error)}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={signUp.isPending}>
          {signUp.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="text-center text-[14px] text-text-secondary">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={routes.login}
          className="font-medium text-water-primary underline-offset-2 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
