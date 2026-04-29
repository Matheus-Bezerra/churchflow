'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateSchedule } from '@/hooks/mutations/useUpdateSchedule'
import { mockMinistries, mockUsers } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { ScheduleVolunteer, ScheduleWithMeta } from '@/types/schedule'

interface EditScheduleModalProps {
  schedule: ScheduleWithMeta | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface VolunteerDraft {
  user_id: string
  role: string
  confirmation_status: ScheduleVolunteer['confirmation_status']
  decline_reason?: string | null
}

export function EditScheduleModal({
  schedule,
  open,
  onOpenChange,
}: EditScheduleModalProps) {
  const { mutate, isPending } = useUpdateSchedule()

  const [volunteers, setVolunteers] = useState<VolunteerDraft[]>([])
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!schedule) return
    setVolunteers(schedule.volunteers.map((v) => ({ ...v })))
    // Merge description + material_links into a single content field
    const lines: string[] = []
    if (schedule.description) lines.push(schedule.description)
    if (schedule.material_links?.length) lines.push(...schedule.material_links)
    setContent(lines.join('\n'))
  }, [schedule])

  function updateVolunteer(index: number, partial: Partial<VolunteerDraft>) {
    setVolunteers((current) =>
      current.map((v, i) => (i === index ? { ...v, ...partial } : v)),
    )
  }

  function handleSave() {
    if (!schedule) return
    const lines = content
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    mutate(
      {
        id: schedule.id,
        volunteers,
        description: null,
        material_links: lines,
        notes: null,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  const ministry = schedule
    ? mockMinistries.find((m) => m.id === schedule.ministry_id)
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-gray-100 border-b px-6 pt-6 pb-4">
          <DialogTitle className="font-bold text-gray-900 text-xl">
            Editar escala
          </DialogTitle>
          {schedule && (
            <p className="text-gray-500 text-sm">
              {ministry?.name ?? schedule.ministry_name} ·{' '}
              {new Date(`${schedule.event_occurrence_date}T00:00:00`).toLocaleDateString(
                'pt-BR',
              )}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Volunteers */}
          <div>
            <p className="mb-2 font-medium text-gray-900 text-sm">Voluntários</p>
            <div className="space-y-2">
              {volunteers.map((volunteer, index) => (
                <div
                  key={`edit-vol-${index.toString()}`}
                  className="flex items-center gap-2"
                >
                  <Select
                    value={volunteer.user_id}
                    onValueChange={(value) =>
                      updateVolunteer(index, { user_id: value ?? '' })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Voluntário" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers
                        .filter((u) => !u.deleted_at)
                        .map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            <span className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={u.avatar_url} />
                                <AvatarFallback
                                  className="text-[10px]"
                                  style={getAvatarFallbackStyle(u.avatar_color)}
                                >
                                  {getInitials(u.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{u.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={volunteer.role}
                    onChange={(e) => updateVolunteer(index, { role: e.target.value })}
                    placeholder="Função / cargo"
                    className="w-40"
                  />
                  <Select
                    value={volunteer.confirmation_status}
                    onValueChange={(value) =>
                      updateVolunteer(index, {
                        confirmation_status:
                          value as ScheduleVolunteer['confirmation_status'],
                      })
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="declined">Recusado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <Field>
            <FieldLabel>Conteúdo</FieldLabel>
            <Textarea
              rows={6}
              placeholder={'Cole links, PDFs, planilhas, notas...\nhttps://notion.so/...\nhttps://drive.google.com/...\nArquivo de cifras - maio 2026'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
        </div>

        <DialogFooter className="shrink-0 border-gray-100 border-t px-6 pt-4 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
