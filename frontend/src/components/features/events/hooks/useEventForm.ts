import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { MONTH_DAYS, WEEK_DAYS } from '@/constants/days'
import { useCreateEvent } from '@/hooks/mutations/useCreateEvent'
import type { EventIconName } from '@/lib/iconMap'
import { mockEventTypes, mockMinistries } from '@/lib/mocks'
import { type EventFormData, eventSchema } from '@/schemas/event'
import type { EventType, RecurrenceSlot } from '@/types/event'

const activeMinistries = mockMinistries.filter((m) => !m.deleted_at)

interface UseEventFormOptions {
  onOpenChange: (open: boolean) => void
}

export function useEventForm({ onOpenChange }: UseEventFormOptions) {
  const { mutate, isPending } = useCreateEvent()

  const [eventTypes, setEventTypes] = useState<EventType[]>(mockEventTypes)
  const [typeManagerOpen, setTypeManagerOpen] = useState(false)
  const [ministryPopoverOpen, setMinistryPopoverOpen] = useState(false)
  const [slotDay, setSlotDay] = useState('Domingo')
  const [slotTime, setSlotTime] = useState('09:00')

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      type_id: '',
      icon: 'Calendar',
      color: '#8B5CF6',
      ministry_ids: [],
      recurring: false,
      recurrence_type: 'weekly',
      date: '',
      time: '',
      recurrence_slots: [],
    },
  })

  const { watch, setValue, reset } = form

  const selectedColor = watch('color')
  const recurring = watch('recurring')
  const recurrenceType = watch('recurrence_type')
  const recurrenceSlots = (watch('recurrence_slots') ?? []) as RecurrenceSlot[]
  const selectedMinistryIds = watch('ministry_ids')

  // ─── Event type handlers ─────────────────────────────────────────────────────

  function handleAddType(label: string) {
    const newType: EventType = {
      id: `etype-${Date.now()}`,
      church_id: 'church-1',
      label,
      is_default: false,
      created_at: new Date().toISOString(),
    }
    setEventTypes((prev) => [...prev, newType])
  }

  function handleEditType(id: string, label: string) {
    setEventTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, label } : t)),
    )
  }

  function handleDeleteType(id: string) {
    setEventTypes((prev) => prev.filter((t) => t.id !== id))
    if (watch('type_id') === id) setValue('type_id', '')
  }

  // ─── Recurrence slot handlers ─────────────────────────────────────────────

  function addSlot() {
    setValue(
      'recurrence_slots',
      [...recurrenceSlots, { day: slotDay, time: slotTime }],
      { shouldValidate: true },
    )
    setSlotTime('09:00')
  }

  function removeSlot(index: number) {
    setValue(
      'recurrence_slots',
      recurrenceSlots.filter((_, i) => i !== index),
      { shouldValidate: true },
    )
  }

  // ─── Ministry toggle ─────────────────────────────────────────────────────

  function toggleMinistry(id: string) {
    const current = selectedMinistryIds ?? []
    setValue(
      'ministry_ids',
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
      { shouldValidate: true },
    )
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  function onSubmit(data: EventFormData) {
    mutate(
      {
        name: data.name,
        description: data.description,
        type_id: data.type_id,
        icon: data.icon as EventIconName,
        color: data.color,
        ministry_ids: data.ministry_ids,
        recurring: data.recurring,
        recurrence_type: data.recurring ? data.recurrence_type : undefined,
        date: data.recurring ? undefined : data.date,
        time: data.recurring ? undefined : data.time,
        recurrence_slots: data.recurring
          ? (data.recurrence_slots as RecurrenceSlot[])
          : [],
        church_id: 'church-1',
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          handleReset()
        },
      },
    )
  }

  function handleReset() {
    reset()
    setSlotDay('Domingo')
    setSlotTime('09:00')
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) handleReset()
    onOpenChange(isOpen)
  }

  // ─── Derived helpers ─────────────────────────────────────────────────────

  const typeItemLabel = (id: string) =>
    eventTypes.find((t) => t.id === id)?.label ?? id

  const selectedMinistriesLabel = selectedMinistryIds?.length
    ? selectedMinistryIds.length === 1
      ? (activeMinistries.find((m) => m.id === selectedMinistryIds[0])?.name ??
        '1 ministério')
      : `${selectedMinistryIds.length} ministérios`
    : 'Selecione ministérios'

  const dayOptions =
    recurrenceType === 'monthly' ? MONTH_DAYS.map(String) : [...WEEK_DAYS]

  return {
    form,
    isPending,
    onSubmit,
    handleOpenChange,
    // type state
    eventTypes,
    typeManagerOpen,
    setTypeManagerOpen,
    handleAddType,
    handleEditType,
    handleDeleteType,
    typeItemLabel,
    // recurrence state
    slotDay,
    setSlotDay,
    slotTime,
    setSlotTime,
    addSlot,
    removeSlot,
    dayOptions,
    // ministry state
    ministryPopoverOpen,
    setMinistryPopoverOpen,
    toggleMinistry,
    selectedMinistriesLabel,
    // watched values
    selectedColor,
    recurring,
    recurrenceType,
    recurrenceSlots,
    selectedMinistryIds,
  }
}
