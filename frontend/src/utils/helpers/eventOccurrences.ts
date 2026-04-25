import { WEEK_DAYS } from '@/constants/days'
import type { ChurchEvent } from '@/types/event'

export function getNextOccurrences(event: ChurchEvent, months = 2): string[] {
  if (!event.recurring) return []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const end = new Date(today)
  end.setMonth(end.getMonth() + months)

  const dates: string[] = []

  if (event.recurrence_type === 'monthly') {
    const uniqueDays = [...new Set(event.recurrence_slots.map((s) => Number(s.day)))]
    const current = new Date(today.getFullYear(), today.getMonth(), 1)

    while (current <= end) {
      for (const day of uniqueDays) {
        const date = new Date(current.getFullYear(), current.getMonth(), day)
        if (date >= today && date <= end) {
          dates.push(date.toISOString().slice(0, 10))
        }
      }
      current.setMonth(current.getMonth() + 1)
    }

    return dates.sort()
  }

  const uniqueDayNames = [...new Set(event.recurrence_slots.map((s) => s.day))]
  const targetDayIndexes = uniqueDayNames
    .map((dayName) => WEEK_DAYS.indexOf(dayName as (typeof WEEK_DAYS)[number]))
    .filter((index) => index >= 0)

  const current = new Date(today)
  while (current <= end) {
    if (targetDayIndexes.includes(current.getDay())) {
      dates.push(current.toISOString().slice(0, 10))
    }
    current.setDate(current.getDate() + 1)
  }

  return dates.sort()
}
