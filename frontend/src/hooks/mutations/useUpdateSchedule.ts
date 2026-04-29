import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mockSchedules } from '@/lib/mocks'
import type { Schedule } from '@/types/schedule'

type UpdateScheduleInput = Partial<Omit<Schedule, 'id' | 'church_id' | 'created_at'>> & {
  id: string
}

async function updateSchedule(input: UpdateScheduleInput): Promise<void> {
  await new Promise((r) => setTimeout(r, 400))
  const index = mockSchedules.findIndex((s) => s.id === input.id)
  if (index !== -1) {
    Object.assign(mockSchedules[index], {
      ...input,
      updated_at: new Date().toISOString(),
    })
  }
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
  })
}
