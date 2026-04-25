'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

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
import { WEEK_DAYS } from '@/constants/days'
import { useCreateMember } from '@/hooks/mutations/useCreateMember'
import { useCells } from '@/hooks/queries/useCells'
import { useMemberFunctions } from '@/hooks/queries/useMemberFunctions'
import { mockUnavailabilities } from '@/lib/mocks'
import { cn } from '@/lib/utils'
import { type MemberFormData, memberSchema } from '@/schemas/member'

import { AvatarPicker } from './AvatarPicker'
import { MemberFunctionManager } from './MemberFunctionManager'
import { MemberMinistryPicker } from './MemberMinistryPicker'

const MEMBER_STATUS_LABELS: Record<MemberFormData['status'], string> = {
  active: 'Ativo',
  visitor: 'Visitante',
  inactive: 'Inativo',
}

interface CreateMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMemberModal({
  open,
  onOpenChange,
}: CreateMemberModalProps) {
  const { mutate, isPending } = useCreateMember()
  const [unavailabilityOpen, setUnavailabilityOpen] = useState(false)
  const [functionManagerOpen, setFunctionManagerOpen] = useState(false)
  const [ministryPickerOpen, setMinistryPickerOpen] = useState(false)

  const { data: memberFunctions = [] } = useMemberFunctions()
  const memberFunctionLabel = (id: string) =>
    memberFunctions.find((f) => f.id === id)?.label ?? id

  const { data: cells = [] } = useCells()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birth_date: '',
      status: 'active',
      role: 'member',
      avatar_url: undefined,
      is_volunteer: false,
      ministry_ids: [],
      cell_id: '',
      unavailability_mode: 'none',
      unavailability_start: '',
      unavailability_end: '',
      unavailability_weekday: '',
      unavailability_start_time: '',
      unavailability_end_time: '',
      unavailability_reason: '',
    },
  })

  const unavailabilityMode = useWatch({ control, name: 'unavailability_mode' })
  const isVolunteer = Boolean(useWatch({ control, name: 'is_volunteer' }))

  function onSubmit(data: MemberFormData) {
    mutate(
      {
        name: data.name,
        email: data.email,
        phone: data.phone ?? '',
        birth_date: data.birth_date ?? '',
        status: data.status,
        role: data.role,
        avatar_url: data.avatar_url,
        church_id: 'church-1',
        baptized: false,
        baptism_date: null,
        is_volunteer: Boolean(data.is_volunteer),
        ministry_ids: data.is_volunteer ? (data.ministry_ids ?? []) : [],
        cell_id: data.cell_id ? data.cell_id : null,
        joined_at: new Date().toISOString(),
      },
      {
        onSuccess: (newMember) => {
          // Save unavailability locally if provided
          if (
            data.unavailability_mode === 'period' &&
            data.unavailability_start &&
            data.unavailability_end
          ) {
            mockUnavailabilities.push({
              id: `unavail-${Date.now()}`,
              user_id: newMember.id,
              type: 'period',
              start_date: data.unavailability_start,
              end_date: data.unavailability_end,
              reason: data.unavailability_reason ?? undefined,
              created_at: new Date().toISOString(),
            })
          }
          if (
            data.unavailability_mode === 'recurring' &&
            data.unavailability_weekday &&
            data.unavailability_start_time &&
            data.unavailability_end_time
          ) {
            mockUnavailabilities.push({
              id: `unavail-${Date.now()}`,
              user_id: newMember.id,
              type: 'recurring',
              day_of_week: data.unavailability_weekday,
              start_time: data.unavailability_start_time,
              end_time: data.unavailability_end_time,
              reason: data.unavailability_reason ?? undefined,
              created_at: new Date().toISOString(),
            })
          }
          onOpenChange(false)
          reset()
          setUnavailabilityOpen(false)
          setMinistryPickerOpen(false)
        },
      },
    )
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      reset()
      setUnavailabilityOpen(false)
    }
    onOpenChange(isOpen)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0 border-gray-100 border-b px-6 pt-6 pb-4">
            <DialogTitle className="font-bold text-gray-900 text-xl">
              Novo Membro
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Preencha os dados do novo membro
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Avatar Picker */}
              <Controller
                name="avatar_url"
                control={control}
                render={({ field }) => (
                  <AvatarPicker value={field.value} onChange={field.onChange} />
                )}
              />

              {/* Name */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Nome completo *</FieldLabel>
                <Input
                  id="name"
                  placeholder="Nome do membro"
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FieldError errors={errors.name ? [errors.name] : []} />
              </Field>

              {/* Email */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">E-mail *</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <FieldError errors={errors.email ? [errors.email] : []} />
              </Field>

              {/* Phone + Birth date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    aria-invalid={!!errors.phone}
                    {...register('phone')}
                  />
                  <FieldError errors={errors.phone ? [errors.phone] : []} />
                </Field>
                <Field data-invalid={!!errors.birth_date}>
                  <FieldLabel htmlFor="birth_date">Nascimento</FieldLabel>
                  <Input
                    id="birth_date"
                    type="date"
                    {...register('birth_date')}
                  />
                </Field>
              </div>

              {/* Status + Role */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Field data-invalid={!!errors.status}>
                      <FieldLabel>Status</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        itemToStringLabel={(v) =>
                          MEMBER_STATUS_LABELS[v as MemberFormData['status']] ??
                          String(v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="visitor">Visitante</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Field data-invalid={!!errors.role}>
                      <div className="flex items-center justify-between">
                        <FieldLabel>Função</FieldLabel>
                        <button
                          type="button"
                          onClick={() => setFunctionManagerOpen(true)}
                          className="flex items-center gap-1 text-blue-600 text-xs hover:underline"
                        >
                          <Settings2 className="h-3.5 w-3.5" />
                          Gerenciar funções
                        </button>
                      </div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        itemToStringLabel={(v) =>
                          memberFunctionLabel(String(v))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          {memberFunctions.map((fn) => (
                            <SelectItem key={fn.id} value={fn.id}>
                              {fn.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>

            {/* Volunteer + ministries */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Controller
                name="is_volunteer"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(field.value)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                    onClick={() => field.onChange(!field.value)}
                  >
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        Voluntário
                      </p>
                      <p className="text-gray-500 text-xs">
                        Marque se este membro pode servir em ministérios
                      </p>
                    </div>
                    <span
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        field.value ? 'bg-blue-600' : 'bg-gray-200',
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                          field.value ? 'translate-x-5' : 'translate-x-0',
                        )}
                      />
                    </span>
                  </button>
                )}
              />

              {isVolunteer && (
                <div className="space-y-4 border-gray-100 border-t px-4 py-4">
                  <Controller
                    name="ministry_ids"
                    control={control}
                    render={({ field }) => {
                      const selected = (field.value ?? []) as string[]
                      const label =
                        selected.length > 0
                          ? `${selected.length} ministério(s) selecionado(s)`
                          : 'Selecione os ministérios'

                      return (
                        <MemberMinistryPicker
                          selectedIds={selected}
                          label={label}
                          open={ministryPickerOpen}
                          onOpenChange={setMinistryPickerOpen}
                          onToggle={(id) => {
                            const next = selected.includes(id)
                              ? selected.filter((x) => x !== id)
                              : [...selected, id]
                            field.onChange(next)
                          }}
                          error={
                            errors.ministry_ids as
                              | import('react-hook-form').FieldError
                              | undefined
                          }
                        />
                      )
                    }}
                  />
                </div>
              )}
            </div>

              {/* Unavailability collapsible section */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setUnavailabilityOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Indisponibilidade
                    </p>
                    <p className="text-gray-500 text-xs">
                      Período em que o membro não poderá servir
                    </p>
                  </div>
                  {unavailabilityOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  )}
                </button>

                {unavailabilityOpen && (
                  <div className="space-y-4 border-gray-100 border-t px-4 py-4">
                    <Controller
                      name="unavailability_mode"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <FieldLabel>Tipo de indisponibilidade</FieldLabel>
                          <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-1">
                            {[
                              { id: 'none', label: 'Nenhum' },
                              { id: 'period', label: 'Período' },
                              { id: 'recurring', label: 'Recorrente' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => field.onChange(opt.id)}
                                className={
                                  field.value === opt.id
                                    ? 'rounded-md bg-white px-3 py-2 font-medium text-blue-700 text-xs shadow-sm'
                                    : 'rounded-md px-3 py-2 font-medium text-gray-500 text-xs hover:bg-white/60'
                                }
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    />

                    {unavailabilityMode === 'period' && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field data-invalid={!!errors.unavailability_start}>
                          <FieldLabel htmlFor="unavail-start">
                            Data inicial
                          </FieldLabel>
                          <Input
                            id="unavail-start"
                            type="date"
                            {...register('unavailability_start')}
                          />
                          <FieldError
                            errors={
                              errors.unavailability_start
                                ? [errors.unavailability_start]
                                : []
                            }
                          />
                        </Field>
                        <Field data-invalid={!!errors.unavailability_end}>
                          <FieldLabel htmlFor="unavail-end">
                            Data final
                          </FieldLabel>
                          <Input
                            id="unavail-end"
                            type="date"
                            {...register('unavailability_end')}
                          />
                          <FieldError
                            errors={
                              errors.unavailability_end
                                ? [errors.unavailability_end]
                                : []
                            }
                          />
                        </Field>
                      </div>
                    )}

                    {unavailabilityMode === 'recurring' && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                          name="unavailability_weekday"
                          control={control}
                          render={({ field }) => (
                            <Field
                              data-invalid={!!errors.unavailability_weekday}
                            >
                              <FieldLabel>Dia da semana</FieldLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                itemToStringLabel={(v) => String(v)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione o dia" />
                                </SelectTrigger>
                                <SelectContent>
                                  {WEEK_DAYS.map((d) => (
                                    <SelectItem key={d} value={d}>
                                      {d}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FieldError
                                errors={
                                  errors.unavailability_weekday
                                    ? [errors.unavailability_weekday]
                                    : []
                                }
                              />
                            </Field>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            data-invalid={!!errors.unavailability_start_time}
                          >
                            <FieldLabel htmlFor="unavail-start-time">
                              Início
                            </FieldLabel>
                            <Input
                              id="unavail-start-time"
                              type="time"
                              {...register('unavailability_start_time')}
                            />
                            <FieldError
                              errors={
                                errors.unavailability_start_time
                                  ? [errors.unavailability_start_time]
                                  : []
                              }
                            />
                          </Field>
                          <Field
                            data-invalid={!!errors.unavailability_end_time}
                          >
                            <FieldLabel htmlFor="unavail-end-time">
                              Fim
                            </FieldLabel>
                            <Input
                              id="unavail-end-time"
                              type="time"
                              {...register('unavailability_end_time')}
                            />
                            <FieldError
                              errors={
                                errors.unavailability_end_time
                                  ? [errors.unavailability_end_time]
                                  : []
                              }
                            />
                          </Field>
                        </div>
                      </div>
                    )}

                    <Field>
                      <FieldLabel htmlFor="unavail-reason">
                        Motivo (opcional)
                      </FieldLabel>
                      <Textarea
                        id="unavail-reason"
                        placeholder="Ex.: Viagem, férias, compromisso pessoal..."
                        rows={2}
                        {...register('unavailability_reason')}
                      />
                    </Field>
                  </div>
                )}
              </div>

            {/* Cell (optional) */}
            <Controller
              name="cell_id"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Célula (opcional)</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    itemToStringLabel={(v) => {
                      if (!v) return 'Sem célula'
                      return cells.find((c) => c.id === v)?.name ?? String(v)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma célula" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem célula</SelectItem>
                      {cells.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {isPending ? 'Salvando...' : 'Cadastrar Membro'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <MemberFunctionManager
        open={functionManagerOpen}
        onOpenChange={setFunctionManagerOpen}
        functions={memberFunctions}
      />
    </>
  )
}
