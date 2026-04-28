import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { MONTH_DAYS, WEEK_DAYS } from '@/constants/days'
import { useCreateEvent } from '@/hooks/mutations/useCreateEvent'
import type { EventIconName } from '@/lib/iconMap'
import { mockEventTypes } from '@/lib/mocks'
import { type EventFormData, eventSchema } from '@/schemas/event'
import type { EventType, MinistryRequirement, RecurrenceSlot } from '@/types/event'

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
      ministry_requirements: [],
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
  const ministryRequirements = (watch('ministry_requirements') ?? []) as MinistryRequirement[]

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

  // ─── Ministry requirement handlers ───────────────────────────────────────

  function toggleMinistry(id: string) {
    const exists = ministryRequirements.find((r) => r.ministry_id === id)
    setValue(
      'ministry_requirements',
      exists
        ? ministryRequirements.filter((r) => r.ministry_id !== id)
        : [...ministryRequirements, { ministry_id: id, required_count: 1 }],
      { shouldValidate: true },
    )
  }

  function updateMinistryCount(ministryId: string, count: number) {
    setValue(
      'ministry_requirements',
      ministryRequirements.map((r) =>
        r.ministry_id === ministryId ? { ...r, required_count: count } : r,
      ),
      { shouldValidate: true },
    )
  }

  // ─── Submit ──────────────────────────────────────────────────────────────

  function onSubmit(data: EventFormData) {
    const ministry_ids = data.ministry_requirements.map((r) => r.ministry_id)

    mutate(
      {
        name: data.name,
        description: data.description,
        type_id: data.type_id,
        icon: data.icon as EventIconName,
        color: data.color,
        ministry_ids,
        ministry_requirements: data.ministry_requirements,
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
    updateMinistryCount,
    ministryRequirements,
    // watched values
    selectedColor,
    recurring,
    recurrenceType,
    recurrenceSlots,
  }
}
