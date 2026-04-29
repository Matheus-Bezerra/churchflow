'use client'

import { Calendar } from 'lucide-react'
import Link from 'next/link'

import type { CellMeeting } from '@/types/cellMeeting'
import type { Cell } from '@/types/church'

interface MeetingWithStats {
  meeting: CellMeeting
  presentCount: number
  absentCount: number
  attendancePct: number
  cell: Cell | null
}

interface MeetingsListProps {
  items: MeetingWithStats[]
  emptyMessage: string
  showCellName?: boolean
  showViewLink?: boolean
  onRegisterAttendance?: (cellId: string) => void
}

export function MeetingsList({
  items,
  emptyMessage,
  showCellName = false,
  showViewLink = false,
  onRegisterAttendance,
}: MeetingsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-center text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map(
        ({ meeting, cell, presentCount, absentCount, attendancePct }) => (
          <div
            key={meeting.id}
            className="grid gap-2 rounded-lg border px-4 py-3 text-sm sm:grid-cols-6"
          >
            <p className="flex items-center gap-1 font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {new Date(`${meeting.date}T00:00:00`).toLocaleDateString('pt-BR')}
            </p>

            {showCellName ? <p>{cell?.name ?? 'Célula removida'}</p> : <p />}

            <p>{presentCount} presentes</p>
            <p>{absentCount} ausentes</p>
            <p className="font-medium text-emerald-700 dark:text-emerald-400">
              {attendancePct}% presença
            </p>

            <div className="flex items-center gap-2">
              {showViewLink && (
                <Link
                  href={`/cells/${meeting.cell_id}`}
                  className="text-blue-600 text-xs hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver
                </Link>
              )}
              {onRegisterAttendance && (
                <button
                  type="button"
                  onClick={() => onRegisterAttendance(meeting.cell_id)}
                  className="text-muted-foreground text-xs hover:text-foreground"
                >
                  Registrar presença
                </button>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  )
}
