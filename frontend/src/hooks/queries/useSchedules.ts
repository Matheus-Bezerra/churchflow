import { useQuery } from '@tanstack/react-query'
import {
  checkConflict,
  mockEvents,
  mockMinistries,
  mockSchedules,
  mockUnavailabilities,
} from '@/lib/mocks'
import type { ScheduleVolunteer, ScheduleWithMeta } from '@/types/schedule'

function getScheduleStatus(volunteers: ScheduleVolunteer[]) {
  const hasDeclined = volunteers.some(
    (volunteer) => volunteer.confirmation_status === 'declined',
  )
  if (hasDeclined) return 'declined' as const

  const allConfirmed =
    volunteers.length > 0 &&
    volunteers.every((volunteer) => volunteer.confirmation_status === 'confirmed')
  if (allConfirmed) return 'confirmed' as const

  return 'pending' as const
}

async function fetchSchedules(): Promise<ScheduleWithMeta[]> {
  await new Promise((r) => setTimeout(r, 350))

  const active = mockSchedules.filter((s) => !s.deleted_at)

  return active
    .map((schedule) => {
      const event = mockEvents.find((e) => e.id === schedule.event_id)
      const ministry = mockMinistries.find((m) => m.id === schedule.ministry_id)
      const occurrenceDay = new Date(
        schedule.event_occurrence_date + 'T00:00:00',
      ).toLocaleDateString('pt-BR', { weekday: 'long' })
      const matchingSlot = event?.recurrence_slots?.find(
        (slot) => slot.day.toLowerCase() === occurrenceDay.toLowerCase(),
      )
      const eventTime = matchingSlot?.time ?? event?.time

      const hasConflict = checkConflict(schedule, mockUnavailabilities, eventTime)

      return {
        ...schedule,
        status: getScheduleStatus(schedule.volunteers),
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
