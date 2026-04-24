import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deleteMinistry(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400))
  // In a real implementation, this would PATCH deleted_at = now()
  console.log(`Soft-deleting ministry ${id}`)
}

export function useDeleteMinistry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
