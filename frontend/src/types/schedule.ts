export type ScheduleStatus = 'pending' | 'confirmed' | 'declined'

export interface ScheduleVolunteer {
  user_id: string
  role: string
}

export interface Schedule {
  id: string
  church_id: string
  event_id: string
  event_occurrence_date: string
  ministry_id: string
  name: string
  volunteers: ScheduleVolunteer[]
  status: ScheduleStatus
  decline_reason?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface ScheduleWithMeta extends Schedule {
  event_name: string
  event_color: string
  event_icon: string
  event_time?: string
  ministry_name: string
  ministry_color: string
  hasConflict: boolean
}

export interface RecentActivity {
  id: string
  type: 'member_added' | 'schedule_confirmed' | 'schedule_declined' | 'ministry_created' | 'member_baptized'
  description: string
  user_name: string
  avatar_url?: string
  avatar_color?: string
  created_at: string
}
