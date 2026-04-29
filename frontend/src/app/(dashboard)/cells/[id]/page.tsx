'use client'

import { Calendar, Clock, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

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
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="font-medium text-gray-500">Celula nao encontrada.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">{cell.name}</h2>
          <p className="text-gray-500 text-sm">
            Acompanhamento de saude e engajamento da celula
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setRegisterOpen(true)}
        >
          Registrar reuniao
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <h3 className="font-semibold text-gray-900 text-lg">
            Informacoes basicas
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase">Lider</p>
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
              <p className="text-gray-500 text-xs uppercase">Endereco</p>
              <p className="flex items-center gap-1 text-sm">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {cell.address ?? 'Nao informado'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase">Dia</p>
              <p className="font-medium text-sm">{cell.meeting_day}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase">Horario</p>
              <p className="flex items-center gap-1 text-sm">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                {cell.meeting_time}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <h3 className="font-semibold text-gray-900 text-lg">Membros</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
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
                <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-600 text-xs">
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
            <h3 className="font-semibold text-gray-900 text-lg">
              Reunioes e presenca
            </h3>
            <Button variant="outline" onClick={() => setRegisterOpen(true)}>
              Registrar reuniao
            </Button>
          </div>
          <Separator />

          <div className="space-y-3">
            {meetings.map(
              ({ meeting, presentCount, absentCount, attendancePct }) => (
                <div
                  key={meeting.id}
                  className="grid gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm sm:grid-cols-4"
                >
                  <p className="flex items-center gap-1 font-medium">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(`${meeting.date}T00:00:00`).toLocaleDateString(
                      'pt-BR',
                    )}
                  </p>
                  <p>Presentes: {presentCount}</p>
                  <p>Ausentes: {absentCount}</p>
                  <p className="font-medium text-emerald-700">
                    {attendancePct}% presenca
                  </p>
                </div>
              ),
            )}
            {meetings.length === 0 && (
              <div className="rounded-lg border border-gray-200 border-dashed p-5 text-center text-gray-500 text-sm">
                Nenhuma reuniao registrada ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RegisterMeetingModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        members={members}
        onSave={({ date, absentMemberIds }) => {
          registerMeeting({ cellId, date, members, absentMemberIds })
        }}
      />
    </div>
  )
}
