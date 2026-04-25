import type { WeekDay } from '@/constants/days'
import type { EventIconName } from '@/lib/iconMap'

export interface EventType {
  id: string
  church_id: string
  label: string
  is_default: boolean
  created_at: string
}

export type RecurrenceDay = WeekDay

export type RecurrenceType = 'weekly' | 'monthly'

export interface RecurrenceSlot {
  day: string
  time: string
}

export interface ChurchEvent {
  id: string
  church_id: string
  name: string
  description?: string
  type_id: string
  icon: EventIconName
  color: string
  recurring: boolean
  recurrence_type?: RecurrenceType
  date?: string
  time?: string
  recurrence_slots: RecurrenceSlot[]
  ministry_ids: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
