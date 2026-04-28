'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'

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
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
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
import {
  checkVolunteerConflict,
  mockEvents,
  mockMinistries,
  mockUnavailabilities,
  mockUsers,
} from '@/lib/mocks'
import { cn, getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import { type ScheduleFormData, scheduleSchema } from '@/schemas/schedule'
import { getNextOccurrences } from '@/utils/helpers/eventOccurrences'

interface CreateScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateScheduleModal({
  open,
  onOpenChange,
}: CreateScheduleModalProps) {
  const { mutate, isPending } = useCreateSchedule()
  const [repeatEnabled, setRepeatEnabled] = useState(false)

  const activeEvents = useMemo(
    () => mockEvents.filter((e) => !e.deleted_at),
    [],
  )
  const activeMinistries = useMemo(
    () => mockMinistries.filter((m) => !m.deleted_at),
    [],
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: '',
      event_id: '',
      event_occurrence_date: '',
      ministry_id: '',
      volunteers: [{ user_id: '', role: '' }],
      notes: '',
      repeat_occurrences: 1,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'volunteers',
  })

  const watchedEventId = useWatch({ control, name: 'event_id' })
  const watchedDate = useWatch({ control, name: 'event_occurrence_date' })
  const watchedVolunteers = useWatch({ control, name: 'volunteers' })

  const selectedEvent = useMemo(
    () => activeEvents.find((e) => e.id === watchedEventId) ?? null,
    [activeEvents, watchedEventId],
  )

  const occurrenceDates = useMemo(
    () => (selectedEvent?.recurring ? getNextOccurrences(selectedEvent) : []),
    [selectedEvent],
  )

  function handleEventChange(id: string, fieldOnChange: (id: unknown) => void) {
    fieldOnChange(id)
    setValue('event_occurrence_date', '')
    setRepeatEnabled(false)
  }

  const eventItemLabel = useMemo(
    () => (id: string) => activeEvents.find((e) => e.id === id)?.name ?? id,
    [activeEvents],
  )

  const ministryItemLabel = useMemo(
    () => (id: string) => activeMinistries.find((m) => m.id === id)?.name ?? id,
    [activeMinistries],
  )

  function volunteerItemLabel(id: string) {
    return mockUsers.find((u) => u.id === id)?.name ?? id
  }

  function onSubmit(data: ScheduleFormData) {
    const datesToSchedule: string[] =
      repeatEnabled && selectedEvent?.recurring && occurrenceDates.length > 0
        ? (() => {
            const idx = occurrenceDates.indexOf(data.event_occurrence_date)
            const count = data.repeat_occurrences ?? 1
            return idx >= 0
              ? occurrenceDates.slice(idx, idx + count)
              : [data.event_occurrence_date]
          })()
        : [data.event_occurrence_date]

    datesToSchedule.forEach((date, i) => {
      mutate(
        {
          name:
            datesToSchedule.length > 1
              ? `${data.name} (${i + 1}/${datesToSchedule.length})`
              : data.name,
          event_id: data.event_id,
          event_occurrence_date: date,
          ministry_id: data.ministry_id,
          volunteers: data.volunteers,
          notes: data.notes,
          church_id: 'church-1',
          status: 'pending',
          decline_reason: null,
        },
        {
          onSuccess: () => {
            if (i === datesToSchedule.length - 1) {
              onOpenChange(false)
              reset()
              setRepeatEnabled(false)
            }
          },
        },
      )
    })
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      reset()
      setRepeatEnabled(false)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-gray-100 border-b px-6 pt-6 pb-4">
          <DialogTitle className="font-bold text-gray-900 text-xl">
            Nova Escala
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Crie uma nova escala de serviço vinculada a um evento
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="sched-name">Nome *</FieldLabel>
              <Input
                id="sched-name"
                placeholder="Ex.: Louvor — Culto de Domingo"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={errors.name ? [errors.name] : []} />
            </Field>

            {/* Event */}
            <Controller
              name="event_id"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.event_id}>
                  <FieldLabel>Evento *</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(id) =>
                      handleEventChange(id ?? '', field.onChange)
                    }
                    itemToStringLabel={eventItemLabel}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEvents.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: e.color }}
                            />
                            {e.name}
                            {e.recurring && (
                              <span className="text-gray-400 text-xs">
                                (recorrente)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={errors.event_id ? [errors.event_id] : []}
                  />
                </Field>
              )}
            />

            {/* Occurrence date */}
            {selectedEvent && (
              <Controller
                name="event_occurrence_date"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.event_occurrence_date}>
                    <FieldLabel>Data de ocorrência *</FieldLabel>
                    {selectedEvent.recurring ? (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        itemToStringLabel={(v) =>
                          new Date(v + 'T00:00:00').toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              weekday: 'short',
                            },
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a data" />
                        </SelectTrigger>
                        <SelectContent>
                          {occurrenceDates.map((d) => (
                            <SelectItem key={d} value={d}>
                              {new Date(d + 'T00:00:00').toLocaleDateString(
                                'pt-BR',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  weekday: 'short',
                                },
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type="date"
                        value={
                          selectedEvent.date ? selectedEvent.date : field.value
                        }
                        readOnly={!!selectedEvent.date}
                        onChange={field.onChange}
                        className={selectedEvent.date ? 'bg-gray-50' : ''}
                      />
                    )}
                    <FieldError
                      errors={
                        errors.event_occurrence_date
                          ? [errors.event_occurrence_date]
                          : []
                      }
                    />
                  </Field>
                )}
              />
            )}

            {/* Ministry */}
            <Controller
              name="ministry_id"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.ministry_id}>
                  <FieldLabel>Ministério *</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    itemToStringLabel={ministryItemLabel}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o ministério" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeMinistries.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={errors.ministry_id ? [errors.ministry_id] : []}
                  />
                </Field>
              )}
            />

            {/* Volunteers */}
            <Field
              data-invalid={
                !!(errors as { volunteers?: { message?: string } }).volunteers
              }
            >
              <div className="flex items-center justify-between">
                <FieldLabel>Voluntários *</FieldLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => append({ user_id: '', role: '' })}
                  className="h-7 gap-1 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const volunteerId = watchedVolunteers?.[index]?.user_id
                  const user = mockUsers.find((u) => u.id === volunteerId)
                  const hasConflict =
                    !!volunteerId &&
                    !!watchedDate &&
                    checkVolunteerConflict(
                      volunteerId,
                      watchedDate,
                      mockUnavailabilities,
                    )

                  return (
                    <div
                      key={field.id}
                      className={cn(
                        'rounded-lg border p-3',
                        hasConflict
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-gray-200 bg-gray-50',
                      )}
                    >
                      {hasConflict && (
                        <div className="mb-2 flex items-center gap-1.5 text-amber-700 text-xs">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {user?.name ?? 'Voluntário'} está indisponível nesta
                            data
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {user && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback
                              className="text-[10px]"
                              style={getAvatarFallbackStyle(user.avatar_color)}
                            >
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-1 gap-2">
                          <Controller
                            name={`volunteers.${index}.user_id`}
                            control={control}
                            render={({ field: vField }) => (
                              <Select
                                value={vField.value}
                                onValueChange={vField.onChange}
                                itemToStringLabel={volunteerItemLabel}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Voluntário" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockUsers
                                    .filter((u) => !u.deleted_at)
                                    .map((u) => (
                                      <SelectItem key={u.id} value={u.id}>
                                        {u.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <Input
                            placeholder="Cargo"
                            className="w-32"
                            {...register(`volunteers.${index}.role`)}
                          />
                        </div>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {(errors as { volunteers?: { message?: string } }).volunteers
                ?.message && (
                <p className="mt-1 text-destructive text-xs">
                  {
                    (errors as { volunteers?: { message?: string } }).volunteers
                      ?.message
                  }
                </p>
              )}
            </Field>

            {/* Notes */}
            <Field data-invalid={!!errors.notes}>
              <FieldLabel htmlFor="sched-notes">Observações</FieldLabel>
              <Textarea
                id="sched-notes"
                placeholder="Alguma instrução especial para esta escala..."
                rows={3}
                {...register('notes')}
              />
              <FieldError errors={errors.notes ? [errors.notes] : []} />
            </Field>

            {/* Repeat for recurring events */}
            {selectedEvent?.recurring && (
              <Field>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Repetir escala
                    </p>
                    <p className="text-gray-500 text-xs">
                      Cria automaticamente para as próximas ocorrências
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={repeatEnabled}
                    onClick={() => setRepeatEnabled((v) => !v)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                      repeatEnabled ? 'bg-blue-600' : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                        repeatEnabled ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                {repeatEnabled && (
                  <div className="mt-2">
                    <FieldLabel htmlFor="repeat-count">
                      Número de ocorrências (máx. 8)
                    </FieldLabel>
                    <Controller
                      name="repeat_occurrences"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={String(field.value ?? 1)}
                          onValueChange={(v) => field.onChange(Number(v))}
                          itemToStringLabel={(v) =>
                            `${v} ocorrência${Number(v) > 1 ? 's' : ''}`
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => i + 1).map(
                              (n) => (
                                <SelectItem key={n} value={String(n)}>
                                  {n} ocorrência{n > 1 ? 's' : ''}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
              </Field>
            )}
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
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Salvando...' : 'Criar Escala'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
