'use client'

import { Plus, X } from 'lucide-react'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { EventFormData } from '@/schemas/event'
import type { RecurrenceSlot } from '@/types/event'

interface EventRecurrenceSectionProps {
  register: UseFormRegister<EventFormData>
  control: Control<EventFormData>
  setValue: UseFormSetValue<EventFormData>
  errors: FieldErrors<EventFormData>
  recurring: boolean
  recurrenceType: string
  recurrenceSlots: RecurrenceSlot[]
  slotDay: string
  setSlotDay: (day: string) => void
  slotTime: string
  setSlotTime: (time: string) => void
  addSlot: () => void
  removeSlot: (index: number) => void
  dayOptions: string[]
}

export function EventRecurrenceSection({
  register,
  control,
  setValue,
  errors,
  recurring,
  recurrenceType,
  recurrenceSlots,
  slotDay,
  setSlotDay,
  slotTime,
  setSlotTime,
  addSlot,
  removeSlot,
  dayOptions,
}: EventRecurrenceSectionProps) {
  const slotsError = (errors as { recurrence_slots?: { message?: string } })
    .recurrence_slots

  return (
    <>
      {/* Recurring toggle */}
      <Field>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <p className="font-medium text-foreground text-sm">Evento recorrente</p>
            <p className="text-muted-foreground text-xs">
              Repete com um padrão semanal ou mensal
            </p>
          </div>
          <Controller
            name="recurring"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                role="switch"
                aria-checked={field.value}
                onClick={() => {
                  field.onChange(!field.value)
                  setValue('recurrence_slots', [])
                  setValue('date', '')
                  setValue('time', '')
                }}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2',
                  field.value ? 'bg-blue-600' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                    field.value ? 'translate-x-5' : 'translate-x-0',
                  )}
                />
              </button>
            )}
          />
        </div>
      </Field>

      {/* Non-recurring: date + time */}
      {!recurring && (
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.date}>
            <FieldLabel htmlFor="ev-date">Data *</FieldLabel>
            <Input
              id="ev-date"
              type="date"
              aria-invalid={!!errors.date}
              {...register('date')}
            />
            <FieldError errors={errors.date ? [errors.date] : []} />
          </Field>
          <Field data-invalid={!!errors.time}>
            <FieldLabel htmlFor="ev-time">Horário *</FieldLabel>
            <Input
              id="ev-time"
              type="time"
              aria-invalid={!!errors.time}
              {...register('time')}
            />
            <FieldError errors={errors.time ? [errors.time] : []} />
          </Field>
        </div>
      )}

      {/* Recurring: pattern toggle + slot builder */}
      {recurring && (
        <>
          <Field>
            <FieldLabel>Padrão de recorrência</FieldLabel>
            <div className="flex overflow-hidden rounded-lg border text-sm">
              <Controller
                name="recurrence_type"
                control={control}
                render={({ field }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('weekly')
                        setValue('recurrence_slots', [])
                        setSlotDay('Domingo')
                      }}
                      className={cn(
                        'flex-1 py-1.5 font-medium transition-colors',
                        field.value === 'weekly'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                          : 'bg-background text-muted-foreground hover:bg-muted/50',
                      )}
                    >
                      Semanal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('monthly')
                        setValue('recurrence_slots', [])
                        setSlotDay('1')
                      }}
                      className={cn(
                        'flex-1 py-1.5 font-medium transition-colors',
                        field.value === 'monthly'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                          : 'bg-background text-muted-foreground hover:bg-muted/50',
                      )}
                    >
                      Mensal
                    </button>
                  </>
                )}
              />
            </div>
          </Field>

          <Field data-invalid={!!slotsError}>
            <FieldLabel>
              {recurrenceType === 'monthly'
                ? 'Dias do mês e horários *'
                : 'Dias e horários *'}
            </FieldLabel>

            {recurrenceSlots.length > 0 && (
              <div className="mb-2 space-y-1.5">
                {recurrenceSlots.map((slot, i) => (
                  <div
                    key={`${slot.day}-${slot.time}-${String(i)}`}
                    className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-1.5"
                  >
                    <span className="text-foreground text-sm">
                      <span className="font-medium">
                        {recurrenceType === 'monthly' ? `Dia ${slot.day}` : slot.day}
                      </span>
                      <span className="mx-1.5 text-muted-foreground">·</span>
                      {slot.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="rounded p-0.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <select
                value={slotDay}
                onChange={(e) => setSlotDay(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {recurrenceType === 'monthly' ? `Dia ${d}` : d}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-32"
              />
              <Button
                type="button"
                size="icon-sm"
                onClick={addSlot}
                className="shrink-0 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {slotsError && (
              <p className="mt-1 text-destructive text-xs">{slotsError.message}</p>
            )}
          </Field>
        </>
      )}
    </>
  )
}
