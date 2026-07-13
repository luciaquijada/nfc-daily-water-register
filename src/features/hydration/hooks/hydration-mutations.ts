import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isBrowserOnline, isNetworkError } from '@/lib/offline/network'
import { createEntry, deleteEntry, updateEntryAmount } from '../api/hydration-api'
import { enqueuePendingEntry } from '../offline/pending-entries-db'
import { pendingToHydrationEntry } from '../offline/pending-to-entry'
import { hydrationKeys } from '../query-keys'
import type { HydrationEntry, HydrationSource } from '../types'
import { useTodayKey } from './use-today-key'

type AddVars = {
  amountMl: number
  source: HydrationSource
  clientRequestId: string
  consumedAt?: string
}

type OptimisticContext = { previous: HydrationEntry[] }

async function persistEntry(
  userId: string,
  vars: AddVars,
): Promise<HydrationEntry> {
  const consumedAt = vars.consumedAt ?? new Date().toISOString()
  const input = {
    userId,
    amountMl: vars.amountMl,
    source: vars.source,
    clientRequestId: vars.clientRequestId,
    consumedAt,
  }

  if (!isBrowserOnline()) {
    await enqueuePendingEntry({
      userId,
      amountMl: vars.amountMl,
      source: vars.source,
      clientRequestId: vars.clientRequestId,
      consumedAt,
      queuedAt: new Date().toISOString(),
    })
    return pendingToHydrationEntry({
      userId,
      amountMl: vars.amountMl,
      source: vars.source,
      clientRequestId: vars.clientRequestId,
      consumedAt,
      queuedAt: new Date().toISOString(),
    })
  }

  try {
    return await createEntry(input)
  } catch (error) {
    if (isNetworkError(error)) {
      await enqueuePendingEntry({
        userId,
        amountMl: vars.amountMl,
        source: vars.source,
        clientRequestId: vars.clientRequestId,
        consumedAt,
        queuedAt: new Date().toISOString(),
      })
      return pendingToHydrationEntry({
        userId,
        amountMl: vars.amountMl,
        source: vars.source,
        clientRequestId: vars.clientRequestId,
        consumedAt,
        queuedAt: new Date().toISOString(),
      })
    }
    throw error
  }
}

export function useAddEntry() {
  const queryClient = useQueryClient()
  const { userId, dayKey } = useTodayKey()
  const key = hydrationKeys.day(userId, dayKey)

  return useMutation({
    mutationFn: (vars: AddVars) => persistEntry(userId as string, vars),
    onMutate: async (vars): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<HydrationEntry[]>(key) ?? []
      const nowIso = vars.consumedAt ?? new Date().toISOString()
      const optimistic: HydrationEntry = {
        id: `optimistic-${vars.clientRequestId}`,
        user_id: userId as string,
        amount_ml: vars.amountMl,
        consumed_at: nowIso,
        source: vars.source,
        note: null,
        client_request_id: vars.clientRequestId,
        created_at: nowIso,
        updated_at: nowIso,
      }
      queryClient.setQueryData<HydrationEntry[]>(key, [optimistic, ...previous])
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context) {
        queryClient.setQueryData(key, context.previous)
      }
      toast.error('No hemos podido guardar el registro. Inténtalo de nuevo.')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
    },
  })
}

export function useUpdateEntry() {
  const queryClient = useQueryClient()
  const { userId, dayKey } = useTodayKey()
  const key = hydrationKeys.day(userId, dayKey)

  return useMutation({
    mutationFn: ({ id, amountMl }: { id: string; amountMl: number }) =>
      updateEntryAmount(id, amountMl),
    onMutate: async ({ id, amountMl }): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<HydrationEntry[]>(key) ?? []
      queryClient.setQueryData<HydrationEntry[]>(
        key,
        previous.map((entry) => (entry.id === id ? { ...entry, amount_ml: amountMl } : entry)),
      )
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context) {
        queryClient.setQueryData(key, context.previous)
      }
      toast.error('No hemos podido editar el registro.')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
    },
  })
}

export function useDeleteEntry() {
  const queryClient = useQueryClient()
  const { userId, dayKey } = useTodayKey()
  const key = hydrationKeys.day(userId, dayKey)

  return useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onMutate: async (id): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<HydrationEntry[]>(key) ?? []
      queryClient.setQueryData<HydrationEntry[]>(
        key,
        previous.filter((entry) => entry.id !== id),
      )
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context) {
        queryClient.setQueryData(key, context.previous)
      }
      toast.error('No hemos podido eliminar el registro.')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
