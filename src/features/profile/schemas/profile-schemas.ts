import { z } from 'zod'

// Los rangos coinciden con los CHECK de la base de datos (profiles_*_check).
export const onboardingSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Escribe cómo quieres que te llamemos.')
    .max(40, 'Máximo 40 caracteres.'),
  dailyGoalMl: z
    .number({ error: 'Introduce un número válido.' })
    .int('Usa un número entero.')
    .min(250, 'El objetivo mínimo es 250 ml.')
    .max(10000, 'El objetivo máximo es 10.000 ml.'),
  defaultAmountMl: z
    .number({ error: 'Introduce un número válido.' })
    .int('Usa un número entero.')
    .min(1, 'La cantidad mínima es 1 ml.')
    .max(5000, 'La cantidad máxima es 5.000 ml.'),
  timezone: z.string().min(1, 'Selecciona tu zona horaria.'),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>
