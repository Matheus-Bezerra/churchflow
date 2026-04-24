import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Ministry } from '@/types/ministry'

type CreateMinistryInput = Omit<Ministry, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>

async function createMinistry(input: CreateMinistryInput): Promise<Ministry> {
  await new Promise((r) => setTimeout(r, 500))
  const newMinistry: Ministry = {
    ...input,
    id: `ministry-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }
  return newMinistry
}

export function useCreateMinistry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
