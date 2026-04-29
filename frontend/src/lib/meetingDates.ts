import { addMonths, eachDayOfInterval, format, subDays } from 'date-fns'

const WEEK_DAY_TO_INDEX: Record<string, number> = {
  Domingo: 0,
  Segunda: 1,
  'Terça': 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
}

/**
 * Generate meeting dates for a specific week day in a configurable time window.
 */
export function generateMeetingDates(
  meetingDay: string,
  pastDays: number,
  aheadMonths: number,
): Date[] {
  const weekDayIndex = WEEK_DAY_TO_INDEX[meetingDay]
  if (typeof weekDayIndex !== 'number') {
    return []
  }

  const today = new Date()
  const intervalStart = subDays(today, pastDays)
  const intervalEnd = addMonths(today, Math.min(aheadMonths, 3))

  return eachDayOfInterval({ start: intervalStart, end: intervalEnd }).filter(
    (date) => date.getDay() === weekDayIndex,
  )
}

/**
 * Convert a Date to local YYYY-MM-DD format used by meeting records.
 */
export function toMeetingDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
