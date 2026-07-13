import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  completeOnboarding,
  updateHydrationSettings,
  updateProfile,
  updateProfileAccount,
  type HydrationSettingsInput,
  type OnboardingInput,
  type ProfileAccountInput,
  type ProfileUpdateInput,
} from '../api/profile-api'
import { profileKeys } from '../query-keys'

export function useCompleteOnboarding() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: OnboardingInput) => completeOnboarding(user?.id as string, input),
    onSuccess: (profile) => {
      // Actualiza la caché al momento para que los guards y la pantalla Hoy
      // reaccionen sin esperar un refetch.
      queryClient.setQueryData(profileKeys.detail(user?.id), profile)
    },
  })
}

export function useUpdateProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => updateProfile(user?.id as string, input),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(user?.id), profile)
    },
  })
}

export function useUpdateProfileAccount() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProfileAccountInput) => updateProfileAccount(user?.id as string, input),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(user?.id), profile)
    },
  })
}

export function useUpdateHydrationSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: HydrationSettingsInput) =>
      updateHydrationSettings(user?.id as string, input),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(user?.id), profile)
    },
  })
}
