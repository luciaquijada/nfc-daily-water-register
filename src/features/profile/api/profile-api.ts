import { supabase } from '@/lib/supabase/client'
import type { Profile } from '../types'

export type OnboardingInput = {
  displayName: string
  dailyGoalMl: number
  defaultAmountMl: number
  timezone: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }
  return data
}

// upsert: robusto aunque (por algún motivo) todavía no exista la fila de perfil.
export async function completeOnboarding(
  userId: string,
  input: OnboardingInput,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      display_name: input.displayName,
      daily_goal_ml: input.dailyGoalMl,
      default_amount_ml: input.defaultAmountMl,
      timezone: input.timezone,
      measurement_unit: 'ml',
      onboarding_completed: true,
    })
    .select()
    .single()

  if (error) {
    throw error
  }
  return data
}

export type ProfileUpdateInput = OnboardingInput

export async function updateProfile(
  userId: string,
  input: ProfileUpdateInput,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: input.displayName,
      daily_goal_ml: input.dailyGoalMl,
      default_amount_ml: input.defaultAmountMl,
      timezone: input.timezone,
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }
  return data
}
