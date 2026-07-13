import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { completeOnboarding, type OnboardingInput } from '../api/profile-api'
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
