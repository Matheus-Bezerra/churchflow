export interface Church {
  id: string
  name: string
  cnpj?: string
  address?: string
  city?: string
  state?: string
  phone?: string
  email?: string
  logo_url?: string
  plan: 'free' | 'basic' | 'pro'
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface Cell {
  id: string
  church_id: string
  name: string
  leader_id: string
  meeting_day: string
  meeting_time: string
  address?: string
  member_count: number
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
