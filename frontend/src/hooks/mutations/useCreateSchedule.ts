import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Schedule } from '@/types/schedule'

type CreateScheduleInput = Omit<Schedule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>

async function createSchedule(input: CreateScheduleInput): Promise<Schedule> {
  await new Promise((r) => setTimeout(r, 500))
  const newSchedule: Schedule = {
    ...input,
    id: `schedule-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }
  return newSchedule
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
