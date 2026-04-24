import { useQuery } from '@tanstack/react-query'
import { mockUsers } from '@/lib/mocks'
import type { User, MemberStatus } from '@/types/user'

interface MemberFilters {
  search?: string
  status?: MemberStatus | 'all'
  ministry_id?: string | 'all'
}

async function fetchMembers(filters: MemberFilters = {}): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 350))

  let users = mockUsers.filter((u) => !u.deleted_at)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone?.includes(q),
    )
  }

  if (filters.status && filters.status !== 'all') {
    users = users.filter((u) => u.status === filters.status)
  }

  if (filters.ministry_id && filters.ministry_id !== 'all') {
    users = users.filter((u) => u.ministry_ids.includes(filters.ministry_id!))
  }

  return users
}

export function useMembers(filters: MemberFilters = {}) {
  return useQuery({
    queryKey: ['members', filters],
    queryFn: () => fetchMembers(filters),
  })
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200))
      return mockUsers.find((u) => u.id === id && !u.deleted_at) ?? null
    },
    enabled: Boolean(id),
  })
}
