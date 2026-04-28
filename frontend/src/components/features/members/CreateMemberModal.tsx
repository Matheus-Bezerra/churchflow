'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp, Plus, Settings2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  Controller,
  type FieldError as RhfFieldError,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'

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

function getUnavailabilityItemError(
  err: unknown,
  key: string,
): RhfFieldError | undefined {
  if (!err || typeof err !== 'object') return undefined
  const rec = err as Record<string, unknown>
  const val = rec[key]
  if (!val || typeof val !== 'object') return undefined
  const vrec = val as Record<string, unknown>
  if (!('message' in vrec)) return undefined
  return val as RhfFieldError
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
      phone_is_whatsapp: false,
      birth_date: '',
      status: 'active',
      role: 'member',
      avatar_url: undefined,
      avatar_color: '#8B5CF6',
      baptized: false,
      baptism_date: '',
      address: '',
      city: '',
      state: '',
      is_volunteer: false,
      ministry_ids: [],
      cell_id: '',
      unavailabilities: [],
    },
  })

  const memberName = useWatch({ control, name: 'name' })
  const isVolunteer = Boolean(useWatch({ control, name: 'is_volunteer' }))
  const isBaptized = Boolean(useWatch({ control, name: 'baptized' }))

  const {
    fields: unavailabilityFields,
    append: appendUnavailability,
    remove: removeUnavailability,
  } = useFieldArray({
    control,
    name: 'unavailabilities',
  })

  function onSubmit(data: MemberFormData) {
    mutate(
      {
        name: data.name,
        email: data.email ?? '',
        phone: data.phone ?? '',
        phone_is_whatsapp: Boolean(data.phone_is_whatsapp),
        birth_date: data.birth_date ?? '',
        status: data.status,
        role: data.role,
        avatar_url: data.avatar_url,
        avatar_color: data.avatar_color,
        church_id: 'church-1',
        baptized: Boolean(data.baptized),
        baptism_date:
          data.baptized && data.baptism_date ? data.baptism_date : null,
        address: data.address ?? '',
        city: data.city ?? '',
        state: data.state ?? '',
        is_volunteer: Boolean(data.is_volunteer),
        ministry_ids: data.is_volunteer ? (data.ministry_ids ?? []) : [],
        cell_id: data.cell_id ? data.cell_id : null,
        joined_at: new Date().toISOString(),
      },
      {
        onSuccess: (newMember) => {
          ;(data.unavailabilities ?? []).forEach((u, idx) => {
            if (u.type === 'period') {
              mockUnavailabilities.push({
                id: `unavail-${Date.now()}-${idx}`,
                user_id: newMember.id,
                type: 'period',
                start_date: u.start_date,
                end_date: u.end_date,
                reason: u.reason ?? undefined,
                created_at: new Date().toISOString(),
              })
              return
            }

            mockUnavailabilities.push({
              id: `unavail-${Date.now()}-${idx}`,
              user_id: newMember.id,
              type: 'recurring',
              day_of_week: u.day_of_week,
              start_time: u.start_time,
              end_time: u.end_time,
              reason: u.reason ?? undefined,
              created_at: new Date().toISOString(),
            })
          })
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
              <div className="flex justify-center">
                <Controller
                  name="avatar_url"
                  control={control}
                  render={({ field }) => (
                    <Controller
                      name="avatar_color"
                      control={control}
                      render={({ field: colorField }) => (
                        <AvatarPicker
                          value={field.value}
                          onChange={field.onChange}
                          memberName={memberName}
                          avatarColor={colorField.value}
                          onAvatarColorChange={colorField.onChange}
                        />
                      )}
                    />
                  )}
                />
              </div>

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
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
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
                  <Controller
                    name="phone_is_whatsapp"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(field.value)}
                        className="mt-3 flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left hover:bg-gray-50"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <span className="text-gray-700 text-xs">
                          Este numero e WhatsApp
                        </span>
                        <span
                          className={cn(
                            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                            field.value ? 'bg-emerald-600' : 'bg-gray-200',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform',
                              field.value ? 'translate-x-4' : 'translate-x-0',
                            )}
                          />
                        </span>
                      </button>
                    )}
                  />
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
                          <SelectItem value="active">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Ativo
                            </div>
                          </SelectItem>
                          <SelectItem value="visitor">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              Visitante
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-gray-400" />
                              Inativo
                            </div>
                          </SelectItem>
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

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Controller
                  name="baptized"
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
                          Batizado
                        </p>
                        <p className="text-gray-500 text-xs">
                          Marque se o membro ja foi batizado
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

                {isBaptized && (
                  <div className="space-y-3 border-gray-100 border-t px-4 py-4">
                    <Field data-invalid={!!errors.baptism_date}>
                      <FieldLabel htmlFor="baptism_date">
                        Data do batismo *
                      </FieldLabel>
                      <Input
                        id="baptism_date"
                        type="date"
                        {...register('baptism_date')}
                      />
                      <FieldError
                        errors={errors.baptism_date ? [errors.baptism_date] : []}
                      />
                    </Field>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <Field data-invalid={!!errors.address}>
                  <FieldLabel htmlFor="address">Endereco</FieldLabel>
                  <Input
                    id="address"
                    placeholder="Rua, numero e complemento"
                    {...register('address')}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.city}>
                    <FieldLabel htmlFor="city">Cidade</FieldLabel>
                    <Input id="city" placeholder="Sua cidade" {...register('city')} />
                  </Field>
                  <Field data-invalid={!!errors.state}>
                    <FieldLabel htmlFor="state">Estado</FieldLabel>
                    <Input id="state" placeholder="UF" {...register('state')} />
                  </Field>
                </div>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() =>
                          appendUnavailability({
                            type: 'period',
                            start_date: '',
                            end_date: '',
                            reason: '',
                          })
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar período
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() =>
                          appendUnavailability({
                            type: 'recurring',
                            day_of_week: 'Domingo',
                            start_time: '09:00',
                            end_time: '10:00',
                            reason: '',
                          })
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Adicionar recorrente
                      </Button>
                    </div>

                    {unavailabilityFields.length === 0 ? (
                      <p className="text-gray-400 text-xs">
                        Nenhuma indisponibilidade cadastrada.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {unavailabilityFields.map((u, index) => {
                          const isPeriod = u.type === 'period'
                          const itemErrors = errors.unavailabilities?.[index] as unknown
                          return (
                            <div
                              key={u.id}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <p className="font-medium text-gray-800 text-sm">
                                  {isPeriod ? 'Período' : 'Recorrente'}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeUnavailability(index)}
                                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                  aria-label="Remover indisponibilidade"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {isPeriod ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  {(() => {
                                    const startErr = getUnavailabilityItemError(
                                      itemErrors,
                                      'start_date',
                                    )
                                    const endErr = getUnavailabilityItemError(
                                      itemErrors,
                                      'end_date',
                                    )
                                    return (
                                      <>
                                  <Field
                                    data-invalid={Boolean(startErr)}
                                  >
                                    <FieldLabel>Data inicial</FieldLabel>
                                    <Input
                                      type="date"
                                      {...register(
                                        `unavailabilities.${index}.start_date` as const,
                                      )}
                                    />
                                    <FieldError errors={startErr ? [startErr] : []} />
                                  </Field>
                                  <Field
                                    data-invalid={Boolean(endErr)}
                                  >
                                    <FieldLabel>Data final</FieldLabel>
                                    <Input
                                      type="date"
                                      {...register(
                                        `unavailabilities.${index}.end_date` as const,
                                      )}
                                    />
                                    <FieldError errors={endErr ? [endErr] : []} />
                                  </Field>
                                      </>
                                    )
                                  })()}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  {(() => {
                                    const weekdayErr = getUnavailabilityItemError(
                                      itemErrors,
                                      'day_of_week',
                                    )
                                    const startTimeErr = getUnavailabilityItemError(
                                      itemErrors,
                                      'start_time',
                                    )
                                    const endTimeErr = getUnavailabilityItemError(
                                      itemErrors,
                                      'end_time',
                                    )
                                    return (
                                      <>
                                  <Controller
                                    name={
                                      `unavailabilities.${index}.day_of_week` as const
                                    }
                                    control={control}
                                    render={({ field }) => (
                                      <Field
                                        data-invalid={Boolean(weekdayErr)}
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
                                          errors={weekdayErr ? [weekdayErr] : []}
                                        />
                                      </Field>
                                    )}
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Field
                                      data-invalid={Boolean(startTimeErr)}
                                    >
                                      <FieldLabel>Início</FieldLabel>
                                      <Input
                                        type="time"
                                        {...register(
                                          `unavailabilities.${index}.start_time` as const,
                                        )}
                                      />
                                      <FieldError
                                        errors={startTimeErr ? [startTimeErr] : []}
                                      />
                                    </Field>
                                    <Field
                                      data-invalid={Boolean(endTimeErr)}
                                    >
                                      <FieldLabel>Fim</FieldLabel>
                                      <Input
                                        type="time"
                                        {...register(
                                          `unavailabilities.${index}.end_time` as const,
                                        )}
                                      />
                                      <FieldError
                                        errors={endTimeErr ? [endTimeErr] : []}
                                      />
                                    </Field>
                                  </div>
                                      </>
                                    )
                                  })()}
                                </div>
                              )}

                              <div className="mt-3">
                                <FieldLabel>Motivo (opcional)</FieldLabel>
                                <Textarea
                                  rows={2}
                                  placeholder="Ex.: Viagem, férias, trabalho..."
                                  {...register(
                                    `unavailabilities.${index}.reason` as const,
                                  )}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
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
