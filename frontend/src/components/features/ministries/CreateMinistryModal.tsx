'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

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
import { PRESET_COLORS } from '@/constants/colors'
import { useCreateMinistry } from '@/hooks/mutations/useCreateMinistry'
import { getMinistryIcon, MINISTRY_ICON_NAMES } from '@/lib/iconMap'
import { mockUsers } from '@/lib/mocks'
import { cn } from '@/lib/utils'
import { type MinistryFormData, ministrySchema } from '@/schemas/ministry'

interface CreateMinistryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMinistryModal({
  open,
  onOpenChange,
}: CreateMinistryModalProps) {
  const { mutate, isPending } = useCreateMinistry()

  const leaders = mockUsers.filter((u) =>
    ['leader', 'pastor', 'elder', 'deacon'].includes(u.role),
  )

  const leaderItemLabel = useMemo(() => {
    const map = Object.fromEntries(leaders.map((u) => [u.id, u.name]))
    return (id: string) => map[id] ?? id
  }, [leaders])

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

  const selectedColor = watch('color')
  const colorInputRef = useRef<HTMLInputElement>(null)

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
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-gray-100 border-b px-6 pt-6 pb-4">
          <DialogTitle className="font-bold text-gray-900 text-xl">
            Novo Ministério
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Preencha os dados do novo ministério
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
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
              <FieldError
                errors={errors.description ? [errors.description] : []}
              />
            </Field>

            {/* Leader */}
            <Controller
              name="leader_id"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.leader_id}>
                  <FieldLabel>Líder responsável *</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    itemToStringLabel={leaderItemLabel}
                  >
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
                  <FieldError
                    errors={errors.leader_id ? [errors.leader_id] : []}
                  />
                </Field>
              )}
            />

            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.icon}>
                  <FieldLabel>Ícone</FieldLabel>
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {MINISTRY_ICON_NAMES.map((iconName) => {
                      const Icon = getMinistryIcon(iconName)
                      const selected = field.value === iconName
                      return (
                        <button
                          key={iconName}
                          type="button"
                          title={iconName}
                          onClick={() => field.onChange(iconName)}
                          className="flex items-center justify-center rounded-lg border p-2.5 transition-colors hover:border-gray-300"
                          style={
                            selected
                              ? {
                                  backgroundColor: `${selectedColor}1f`,
                                  borderColor: selectedColor,
                                }
                              : undefined
                          }
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{
                              color: selected ? selectedColor : '#6B7280',
                            }}
                          />
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
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        title={c.label}
                        onClick={() => field.onChange(c.value)}
                        className={cn(
                          'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                          field.value === c.value
                            ? 'scale-110 border-gray-900'
                            : 'border-transparent',
                        )}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                    {/* Custom color picker */}
                    <label
                      title="Cor personalizada"
                      className={cn(
                        'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-transform hover:scale-110',
                        !PRESET_COLORS.some((c) => c.value === field.value) &&
                          field.value
                          ? 'scale-110 border-gray-900'
                          : 'border-gray-300 border-dashed',
                      )}
                      style={{
                        backgroundColor:
                          !PRESET_COLORS.some((c) => c.value === field.value) &&
                          field.value
                            ? field.value
                            : undefined,
                      }}
                    >
                      {(!field.value ||
                        PRESET_COLORS.some((c) => c.value === field.value)) && (
                        <Plus className="h-4 w-4 text-gray-400" />
                      )}
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={field.value || '#000000'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                </Field>
              )}
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
              {isPending ? 'Criando...' : 'Criar Ministério'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
