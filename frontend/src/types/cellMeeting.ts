export interface CellMeeting {
  id: string
  cell_id: string
  date: string
  created_at: string
}

export interface CellAttendance {
  id: string
  meeting_id: string
  member_id: string
  present: boolean
}
