import { useMutation, useQueryClient } from '@tanstack/react-query'
import { routes } from '@/app/routes'
import {
  sendPasswordReset,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updatePassword,
} from '../api/auth-api'

type Credentials = { email: string; password: string }

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: Credentials) => signInWithPassword(email, password),
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: ({ email, password }: Credentials) => signUpWithPassword(email, password),
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Al cerrar sesión, descartamos toda la caché de datos del usuario.
      queryClient.clear()
    },
  })
}

export function useSendPasswordReset() {
  return useMutation({
    mutationFn: (email: string) =>
      sendPasswordReset(email, `${window.location.origin}${routes.updatePassword}`),
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) => updatePassword(password),
  })
}
