export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string | undefined) => ['profile', userId] as const,
}
