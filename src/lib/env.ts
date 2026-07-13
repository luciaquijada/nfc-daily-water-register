import { z } from 'zod'

// Solo variables públicas (prefijo VITE_). Nunca secretos aquí.
const envSchema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  VITE_APP_URL: z.url().optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  // Falla temprano y claro si faltan variables, en lugar de errores opacos
  // más adelante al usar el cliente de Supabase.
  console.error(
    'Variables de entorno inválidas:',
    z.flattenError(parsed.error).fieldErrors,
  )
  throw new Error(
    'Configuración de entorno inválida. Revisa tu archivo .env (ver .env.example).',
  )
}

export const env = parsed.data
