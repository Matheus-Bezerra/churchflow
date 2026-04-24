import { useQuery } from '@tanstack/react-query'
import { mockMinistries, mockMinistryActivities, mockUsers } from '@/lib/mocks'
import type { Ministry, MinistryActivity, MinistryStatus } from '@/types/ministry'

interface MinistryFilters {
  search?: string
  status?: MinistryStatus | 'all'
}

async function fetchMinistries(filters: MinistryFilters = {}): Promise<Ministry[]> {
  await new Promise((r) => setTimeout(r, 300))

  let ministries = mockMinistries.filter((m) => !m.deleted_at)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    ministries = ministries.filter((m) => {
      const leader = mockUsers.find((u) => u.id === m.leader_id)
      return (
        m.name.toLowerCase().includes(q) ||
        leader?.name.toLowerCase().includes(q)
      )
    })
  }

  if (filters.status && filters.status !== 'all') {
    ministries = ministries.filter((m) => m.status === filters.status)
  }

  return ministries
}

async function fetchMinistryActivities(ministryId: string): Promise<MinistryActivity[]> {
  await new Promise((r) => setTimeout(r, 200))
  return mockMinistryActivities.filter((a) => a.ministry_id === ministryId)
}

export function useMinistries(filters: MinistryFilters = {}) {
  return useQuery({
    queryKey: ['ministries', filters],
    queryFn: () => fetchMinistries(filters),
  })
}

export function useMinistryActivities(ministryId: string) {
  return useQuery({
    queryKey: ['ministries', ministryId, 'activities'],
    queryFn: () => fetchMinistryActivities(ministryId),
    enabled: Boolean(ministryId),
  })
}
