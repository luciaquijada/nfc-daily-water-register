import type { Database } from '@/lib/supabase/database.types'

export type HydrationEntry = Database['public']['Tables']['hydration_entries']['Row']

export type HydrationSource = 'manual' | 'quick_add' | 'nfc' | 'shortcut' | 'import'
