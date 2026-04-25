import { useQuery } from '@tanstack/react-query'
import {
  checkConflict,
  mockEvents,
  mockMinistries,
  mockSchedules,
  mockUnavailabilities,
} from '@/lib/mocks'
import type { ScheduleWithMeta } from '@/types/schedule'

async function fetchSchedules(): Promise<ScheduleWithMeta[]> {
  await new Promise((r) => setTimeout(r, 350))

  const active = mockSchedules.filter((s) => !s.deleted_at)

  return active
    .map((schedule) => {
      const event = mockEvents.find((e) => e.id === schedule.event_id)
      const ministry = mockMinistries.find((m) => m.id === schedule.ministry_id)
      const hasConflict = checkConflict(schedule, mockUnavailabilities)

      const occurrenceDay = new Date(schedule.event_occurrence_date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })
      const matchingSlot = event?.recurrence_slots?.find(
        (slot) => slot.day.toLowerCase() === occurrenceDay.toLowerCase(),
      )
      const eventTime = matchingSlot?.time ?? event?.time

      return {
        ...schedule,
        event_name: event?.name ?? 'Evento desconhecido',
        event_color: event?.color ?? '#6B7280',
        event_icon: event?.icon ?? 'Calendar',
        event_time: eventTime,
        ministry_name: ministry?.name ?? 'Desconhecido',
        ministry_color: ministry?.color ?? '#6B7280',
        hasConflict,
      }
    })
    .sort(
      (a, b) =>
        new Date(a.event_occurrence_date).getTime() -
        new Date(b.event_occurrence_date).getTime(),
    )
}

export function useSchedules() {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: fetchSchedules,
  })
}
