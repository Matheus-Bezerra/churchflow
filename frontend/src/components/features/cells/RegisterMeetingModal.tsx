'use client'

import { useMemo, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { User } from '@/types/user'

interface RegisterMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: User[]
  onSave: (payload: { date: string; absentMemberIds: string[] }) => void
}

function todayDateValue() {
  return new Date().toISOString().slice(0, 10)
}

export function RegisterMeetingModal({
  open,
  onOpenChange,
  members,
  onSave,
}: RegisterMeetingModalProps) {
  const [date, setDate] = useState(todayDateValue())
  const [absentMemberIds, setAbsentMemberIds] = useState<string[]>([])

  const absentCount = absentMemberIds.length
  const presentCount = useMemo(
    () => members.length - absentMemberIds.length,
    [members.length, absentMemberIds.length],
  )

  const toggleMember = (memberId: string) => {
    setAbsentMemberIds((previous) =>
      previous.includes(memberId)
        ? previous.filter((id) => id !== memberId)
        : [...previous, memberId],
    )
  }

  const handleSave = () => {
    onSave({ date, absentMemberIds })
    setAbsentMemberIds([])
    setDate(todayDateValue())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar reunião</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-sm">Data da reunião</p>
            <Input
              value={date}
              type="date"
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="rounded-lg border border-gray-200 p-3">
            <p className="mb-3 font-medium text-gray-700 text-sm">
              Presença ({presentCount} presentes, {absentCount} ausentes)
            </p>
            <div className="space-y-2">
              {members.map((member) => {
                const isPresent = !absentMemberIds.includes(member.id)
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left transition-colors hover:bg-gray-50"
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
                    <span
                      className={`rounded-md px-2 py-1 font-medium text-xs ${isPresent ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
                    >
                      {isPresent ? 'Presente' : 'Ausente'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
            >
              Salvar reunião
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
