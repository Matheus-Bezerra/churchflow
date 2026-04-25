import { useMutation, useQueryClient } from '@tanstack/react-query'

import { mockUsers } from '@/lib/mocks'
import type { User } from '@/types/user'

type CreateMemberInput = Omit<
  User,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>

async function createMember(input: CreateMemberInput): Promise<User> {
  await new Promise((r) => setTimeout(r, 500))
  const newMember: User = {
    ...input,
    id: `user-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }
  mockUsers.push(newMember)
  return newMember
}

export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
