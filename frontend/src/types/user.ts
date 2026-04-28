export type MemberStatus = 'active' | 'inactive' | 'visitor'
export type MemberRoleId = 'member' | 'leader' | 'pastor' | 'deacon' | 'elder'
export type MemberRole = MemberRoleId | (string & {})

export interface MemberFunction {
  id: string
  label: string
  is_default: boolean
  created_at: string
  deleted_at?: string | null
}

export interface User {
  id: string
  church_id: string
  name: string
  email: string
  phone?: string
  phone_is_whatsapp?: boolean
  avatar_url?: string
  avatar_color?: string
  role: MemberRole
  status: MemberStatus
  baptized: boolean
  baptism_date?: string | null
  birth_date?: string
  is_volunteer?: boolean
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
  type: 'period' | 'recurring'
  // period
  start_date?: string
  end_date?: string
  // recurring
  day_of_week?: string
  start_time?: string
  end_time?: string
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
