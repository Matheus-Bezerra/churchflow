'use client'

import { useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateSchedule } from '@/hooks/mutations/useCreateSchedule'
import { mockEvents, mockMinistries, mockUsers } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import { getNextOccurrences } from '@/utils/helpers/eventOccurrences'

interface CreateScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface VolunteerDraft {
  user_id: string
  role: string
}

interface MinistryScheduleDraft {
  ministry_id: string
  content: string
  volunteers: VolunteerDraft[]
}

export function CreateScheduleModal({
  open,
  onOpenChange,
}: CreateScheduleModalProps) {
  const { mutate, isPending } = useCreateSchedule()

  const activeEvents = useMemo(() => {
    const events = mockEvents.filter((event) => !event.deleted_at)
    return events.sort((a, b) => {
      const nextA = a.recurring
        ? (getNextOccurrences(a)[0] ?? '9999-99-99')
        : (a.date ?? '9999-99-99')
      const nextB = b.recurring
        ? (getNextOccurrences(b)[0] ?? '9999-99-99')
        : (b.date ?? '9999-99-99')
      return nextA.localeCompare(nextB)
    })
  }, [])
  const [eventId, setEventId] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [ministryDrafts, setMinistryDrafts] = useState<MinistryScheduleDraft[]>([])

  const selectedEvent = useMemo(
    () => activeEvents.find((event) => event.id === eventId) ?? null,
    [activeEvents, eventId],
  )

  const occurrenceDates = useMemo(
    () => (selectedEvent?.recurring ? getNextOccurrences(selectedEvent) : []),
    [selectedEvent],
  )

  function buildDraftsForEvent(nextEventId: string) {
    const nextEvent = activeEvents.find((event) => event.id === nextEventId)
    if (!nextEvent) {
      setMinistryDrafts([])
      setEventDate('')
      return
    }
    setMinistryDrafts(
      nextEvent.ministry_requirements.map((requirement) => ({
        ministry_id: requirement.ministry_id,
        content: '',
        volunteers: Array.from(
          { length: Math.max(1, requirement.required_count) },
          () => ({ user_id: '', role: '' }),
        ),
      })),
    )
    setEventDate(nextEvent.recurring ? '' : nextEvent.date ?? '')
  }

  function resetForm() {
    setEventId('')
    setEventDate('')
    setMinistryDrafts([])
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) resetForm()
    onOpenChange(isOpen)
  }

  function updateMinistryDraft(
    ministryId: string,
    updater: (draft: MinistryScheduleDraft) => MinistryScheduleDraft,
  ) {
    setMinistryDrafts((current) =>
      current.map((draft) =>
        draft.ministry_id === ministryId ? updater(draft) : draft,
      ),
    )
  }

  function updateVolunteer(
    ministryId: string,
    volunteerIndex: number,
    partial: Partial<VolunteerDraft>,
  ) {
    updateMinistryDraft(ministryId, (draft) => ({
      ...draft,
      volunteers: draft.volunteers.map((volunteer, index) =>
        index === volunteerIndex ? { ...volunteer, ...partial } : volunteer,
      ),
    }))
  }

  function createSchedules() {
    if (!selectedEvent || !eventDate) return

    const validDrafts = ministryDrafts.filter((draft) =>
      draft.volunteers.some((volunteer) => volunteer.user_id && volunteer.role),
    )
    if (validDrafts.length === 0) return

    validDrafts.forEach((draft, index) => {
      const ministry = mockMinistries.find((item) => item.id === draft.ministry_id)
      const volunteers = draft.volunteers
        .filter((volunteer) => volunteer.user_id && volunteer.role)
        .map((volunteer) => ({
          ...volunteer,
          confirmation_status: 'pending' as const,
          decline_reason: null,
        }))

      mutate(
        {
          church_id: 'church-1',
          name: `${selectedEvent.name} - ${ministry?.name ?? draft.ministry_id}`,
          event_id: selectedEvent.id,
          event_occurrence_date: eventDate,
          ministry_id: draft.ministry_id,
          volunteers,
          status: 'pending',
          decline_reason: null,
          description: null,
          material_links: draft.content
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
          notes: null,
        },
        {
          onSuccess: () => {
            if (index === validDrafts.length - 1) {
              handleOpenChange(false)
            }
          },
        },
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle className="font-bold text-foreground text-xl">
            Nova Escala
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Crie uma nova escala de serviço vinculada a um evento
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <Field>
              <FieldLabel>Evento *</FieldLabel>
              <Select
                value={eventId}
                onValueChange={(value) => {
                  const nextId = value ?? ''
                  setEventId(nextId)
                  buildDraftsForEvent(nextId)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
                <SelectContent>
                  {activeEvents.map((event) => {
                    const nextDate = event.recurring
                      ? getNextOccurrences(event)[0]
                      : event.date
                    const label = nextDate
                      ? new Date(`${nextDate}T00:00:00`).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : null
                    return (
                      <SelectItem key={event.id} value={event.id}>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: event.color }}
                          />
                          <span>{event.name}</span>
                          {label && (
                            <span className="text-muted-foreground text-xs">· {label}</span>
                          )}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </Field>

            {selectedEvent && (
              <Field>
                <FieldLabel>Data de ocorrência *</FieldLabel>
                {selectedEvent.recurring ? (
                  <Select value={eventDate} onValueChange={(value) => setEventDate(value ?? '')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a data" />
                    </SelectTrigger>
                    <SelectContent>
                      {occurrenceDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                  />
                )}
              </Field>
            )}

            {ministryDrafts.map((draft) => {
              const requirement = selectedEvent?.ministry_requirements.find(
                (item) => item.ministry_id === draft.ministry_id,
              )
              const ministry = mockMinistries.find((item) => item.id === draft.ministry_id)
              return (
                <div
                  key={draft.ministry_id}
                  className="space-y-4 rounded-lg border bg-muted/40 p-4"
                >
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {ministry?.name ?? draft.ministry_id}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {requirement?.required_count ?? 0} voluntário
                      {(requirement?.required_count ?? 0) !== 1 ? 's' : ''} planejado
                      {(requirement?.required_count ?? 0) !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {draft.volunteers.map((volunteer, index) => (
                      <div
                        key={`${draft.ministry_id}-${index.toString()}`}
                        className="flex items-center gap-2"
                      >
                        <Select
                          value={volunteer.user_id}
                          onValueChange={(value) =>
                            updateVolunteer(draft.ministry_id, index, {
                              user_id: value ?? '',
                            })
                          }
                        >
                          <SelectTrigger className="flex-1 bg-background">
                            <SelectValue placeholder="Selecione o voluntário" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockUsers
                              .filter((user) => !user.deleted_at)
                              .map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  <span className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={user.avatar_url} />
                                      <AvatarFallback
                                        className="text-[10px]"
                                        style={getAvatarFallbackStyle(user.avatar_color)}
                                      >
                                        {getInitials(user.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{user.name}</span>
                                  </span>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={volunteer.role}
                          onChange={(event) =>
                            updateVolunteer(draft.ministry_id, index, {
                              role: event.target.value,
                            })
                          }
                          placeholder="Função / cargo"
                          className="w-40 bg-background"
                        />
                      </div>
                    ))}
                  </div>

                  <Field>
                    <FieldLabel>Conteúdo</FieldLabel>
                    <Textarea
                      rows={5}
                      placeholder={'Cole links, PDFs, planilhas, notas...\nhttps://notion.so/...\nhttps://drive.google.com/...\nArquivo de cifras - maio 2026'}
                      value={draft.content}
                      onChange={(event) =>
                        updateMinistryDraft(draft.ministry_id, (current) => ({
                          ...current,
                          content: event.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              )
            })}
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isPending || !selectedEvent || !eventDate}
              onClick={createSchedules}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Salvando...' : 'Criar Escalas'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
