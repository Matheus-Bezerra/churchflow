import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/types/user'

interface UpdateMemberInput {
  id: string
  data: Partial<Omit<User, 'id' | 'created_at' | 'deleted_at'>>
}

async function updateMember({ id, data }: UpdateMemberInput): Promise<User> {
  await new Promise((r) => setTimeout(r, 400))
  const updated = { id, ...data, updated_at: new Date().toISOString() } as User
  return updated
}

export function useUpdateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['members', variables.id] })
    },
  })
}
