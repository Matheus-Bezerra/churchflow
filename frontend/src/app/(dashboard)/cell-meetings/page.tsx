'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { RegisterMeetingModal } from '@/components/features/cells/RegisterMeetingModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCellMeetingsWithStats,
  useCellMembers,
  useCells,
  useRegisterCellMeeting,
} from '@/hooks/queries/useCells'

export default function CellMeetingsPage() {
  const [selectedCellId, setSelectedCellId] = useState<string>('all')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registerCellId, setRegisterCellId] = useState<string | null>(null)
  const registerMeeting = useRegisterCellMeeting()

  const { data: cells = [] } = useCells()
  const selectedCell = cells.find((cell) => cell.id === registerCellId) ?? null
  const { data: members = [] } = useCellMembers(registerCellId ?? '')
  const meetings = useCellMeetingsWithStats(
    selectedCellId === 'all' ? undefined : selectedCellId,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">
            Reunioes de Celulas
          </h2>
          <p className="mt-1 text-gray-500 text-sm">
            Registre presenca e acompanhe atividade por data
          </p>
        </div>
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setRegisterCellId(cells[0]?.id ?? null)
            setRegisterOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Registrar reuniao
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm">Filtrar por celula</span>
            <Select
              value={selectedCellId}
              onValueChange={(value) => setSelectedCellId(value as string)}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as celulas</SelectItem>
                {cells.map((cell) => (
                  <SelectItem key={cell.id} value={cell.id}>
                    {cell.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {meetings.map(
              ({ meeting, cell, presentCount, absentCount, attendancePct }) => (
                <div
                  key={meeting.id}
                  className="grid gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm sm:grid-cols-6"
                >
                  <p className="font-medium">
                    {new Date(`${meeting.date}T00:00:00`).toLocaleDateString(
                      'pt-BR',
                    )}
                  </p>
                  <p>{cell?.name ?? 'Celula removida'}</p>
                  <p>{presentCount} presentes</p>
                  <p>{absentCount} ausentes</p>
                  <p className="font-medium text-emerald-700">
                    {attendancePct}%
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cells/${meeting.cell_id}`}
                      className="text-blue-600 text-xs hover:text-blue-700"
                    >
                      Ver
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setRegisterCellId(meeting.cell_id)
                        setRegisterOpen(true)
                      }}
                      className="text-gray-500 text-xs hover:text-gray-700"
                    >
                      Registrar presenca
                    </button>
                  </div>
                </div>
              ),
            )}
            {meetings.length === 0 && (
              <div className="rounded-lg border border-gray-200 border-dashed p-5 text-center text-gray-500 text-sm">
                Nenhuma reuniao encontrada para o filtro selecionado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCell && (
        <RegisterMeetingModal
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          members={members}
          onSave={({ date, absentMemberIds }) => {
            registerMeeting({
              cellId: selectedCell.id,
              date,
              members,
              absentMemberIds,
            })
          }}
        />
      )}
    </div>
  )
}
