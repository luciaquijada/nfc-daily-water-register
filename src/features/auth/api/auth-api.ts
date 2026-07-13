import { supabase } from '@/lib/supabase/client'

// Capa de acceso a Supabase Auth. Cada función lanza el error del SDK, que las
// mutaciones traducen con getAuthErrorMessage. Nunca gestionamos tokens a mano.

export async function signUpWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    throw error
  }
  return data
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw error
  }
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export async function sendPasswordReset(email: string, redirectTo: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) {
    throw error
  }
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    throw error
  }
}
