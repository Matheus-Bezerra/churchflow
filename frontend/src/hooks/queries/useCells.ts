import { useQuery, useQueryClient } from '@tanstack/react-query'
import { mockCellAttendances, mockCellMeetings, mockCells, mockUsers } from '@/lib/mocks'
import type { CellAttendance, CellMeeting } from '@/types/cellMeeting'
import type { Cell } from '@/types/church'
import type { User } from '@/types/user'

async function fetchCells(): Promise<Cell[]> {
  await new Promise((r) => setTimeout(r, 300))
  return mockCells.filter((c) => !c.deleted_at)
}

function calculateCellsStats(cells: Cell[], meetings: CellMeeting[], attendances: CellAttendance[]) {
  const totalMembers = cells.reduce((sum, cell) => sum + cell.member_count, 0)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const meetingsThisMonth = meetings.filter((meeting) => {
    const date = new Date(`${meeting.date}T00:00:00`)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
  const meetingsThisMonthIds = new Set(meetingsThisMonth.map((meeting) => meeting.id))
  const attendancesThisMonth = attendances.filter((attendance) =>
    meetingsThisMonthIds.has(attendance.meeting_id),
  )
  const totalPresences = attendancesThisMonth.filter(
    (attendance) => attendance.present,
  ).length
  const totalPossiblePresences = attendancesThisMonth.length
  const avgAttendancePct =
    totalPossiblePresences > 0
      ? Math.round((totalPresences / totalPossiblePresences) * 100)
      : 0
  const activeCellsThisMonth = new Set(
    meetingsThisMonth.map((meeting) => meeting.cell_id),
  ).size

  return {
    total_cells: cells.length,
    total_members_in_cells: totalMembers,
    avg_attendance_pct: avgAttendancePct,
    active_cells: activeCellsThisMonth,
  }
}

export function useCells() {
  return useQuery({
    queryKey: ['cells'],
    queryFn: fetchCells,
  })
}

export function useCellsStats() {
  return useQuery({
    queryKey: ['cells', 'stats'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 250))
      const cells = mockCells.filter((c) => !c.deleted_at)
      return calculateCellsStats(cells, mockCellMeetings, mockCellAttendances)
    },
  })
}

export function useCellById(cellId: string) {
  return useQuery({
    queryKey: ['cells', cellId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150))
      return mockCells.find((cell) => cell.id === cellId && !cell.deleted_at) ?? null
    },
  })
}

export function useCellMembers(cellId: string) {
  return useQuery({
    queryKey: ['cells', cellId, 'members'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150))
      return mockUsers.filter((user) => !user.deleted_at && user.cell_id === cellId)
    },
  })
}

export function useCellMeetings(cellId: string) {
  return useQuery({
    queryKey: ['cell-meetings'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120))
      return mockCellMeetings
    },
    select: (meetings) =>
      meetings
        .filter((meeting) => meeting.cell_id === cellId)
        .sort((a, b) => b.date.localeCompare(a.date)),
  })
}

export function useCellAttendances() {
  return useQuery({
    queryKey: ['cell-attendances'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120))
      return mockCellAttendances
    },
  })
}

export function useCellMeetingsWithStats(cellId?: string) {
  const { data: meetings = [] } = useQuery({
    queryKey: ['cell-meetings'],
    queryFn: async () => mockCellMeetings,
  })
  const { data: attendances = [] } = useCellAttendances()
  const cells = mockCells.filter((cell) => !cell.deleted_at)

  return meetings
    .filter((meeting) => (cellId ? meeting.cell_id === cellId : true))
    .map((meeting) => {
      const records = attendances.filter((attendance) => attendance.meeting_id === meeting.id)
      const presentCount = records.filter((record) => record.present).length
      const absentCount = records.length - presentCount
      const attendancePct = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0
      const cell = cells.find((item) => item.id === meeting.cell_id) ?? null
      return { meeting, presentCount, absentCount, attendancePct, cell }
    })
    .sort((a, b) => b.meeting.date.localeCompare(a.meeting.date))
}

interface RegisterCellMeetingPayload {
  cellId: string
  date: string
  members: User[]
  absentMemberIds: string[]
}

export function useRegisterCellMeeting() {
  const queryClient = useQueryClient()

  return ({ cellId, date, members, absentMemberIds }: RegisterCellMeetingPayload) => {
    const meetingId = `meeting-${crypto.randomUUID()}`
    const attendanceRecords: CellAttendance[] = members.map((member) => ({
      id: `attendance-${crypto.randomUUID()}`,
      meeting_id: meetingId,
      member_id: member.id,
      present: !absentMemberIds.includes(member.id),
    }))
    const newMeeting: CellMeeting = {
      id: meetingId,
      cell_id: cellId,
      date,
      created_at: new Date().toISOString(),
    }

    queryClient.setQueryData<CellMeeting[]>(['cell-meetings'], (previous = []) => [
      newMeeting,
      ...previous,
    ])
    queryClient.setQueryData<CellAttendance[]>(['cell-attendances'], (previous = []) => {
      const nextAttendances = [...attendanceRecords, ...previous]
      const nextMeetings = queryClient.getQueryData<CellMeeting[]>(['cell-meetings']) ?? []
      const cells = mockCells.filter((cell) => !cell.deleted_at)
      queryClient.setQueryData(
        ['cells', 'stats'],
        calculateCellsStats(cells, nextMeetings, nextAttendances),
      )
      return nextAttendances
    })
  }
}

export function useLeaderName(leaderId: string): string {
  const leader = mockUsers.find((u) => u.id === leaderId)
  return leader?.name ?? 'Sem líder'
}
