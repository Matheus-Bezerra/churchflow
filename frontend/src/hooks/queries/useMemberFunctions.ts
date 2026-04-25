import { useQuery } from '@tanstack/react-query'

import { mockMemberFunctions } from '@/lib/mocks'
import type { MemberFunction } from '@/types/user'

async function fetchMemberFunctions(): Promise<MemberFunction[]> {
  await new Promise((r) => setTimeout(r, 150))
  return mockMemberFunctions.filter((f) => !f.deleted_at)
}

export function useMemberFunctions() {
  return useQuery({
    queryKey: ['members', 'functions'],
    queryFn: fetchMemberFunctions,
  })
}

