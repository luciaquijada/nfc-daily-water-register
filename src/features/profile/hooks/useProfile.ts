import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getProfile } from '../api/profile-api'
import { profileKeys } from '../query-keys'

export function useProfile() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getProfile(userId as string),
    enabled: Boolean(userId),
  })
}
