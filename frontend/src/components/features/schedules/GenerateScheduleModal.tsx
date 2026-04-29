'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useCreateSchedule } from '@/hooks/mutations/useCreateSchedule'
import { mockEvents, mockMinistries, mockUsers } from '@/lib/mocks'
import { getNextOccurrences } from '@/utils/helpers/eventOccurrences'

interface GenerateScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedEventId?: string | null
}

interface VolunteerDraft {
  user_id: string
  role: string
}

function createDefaultDraft(requiredCount: number): VolunteerDraft[] {
  return Array.from({ length: Math.max(1, requiredCount) }, () => ({
    user_id: '',
    role: '',
  }))
}

export function GenerateScheduleModal({
  open,
  onOpenChange,
  preselectedEventId,
}: GenerateScheduleModalProps) {
  const { mutate, isPending } = useCreateSchedule()
  const activeEvents = useMemo(() => mockEvents.filter((event) => !event.deleted_at), [])
  const [eventId, setEventId] = useState('')
  const [date, setDate] = useState('')
  const [volunteersByMinistry, setVolunteersByMinistry] = useState<Record<string, VolunteerDraft[]>>({})

  const selectedEvent = useMemo(
    () => activeEvents.find((event) => event.id === eventId),
    [activeEvents, eventId],
  )

  const occurrenceDates = useMemo(
    () => (selectedEvent?.recurring ? getNextOccurrences(selectedEvent) : []),
    [selectedEvent],
  )

  useEffect(() => {
    if (!open) return
    if (preselectedEventId) {
      setEventId(preselectedEventId)
    }
  }, [open, preselectedEventId])

  useEffect(() => {
    if (!selectedEvent) return
    const nextState: Record<string, VolunteerDraft[]> = {}
    selectedEvent.ministry_requirements.forEach((requirement) => {
      nextState[requirement.ministry_id] = createDefaultDraft(requirement.required_count)
    })
    setVolunteersByMinistry(nextState)
    setDate(selectedEvent.recurring ? '' : selectedEvent.date ?? '')
  }, [selectedEvent])

  function updateVolunteer(ministryId: string, index: number, draft: VolunteerDraft) {
    setVolunteersByMinistry((prev) => {
      const current = prev[ministryId] ?? []
      const next = [...current]
      next[index] = draft
      return { ...prev, [ministryId]: next }
    })
  }

  function addVolunteerRow(ministryId: string) {
    setVolunteersByMinistry((prev) => ({
      ...prev,
      [ministryId]: [...(prev[ministryId] ?? []), { user_id: '', role: '' }],
    }))
  }

  function removeVolunteerRow(ministryId: string, index: number) {
    setVolunteersByMinistry((prev) => {
      const current = prev[ministryId] ?? []
      if (current.length <= 1) return prev
      const next = current.filter((_, rowIndex) => rowIndex !== index)
      return { ...prev, [ministryId]: next }
    })
  }

  function resetForm() {
    setEventId(preselectedEventId ?? '')
    setDate('')
    setVolunteersByMinistry({})
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  function handleGenerate() {
    if (!selectedEvent || !date) return

    const requirements = selectedEvent.ministry_requirements
    requirements.forEach((requirement, requirementIndex) => {
      const ministry = mockMinistries.find((item) => item.id === requirement.ministry_id)
      const drafts = volunteersByMinistry[requirement.ministry_id] ?? []
      const volunteers = drafts
        .filter((draft) => draft.user_id && draft.role)
        .map((draft) => ({
          ...draft,
          confirmation_status: 'pending' as const,
          decline_reason: null,
        }))

      if (volunteers.length === 0) return

      mutate(
        {
          church_id: 'church-1',
          event_id: selectedEvent.id,
          event_occurrence_date: date,
          ministry_id: requirement.ministry_id,
          name: `${selectedEvent.name} - ${ministry?.name ?? 'Ministerio'}`,
          volunteers,
          status: 'pending',
          decline_reason: null,
          notes: null,
        },
        {
          onSuccess: () => {
            if (requirementIndex === requirements.length - 1) {
              handleClose(false)
            }
          },
        },
      )
    })
  }

  const canSubmit = Boolean(selectedEvent && date)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar escalas por evento</DialogTitle>
          <DialogDescription>
            Selecione o evento e preencha os voluntarios por ministerio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel>Evento</FieldLabel>
            <Select value={eventId} onValueChange={(value) => setEventId(value ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o evento" />
              </SelectTrigger>
              <SelectContent>
                {activeEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {selectedEvent && (
            <Field>
              <FieldLabel>Data da ocorrencia</FieldLabel>
              {selectedEvent.recurring ? (
                <Select value={date} onValueChange={(value) => setDate(value ?? '')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a data" />
                  </SelectTrigger>
                  <SelectContent>
                    {occurrenceDates.map((occurrence) => (
                      <SelectItem key={occurrence} value={occurrence}>
                        {new Date(`${occurrence}T00:00:00`).toLocaleDateString('pt-BR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              )}
            </Field>
          )}

          {selectedEvent?.ministry_requirements.map((requirement) => {
            const ministry = mockMinistries.find((item) => item.id === requirement.ministry_id)
            const rows = volunteersByMinistry[requirement.ministry_id] ?? []
            return (
              <div key={requirement.ministry_id} className="space-y-3 rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {ministry?.name ?? requirement.ministry_id}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Necessarios: {requirement.required_count}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => addVolunteerRow(requirement.ministry_id)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-2">
                  {rows.map((row, index) => (
                    <div key={`${requirement.ministry_id}-${index.toString()}`} className="flex items-center gap-2">
                      <Select
                        value={row.user_id}
                        onValueChange={(value) =>
                          updateVolunteer(requirement.ministry_id, index, {
                            ...row,
                            user_id: value ?? '',
                          })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Voluntario" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUsers
                            .filter((user) => !user.deleted_at)
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Cargo"
                        className="w-40"
                        value={row.role}
                        onChange={(event) =>
                          updateVolunteer(requirement.ministry_id, index, {
                            ...row,
                            role: event.target.value,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVolunteerRow(requirement.ministry_id, index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!canSubmit || isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? 'Gerando...' : 'Gerar escalas'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
