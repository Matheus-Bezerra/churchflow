import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Cell } from '@/types/church'

type CreateCellInput = Omit<Cell, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>

async function createCell(input: CreateCellInput): Promise<Cell> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    ...input,
    id: `cell-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }
}

export function useCreateCell() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCell,
    onSuccess: (newCell) => {
      queryClient.setQueryData<Cell[]>(['cells'], (previous = []) => [
        newCell,
        ...previous,
      ])
      queryClient.invalidateQueries({ queryKey: ['cells', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
