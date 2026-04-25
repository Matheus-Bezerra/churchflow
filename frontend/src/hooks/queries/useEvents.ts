import { useQuery } from '@tanstack/react-query'

import { mockEvents } from '@/lib/mocks'
import type { ChurchEvent } from '@/types/event'

interface EventFilters {
  search?: string
  type_id?: string
}

async function fetchEvents(filters: EventFilters = {}): Promise<ChurchEvent[]> {
  await new Promise((r) => setTimeout(r, 300))

  let events = mockEvents.filter((e) => !e.deleted_at)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    events = events.filter((e) => e.name.toLowerCase().includes(q))
  }

  if (filters.type_id && filters.type_id !== 'all') {
    events = events.filter((e) => e.type_id === filters.type_id)
  }

  return events
}

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
  })
}
