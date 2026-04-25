'use client'

import { Settings2 } from 'lucide-react'
import { Controller } from 'react-hook-form'

import { EventColorPicker } from '@/components/features/events/EventColorPicker'
import { EventIconPicker } from '@/components/features/events/EventIconPicker'
import { EventMinistryPicker } from '@/components/features/events/EventMinistryPicker'
import { EventRecurrenceSection } from '@/components/features/events/EventRecurrenceSection'
import { EventTypeManager } from '@/components/features/events/EventTypeManager'
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

import { useEventForm } from './hooks/useEventForm'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const {
    form,
    isPending,
    onSubmit,
    handleOpenChange,
    // type
    eventTypes,
    typeManagerOpen,
    setTypeManagerOpen,
    handleAddType,
    handleEditType,
    handleDeleteType,
    typeItemLabel,
    // recurrence
    slotDay,
    setSlotDay,
    slotTime,
    setSlotTime,
    addSlot,
    removeSlot,
    dayOptions,
    // ministry
    ministryPopoverOpen,
    setMinistryPopoverOpen,
    toggleMinistry,
    selectedMinistriesLabel,
    // watched
    selectedColor,
    recurring,
    recurrenceType,
    recurrenceSlots,
    selectedMinistryIds,
  } = useEventForm({ onOpenChange })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0 border-gray-100 border-b px-6 pt-6 pb-4">
            <DialogTitle className="font-bold text-gray-900 text-xl">
              Novo Evento
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Preencha os dados do novo evento
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Name */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="ev-name">Nome do evento *</FieldLabel>
                <Input
                  id="ev-name"
                  placeholder="Ex.: Culto Dominical"
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FieldError errors={errors.name ? [errors.name] : []} />
              </Field>

              {/* Description */}
              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="ev-desc">Descrição</FieldLabel>
                <Textarea
                  id="ev-desc"
                  placeholder="Descreva o evento..."
                  rows={2}
                  {...register('description')}
                />
                <FieldError
                  errors={errors.description ? [errors.description] : []}
                />
              </Field>

              {/* Type */}
              <Controller
                name="type_id"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.type_id}>
                    <div className="flex items-center justify-between">
                      <FieldLabel>Tipo *</FieldLabel>
                      <button
                        type="button"
                        onClick={() => setTypeManagerOpen(true)}
                        className="flex items-center gap-1 text-blue-600 text-xs hover:underline"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        Gerenciar tipos
                      </button>
                    </div>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      itemToStringLabel={typeItemLabel}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={errors.type_id ? [errors.type_id] : []}
                    />
                  </Field>
                )}
              />

              {/* Ministries */}
              <EventMinistryPicker
                selectedIds={selectedMinistryIds ?? []}
                label={selectedMinistriesLabel}
                open={ministryPopoverOpen}
                onOpenChange={setMinistryPopoverOpen}
                onToggle={toggleMinistry}
                error={
                  errors.ministry_ids as
                    | import('react-hook-form').FieldError
                    | undefined
                }
              />

              {/* Icon */}
              <EventIconPicker
                control={control}
                selectedColor={selectedColor}
                error={errors.icon}
              />

              {/* Color */}
              <EventColorPicker control={control} error={errors.color} />

              {/* Recurrence + Date/Time */}
              <EventRecurrenceSection
                register={register}
                control={control}
                setValue={setValue}
                errors={errors}
                recurring={recurring}
                recurrenceType={recurrenceType ?? 'weekly'}
                recurrenceSlots={recurrenceSlots}
                slotDay={slotDay}
                setSlotDay={setSlotDay}
                slotTime={slotTime}
                setSlotTime={setSlotTime}
                addSlot={addSlot}
                removeSlot={removeSlot}
                dayOptions={dayOptions}
              />

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
                {isPending ? 'Criando...' : 'Criar Evento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <EventTypeManager
        open={typeManagerOpen}
        onOpenChange={setTypeManagerOpen}
        types={eventTypes}
        onAdd={handleAddType}
        onEdit={handleEditType}
        onDelete={handleDeleteType}
      />
    </>
  )
}
