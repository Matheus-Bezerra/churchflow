'use client'

import { useMemo, useState } from 'react'

import {
  MEETING_WINDOW_DAYS_PAST,
  MEETING_WINDOW_MONTHS_AHEAD,
} from '@/components/features/cells/constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { generateMeetingDates, toMeetingDateKey } from '@/lib/meetingDates'
import { cn, getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { Cell } from '@/types/church'
import type { User } from '@/types/user'

interface RegisterMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cell: Cell
  members: User[]
  existingMeetingDates: string[]
  onSave: (payload: { date: string; absentMemberIds: string[] }) => void
}

export function RegisterMeetingModal({
  open,
  onOpenChange,
  cell,
  members,
  existingMeetingDates,
  onSave,
}: RegisterMeetingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [absentMemberIds, setAbsentMemberIds] = useState<string[]>([])

  const meetingDateOptions = useMemo(
    () =>
      generateMeetingDates(
        cell.meeting_day,
        MEETING_WINDOW_DAYS_PAST,
        MEETING_WINDOW_MONTHS_AHEAD,
      ),
    [cell.meeting_day],
  )
  const disabledDates = useMemo(
    () => new Set(existingMeetingDates),
    [existingMeetingDates],
  )
  const selectableDateOptions = useMemo(
    () =>
      meetingDateOptions.map((date) => {
        const key = toMeetingDateKey(date)
        return {
          date,
          key,
          disabled: disabledDates.has(key),
        }
      }),
    [meetingDateOptions, disabledDates],
  )

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
    if (!selectedDate) return
    onSave({ date: selectedDate, absentMemberIds })
    setAbsentMemberIds([])
    setSelectedDate('')
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setAbsentMemberIds([])
          setSelectedDate('')
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar reunião</DialogTitle>
          <DialogDescription>
            Escolha uma data de {cell.meeting_day} (30 dias passados até 3 meses
            à frente).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">
              Data da reunião
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {selectableDateOptions.map(({ date, key, disabled }) => (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedDate(key)}
                  className={cn(
                    'rounded-md border px-2 py-2 text-left text-xs transition-colors',
                    selectedDate === key &&
                      'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
                    disabled && 'cursor-not-allowed opacity-50',
                    !disabled && selectedDate !== key && 'hover:bg-muted/50',
                  )}
                >
                  <div className="font-medium">
                    {date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                  <div className="text-muted-foreground">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium text-foreground text-sm">
                Presença dos membros
              </p>
              <div className="flex gap-1.5">
                <Badge variant="secondary">{presentCount} presentes</Badge>
                <Badge variant="secondary">{absentCount} ausentes</Badge>
              </div>
            </div>
            <div className="space-y-2">
              {members.map((member) => {
                const isPresent = !absentMemberIds.includes(member.id)
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors',
                      isPresent
                        ? 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                        : 'border-red-200 bg-red-50/60 hover:bg-red-50 dark:border-red-900/40 dark:bg-red-950/20',
                    )}
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
                      className={cn(
                        'rounded-md px-2 py-1 font-medium text-xs',
                        isPresent
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
                      )}
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
              disabled={!selectedDate}
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
