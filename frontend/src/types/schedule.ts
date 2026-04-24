export type ScheduleStatus = 'pending' | 'confirmed' | 'declined'

export interface Schedule {
  id: string
  church_id: string
  ministry_id: string
  volunteer_id: string
  title: string
  date: string
  start_time: string
  end_time?: string
  status: ScheduleStatus
  decline_reason?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface ScheduleWithMeta extends Schedule {
  volunteer_name: string
  volunteer_avatar?: string
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
  created_at: string
}
