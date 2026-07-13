import { z } from 'zod'

const email = z.email('Introduce un correo electrónico válido.')
const strongPassword = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Introduce tu contraseña.'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const signUpSchema = z.object({
  email,
  password: strongPassword,
})
export type SignUpValues = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({ email })
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const updatePasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>
