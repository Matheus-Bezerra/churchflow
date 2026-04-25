export type MemberStatus = 'active' | 'inactive' | 'visitor'
export type MemberRole = 'member' | 'leader' | 'pastor' | 'deacon' | 'elder'

export interface User {
  id: string
  church_id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  role: MemberRole
  status: MemberStatus
  baptized: boolean
  baptism_date?: string | null
  birth_date?: string
  address?: string
  city?: string
  state?: string
  cell_id?: string | null
  ministry_ids: string[]
  joined_at: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface UserUnavailability {
  id: string
  user_id: string
  start_date: string
  end_date: string
  reason?: string
  created_at: string
}

export interface DashboardStats {
  total_members: number
  active_members: number
  visitors: number
  baptized: number
  ministries_count: number
  events_this_month: number
  schedules_this_month: number
  birthdays_this_month: number
  new_members_this_month: number
}
