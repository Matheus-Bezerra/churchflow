'use client'

import { Clock, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { MeetingsList } from '@/components/features/cells/MeetingsList'
import { RegisterMeetingModal } from '@/components/features/cells/RegisterMeetingModal'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  useCellById,
  useCellMeetingsWithStats,
  useCellMembers,
  useLeaderName,
  useRegisterCellMeeting,
} from '@/hooks/queries/useCells'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'

export default function CellDetailsPage() {
  const params = useParams<{ id: string }>()
  const cellId = params.id
  const [registerOpen, setRegisterOpen] = useState(false)
  const registerMeeting = useRegisterCellMeeting()

  const { data: cell } = useCellById(cellId)
  const { data: members = [] } = useCellMembers(cellId)
  const meetings = useCellMeetingsWithStats(cellId)
  const leaderName = useLeaderName(cell?.leader_id ?? '')
  const leader = members.find((member) => member.id === cell?.leader_id)

  if (!cell) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="font-medium text-muted-foreground">
          Célula não encontrada.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-foreground">{cell.name}</h2>
          <p className="text-muted-foreground text-sm">
            Acompanhamento de saúde e engajamento da célula
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setRegisterOpen(true)}
        >
          Registrar reunião
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <h3 className="font-semibold text-foreground text-lg">
            Informações básicas
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Líder</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className="font-semibold text-[10px]"
                    style={getAvatarFallbackStyle(leader?.avatar_color)}
                  >
                    {getInitials(leaderName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{leaderName}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">
                Endereço
              </p>
              <p className="flex items-center gap-1 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {cell.address ?? 'Nao informado'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Dia</p>
              <p className="font-medium text-sm">{cell.meeting_day}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Horário</p>
              <p className="flex items-center gap-1 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {cell.meeting_time}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <h3 className="font-semibold text-foreground text-lg">Membros</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback
                      className="font-semibold text-[10px]"
                      style={getAvatarFallbackStyle(member.avatar_color)}
                    >
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{member.name}</span>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground text-xs">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-lg">
              Reuniões e presença
            </h3>
            <Button variant="outline" onClick={() => setRegisterOpen(true)}>
              Registrar reunião
            </Button>
          </div>
          <Separator />

          <MeetingsList
            items={meetings}
            emptyMessage="Nenhuma reunião registrada ainda."
            onRegisterAttendance={() => setRegisterOpen(true)}
          />
        </CardContent>
      </Card>

      <RegisterMeetingModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        cell={cell}
        members={members}
        existingMeetingDates={meetings.map(({ meeting }) => meeting.date)}
        onSave={({ date, absentMemberIds }) => {
          registerMeeting({ cellId, date, members, absentMemberIds })
        }}
      />
    </div>
  )
}
