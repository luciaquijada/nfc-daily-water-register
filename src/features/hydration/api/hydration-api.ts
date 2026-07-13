import { supabase } from '@/lib/supabase/client'
import type { HydrationEntry, HydrationSource } from '../types'

export async function getEntriesForDay(
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
    .order('consumed_at', { ascending: false })

  if (error) {
    throw error
  }
  return data
}

export type CreateEntryInput = {
  userId: string
  amountMl: number
  source: HydrationSource
  clientRequestId: string
  consumedAt?: string
}

export async function createEntry(input: CreateEntryInput): Promise<HydrationEntry> {
  const { data, error } = await supabase
    .from('hydration_entries')
    .insert({
      user_id: input.userId,
      amount_ml: input.amountMl,
      source: input.source,
      client_request_id: input.clientRequestId,
      ...(input.consumedAt ? { consumed_at: input.consumedAt } : {}),
    })
    .select()
    .single()

  if (error) {
    // 23505 = unique_violation: el registro con este client_request_id ya existe
    // (reintento idempotente). Recuperamos el real en vez de duplicar.
    if (error.code === '23505') {
      const existing = await supabase
        .from('hydration_entries')
        .select('*')
        .eq('user_id', input.userId)
        .eq('client_request_id', input.clientRequestId)
        .single()
      if (existing.error) {
        throw existing.error
      }
      return existing.data
    }
    throw error
  }
  return data
}

export async function updateEntryAmount(
  id: string,
  amountMl: number,
): Promise<HydrationEntry> {
  const { data, error } = await supabase
    .from('hydration_entries')
    .update({ amount_ml: amountMl })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from('hydration_entries').delete().eq('id', id)
  if (error) {
    throw error
  }
}
