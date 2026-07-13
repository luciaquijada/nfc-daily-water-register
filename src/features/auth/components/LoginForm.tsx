import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { getAuthErrorMessage } from '../api/auth-errors'
import { useSignIn } from '../hooks/auth-mutations'
import { loginSchema, type LoginValues } from '../schemas/auth-schemas'

export function LoginForm() {
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => {
    signIn.mutate(values)
  })

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold text-text-primary">Inicia sesión</h1>
        <p className="text-[15px] text-text-secondary">Bienvenida de vuelta a Glup glup.</p>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {signIn.isError ? (
          <p role="alert" className="text-[14px] text-error">
            {getAuthErrorMessage(signIn.error)}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={signIn.isPending}>
          {signIn.isPending ? 'Entrando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="flex flex-col gap-3 text-center text-[14px]">
        <Link
          to={routes.forgotPassword}
          className="text-water-primary underline-offset-2 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-text-secondary">
          ¿No tienes cuenta?{' '}
          <Link
            to={routes.signUp}
            className="font-medium text-water-primary underline-offset-2 hover:underline"
          >
            Crea una
          </Link>
        </p>
      </div>
    </div>
  )
}
