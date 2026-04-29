'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { MeetingsList } from '@/components/features/cells/MeetingsList'
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
          <h2 className="font-bold text-2xl text-foreground">
            Reunioes de Celulas
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
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

          <MeetingsList
            items={meetings}
            emptyMessage="Nenhuma reunião encontrada para o filtro selecionado."
            showCellName
            showViewLink
            onRegisterAttendance={(cellId) => {
              setRegisterCellId(cellId)
              setRegisterOpen(true)
            }}
          />
        </CardContent>
      </Card>

      {selectedCell && (
        <RegisterMeetingModal
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          cell={selectedCell}
          members={members}
          existingMeetingDates={meetings
            .filter(({ meeting }) => meeting.cell_id === selectedCell.id)
            .map(({ meeting }) => meeting.date)}
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
