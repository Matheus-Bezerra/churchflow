'use client'

import { Controller, useForm } from 'react-hook-form'
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
import { useCreateMinistry } from '@/hooks/mutations/useCreateMinistry'
import { mockUsers } from '@/lib/mocks'
import { MINISTRY_ICON_NAMES, getMinistryIcon } from '@/lib/iconMap'
import { cn } from '@/lib/utils'

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const COLORS = [
  { label: 'Violeta', value: '#8B5CF6' },
  { label: 'Azul', value: '#0EA5E9' },
  { label: 'Verde', value: '#10B981' },
  { label: 'Laranja', value: '#F97316' },
  { label: 'Âmbar', value: '#F59E0B' },
  { label: 'Rosa', value: '#EC4899' },
  { label: 'Vermelho', value: '#EF4444' },
  { label: 'Cyan', value: '#06B6D4' },
]

const ministrySchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  description: z.string().max(200, 'Máximo de 200 caracteres').optional(),
  leader_id: z.string().min(1, 'Selecione um líder responsável'),
  meeting_day: z.string().min(1, 'Selecione o dia'),
  meeting_time: z.string().min(1, 'Informe o horário'),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().min(1, 'Selecione uma cor'),
})

type MinistryFormData = z.infer<typeof ministrySchema>

interface CreateMinistryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMinistryModal({ open, onOpenChange }: CreateMinistryModalProps) {
  const { mutate, isPending } = useCreateMinistry()

  const leaders = mockUsers.filter((u) =>
    ['leader', 'pastor', 'elder', 'deacon'].includes(u.role),
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<MinistryFormData>({
    resolver: zodResolver(ministrySchema),
    defaultValues: {
      name: '',
      description: '',
      leader_id: '',
      meeting_day: 'Domingo',
      meeting_time: '09:00',
      icon: 'Music',
      color: '#8B5CF6',
    },
  })

  const selectedIcon = watch('icon')
  const selectedColor = watch('color')

  function onSubmit(data: MinistryFormData) {
    mutate(
      {
        name: data.name,
        description: data.description ?? '',
        leader_id: data.leader_id,
        meeting_day: data.meeting_day,
        meeting_time: data.meeting_time,
        icon: data.icon,
        color: data.color,
        church_id: 'church-1',
        status: 'active',
        member_count: 0,
        max_members: 20,
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
      <DialogContent className="max-w-xl p-0 gap-0 flex flex-col overflow-hidden max-h-[90dvh]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">Novo Ministério</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Preencha os dados do novo ministério
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="min-name">Nome do Ministério *</FieldLabel>
            <Input
              id="min-name"
              placeholder="Ex.: Louvor e Adoração"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError errors={errors.name ? [errors.name] : []} />
          </Field>

          {/* Description */}
          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="min-desc">Descrição</FieldLabel>
            <Textarea
              id="min-desc"
              placeholder="Descreva o objetivo do ministério..."
              rows={3}
              {...register('description')}
            />
            <FieldError errors={errors.description ? [errors.description] : []} />
          </Field>

          {/* Leader */}
          <Controller
            name="leader_id"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.leader_id}>
                <FieldLabel>Líder responsável *</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o líder" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaders.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={errors.leader_id ? [errors.leader_id] : []} />
              </Field>
            )}
          />

          {/* Day + Time */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="meeting_day"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.meeting_day}>
                  <FieldLabel>Dia de reunião</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="min-time">Horário</FieldLabel>
              <Input id="min-time" type="time" {...register('meeting_time')} />
            </Field>
          </div>

          {/* Icon visual grid */}
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.icon}>
                <FieldLabel>Ícone</FieldLabel>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {MINISTRY_ICON_NAMES.map((iconName) => {
                    const Icon = getMinistryIcon(iconName)
                    const selected = field.value === iconName
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => field.onChange(iconName)}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] transition-colors',
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-500',
                        )}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: selected ? selectedColor : undefined }}
                        />
                        <span className="truncate w-full text-center">{iconName}</span>
                      </button>
                    )
                  })}
                </div>
              </Field>
            )}
          />

          {/* Color */}
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.color}>
                <FieldLabel>Cor</FieldLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => field.onChange(c.value)}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                        field.value === c.value
                          ? 'border-gray-900 scale-110'
                          : 'border-transparent',
                      )}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </Field>
            )}
          />

        </div>

          <DialogFooter className="mx-0 mb-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? 'Criando...' : 'Criar Ministério'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
