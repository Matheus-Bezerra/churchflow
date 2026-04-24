'use client'

import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useCreateSchedule } from '@/hooks/mutations/useCreateSchedule'
import { mockMinistries, mockUsers } from '@/lib/mocks'

const scheduleSchema = z
  .object({
    title: z.string().min(3, 'Título deve ter ao menos 3 caracteres'),
    ministry_id: z.string().min(1, 'Selecione um ministério'),
    volunteer_id: z.string().min(1, 'Selecione um voluntário'),
    date: z.string().min(1, 'Data obrigatória'),
    start_time: z.string().min(1, 'Horário de início obrigatório'),
    end_time: z.string().optional(),
    notes: z.string().max(300, 'Máximo de 300 caracteres').optional(),
  })
  .refine(
    (data) => {
      if (!data.end_time) return true
      return data.end_time > data.start_time
    },
    { message: 'Horário de término deve ser após o início', path: ['end_time'] },
  )

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface CreateScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateScheduleModal({ open, onOpenChange }: CreateScheduleModalProps) {
  const { mutate, isPending } = useCreateSchedule()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: '',
      ministry_id: '',
      volunteer_id: '',
      date: '',
      start_time: '',
      end_time: '',
      notes: '',
    },
  })

  const selectedMinistryId = useWatch({ control, name: 'ministry_id' })

  const volunteers = selectedMinistryId
    ? mockUsers.filter((u) => {
        const ministry = mockMinistries.find((m) => m.id === selectedMinistryId)
        return ministry ? u.id === ministry.leader_id || u.role !== 'pastor' : true
      })
    : mockUsers

  function onSubmit(data: ScheduleFormData) {
    mutate(
      {
        title: data.title,
        ministry_id: data.ministry_id,
        volunteer_id: data.volunteer_id,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        notes: data.notes,
        church_id: 'church-1',
        status: 'pending',
        decline_reason: null,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      },
    )
  }

  function handleOpenChange(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 flex flex-col overflow-hidden max-h-[90dvh]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">Nova Escala</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Crie uma nova escala de serviço
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Title */}
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="sched-title">Título *</FieldLabel>
              <Input
                id="sched-title"
                placeholder="Ex.: Culto de Domingo — Louvor"
                aria-invalid={!!errors.title}
                {...register('title')}
              />
              <FieldError errors={errors.title ? [errors.title] : []} />
            </Field>

            {/* Ministry */}
            <Controller
              name="ministry_id"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.ministry_id}>
                  <FieldLabel>Ministério *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o ministério" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMinistries.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors.ministry_id ? [errors.ministry_id] : []} />
                </Field>
              )}
            />

            {/* Volunteer */}
            <Controller
              name="volunteer_id"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.volunteer_id}>
                  <FieldLabel>Voluntário *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o voluntário" />
                    </SelectTrigger>
                    <SelectContent>
                      {volunteers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors.volunteer_id ? [errors.volunteer_id] : []} />
                </Field>
              )}
            />

            {/* Date */}
            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="sched-date">Data *</FieldLabel>
              <Input
                id="sched-date"
                type="date"
                aria-invalid={!!errors.date}
                {...register('date')}
              />
              <FieldError errors={errors.date ? [errors.date] : []} />
            </Field>

            {/* Start time + End time */}
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.start_time}>
                <FieldLabel htmlFor="sched-start">Início *</FieldLabel>
                <Input
                  id="sched-start"
                  type="time"
                  aria-invalid={!!errors.start_time}
                  {...register('start_time')}
                />
                <FieldError errors={errors.start_time ? [errors.start_time] : []} />
              </Field>
              <Field data-invalid={!!errors.end_time}>
                <FieldLabel htmlFor="sched-end">Término</FieldLabel>
                <Input id="sched-end" type="time" {...register('end_time')} />
                <FieldError errors={errors.end_time ? [errors.end_time] : []} />
              </Field>
            </div>

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
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? 'Salvando...' : 'Criar Escala'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
