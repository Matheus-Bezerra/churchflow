export type MinistryStatus = 'active' | 'inactive'

export interface Ministry {
  id: string
  church_id: string
  name: string
  description?: string
  icon: string
  color: string
  leader_id: string
  leader_ids?: string[]
  volunteer_ids?: string[]
  meeting_day: string
  meeting_time: string
  status: MinistryStatus
  member_count: number
  max_members?: number
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface MinistryActivity {
  id: string
  ministry_id: string
  description: string
  user_name: string
  created_at: string
}

export interface MinistryMember {
  ministry_id: string
  user_id: string
  joined_at: string
}
