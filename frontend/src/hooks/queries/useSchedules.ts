import { useQuery } from '@tanstack/react-query'
import {
  mockSchedules,
  mockUnavailabilities,
  mockUsers,
  mockMinistries,
  checkConflict,
} from '@/lib/mocks'
import type { ScheduleWithMeta } from '@/types/schedule'

async function fetchSchedules(): Promise<ScheduleWithMeta[]> {
  await new Promise((r) => setTimeout(r, 350))

  const active = mockSchedules.filter((s) => !s.deleted_at)

  return active.map((schedule) => {
    const volunteer = mockUsers.find((u) => u.id === schedule.volunteer_id)
    const ministry = mockMinistries.find((m) => m.id === schedule.ministry_id)
    const hasConflict = checkConflict(schedule, mockUnavailabilities)

    return {
      ...schedule,
      volunteer_name: volunteer?.name ?? 'Desconhecido',
      volunteer_avatar: volunteer?.avatar_url,
      ministry_name: ministry?.name ?? 'Desconhecido',
      ministry_color: ministry?.color ?? '#6B7280',
      hasConflict,
    }
  })
}

export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: fetchSchedules,
  })
}
