import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { Database } from './database.types'

// Cliente único de Supabase, tipado con el esquema de la base de datos.
// Usa la publishable key (segura para el navegador). La sesión se persiste y
// se refresca automáticamente; el SDK gestiona los tokens (nunca a mano).
export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
