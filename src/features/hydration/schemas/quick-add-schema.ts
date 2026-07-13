import { z } from 'zod'

// Parámetros de la URL de registro rápido (NFC / atajos). Nunca confiamos en la
// URL directamente: se validan y se acotan antes de usarlos.
export const quickAddParamsSchema = z.object({
  amount: z.coerce.number().int().min(1).max(5000),
  source: z.enum(['manual', 'quick_add', 'nfc', 'shortcut', 'import']).catch('nfc'),
})

export type QuickAddParams = z.infer<typeof quickAddParamsSchema>
