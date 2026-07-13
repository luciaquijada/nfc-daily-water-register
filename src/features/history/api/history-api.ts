import { supabase } from '@/lib/supabase/client'
import type { HydrationEntry } from '@/features/hydration/types'

export async function getEntriesInRange(
  userId: string,
  startUtc: string,
  endUtc: string,
): Promise<HydrationEntry[]> {
  const { data, error } = await supabase
    .from('hydration_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('consumed_at', startUtc)
    .lte('consumed_at', endUtc)
    .order('consumed_at', { ascending: true })

  if (error) {
    throw error
  }
  return data
}
