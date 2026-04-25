import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ChurchEvent } from '@/types/event'

type CreateEventInput = Omit<ChurchEvent, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>

async function createEvent(input: CreateEventInput): Promise<ChurchEvent> {
  await new Promise((r) => setTimeout(r, 500))
  const newEvent: ChurchEvent = {
    ...input,
    id: `event-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }
  return newEvent
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
