'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, Plus, Star, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

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
import { Textarea } from '@/components/ui/textarea'
import { PRESET_COLORS } from '@/constants/colors'
import { useCreateMinistry } from '@/hooks/mutations/useCreateMinistry'
import { getMinistryIcon, MINISTRY_ICON_NAMES } from '@/lib/iconMap'
import { mockUsers } from '@/lib/mocks'
import { cn, getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import { type MinistryFormData, ministrySchema } from '@/schemas/ministry'
import type { User } from '@/types/user'

interface CreateMinistryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Multi-select inline component ────────────────────────────────────────────

interface MultiSelectProps {
  options: User[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  badgeLabel?: string
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  badgeLabel,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () =>
      options.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  )

  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    )
  }

  function remove(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(value.filter((v) => v !== id))
  }

  const selected = options.filter((u) => value.includes(u.id))

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open && 'ring-2 ring-ring',
        )}
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          selected.map((u) => (
            <span
              key={u.id}
              className="flex items-center gap-1 rounded-full bg-muted py-0.5 pr-1.5 pl-1 text-foreground text-xs"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={u.avatar_url} />
                <AvatarFallback
                  className="text-[8px]"
                  style={getAvatarFallbackStyle(u.avatar_color)}
                >
                  {getInitials(u.name)}
                </AvatarFallback>
              </Avatar>
              {u.name.split(' ')[0]}
              {badgeLabel && (
                <span className="ml-0.5 text-[10px] text-muted-foreground">
                  · {badgeLabel}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => remove(u.id, e)}
                className="ml-0.5 rounded-full hover:text-foreground"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))
        )}
        <ChevronDown
          className={cn(
            'ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setOpen(false)
              setSearch('')
            }}
          />
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
            <div className="border-b p-2">
              <Input
                autoFocus
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <ul className="max-h-52 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <li className="py-4 text-center text-muted-foreground text-xs">
                  Nenhum resultado
                </li>
              ) : (
                filtered.map((u) => {
                  const checked = value.includes(u.id)
                  return (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => toggle(u.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent',
                          checked && 'bg-accent/50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                            checked
                          ? 'border-blue-600 bg-blue-600'
                            : 'border-input',
                          )}
                        >
                          {checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback
                            className="text-[10px]"
                            style={getAvatarFallbackStyle(u.avatar_color)}
                          >
                            {getInitials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-left">{u.name}</span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function CreateMinistryModal({
  open,
  onOpenChange,
}: CreateMinistryModalProps) {
  const { mutate, isPending } = useCreateMinistry()

  const leaders = useMemo(
    () =>
      mockUsers.filter((u) =>
        ['leader', 'pastor', 'elder', 'deacon'].includes(u.role),
      ),
    [],
  )

  const allMembers = useMemo(
    () => mockUsers.filter((u) => u.status !== 'inactive' && !u.deleted_at),
    [],
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
      leader_ids: [],
      primary_leader_id: undefined,
      volunteer_ids: [],
      max_members: 20,
      icon: 'Music',
      color: '#8B5CF6',
    },
  })

  const selectedColor = watch('color')
  const selectedLeaderIds = watch('leader_ids')
  const selectedPrimaryLeaderId = watch('primary_leader_id')
  const colorInputRef = useRef<HTMLInputElement>(null)

  const availableVolunteers = useMemo(
    () => allMembers.filter((u) => !selectedLeaderIds?.includes(u.id)),
    [allMembers, selectedLeaderIds],
  )

  function onSubmit(data: MinistryFormData) {
    const primaryLeaderId = data.primary_leader_id
    const normalizedPrimaryLeaderId =
      primaryLeaderId && data.leader_ids.includes(primaryLeaderId)
        ? primaryLeaderId
        : undefined

    mutate(
      {
        name: data.name,
        description: data.description ?? '',
        leader_id: normalizedPrimaryLeaderId ?? data.leader_ids[0],
        leader_ids: data.leader_ids,
        primary_leader_id: normalizedPrimaryLeaderId,
        volunteer_ids: data.volunteer_ids ?? [],
        icon: data.icon,
        color: data.color,
        church_id: 'church-1',
        status: 'active',
        member_count: 0,
        max_members: data.max_members,
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
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle className="font-bold text-foreground text-xl">
            Novo Ministério
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
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

            {/* Leaders (multi-select) */}
            <Controller
              name="leader_ids"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.leader_ids}>
                  <FieldLabel>Líderes responsáveis *</FieldLabel>
                  <MultiSelect
                    options={leaders}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecione um ou mais líderes"
                    badgeLabel="Líder"
                  />
                  <FieldError
                    errors={
                      errors.leader_ids
                        ? [
                            {
                              message:
                                (errors.leader_ids as { message?: string })
                                  .message ?? 'Selecione ao menos um líder',
                            },
                          ]
                        : []
                    }
                  />
                </Field>
              )}
            />

            {/* Primary leader (optional) */}
            <Controller
              name="primary_leader_id"
              control={control}
              render={({ field }) => {
                const selectedLeaders = leaders.filter((leader) =>
                  (selectedLeaderIds ?? []).includes(leader.id),
                )

                return (
                  <Field>
                    <FieldLabel>Líder principal (opcional)</FieldLabel>
                    {selectedLeaders.length === 0 ? (
                      <p className="text-muted-foreground text-xs">
                        Selecione ao menos um líder para definir o principal.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedLeaders.map((leader) => {
                          const isPrimary = field.value === leader.id
                          return (
                            <button
                              key={leader.id}
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  isPrimary ? undefined : leader.id,
                                )
                              }
                              className={cn(
                                'flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                                isPrimary
                                  ? 'border-amber-400 bg-amber-50'
                                  : 'border-input hover:bg-accent/50',
                              )}
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={leader.avatar_url} />
                                <AvatarFallback
                                  className="text-[10px]"
                                  style={getAvatarFallbackStyle(
                                    leader.avatar_color,
                                  )}
                                >
                                  {getInitials(leader.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="flex-1">{leader.name}</span>
                              <Star
                                className={cn(
                                  'h-4 w-4',
                                  isPrimary
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-muted-foreground',
                                )}
                              />
                            </button>
                          )
                        })}
                        {selectedPrimaryLeaderId &&
                          !selectedLeaders.some(
                            (leader) => leader.id === selectedPrimaryLeaderId,
                          ) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => field.onChange(undefined)}
                            >
                              Limpar líder principal
                            </Button>
                          )}
                      </div>
                    )}
                  </Field>
                )
              }}
            />

            {/* Volunteers (multi-select) */}
            <Controller
              name="volunteer_ids"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Voluntários</FieldLabel>
                  <MultiSelect
                    options={availableVolunteers}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Adicione voluntários ao ministério"
                  />
                </Field>
              )}
            />

            {/* Volunteer slots */}
            <Field data-invalid={!!errors.max_members}>
              <FieldLabel htmlFor="min-max-members">
                Quantidade de vagas de voluntários *
              </FieldLabel>
              <Input
                id="min-max-members"
                type="number"
                min={1}
                step={1}
                aria-invalid={!!errors.max_members}
                {...register('max_members', { valueAsNumber: true })}
              />
              <FieldError
                errors={errors.max_members ? [errors.max_members] : []}
              />
            </Field>

            {/* Icon */}
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
                          className="flex items-center justify-center rounded-lg border p-2.5 transition-colors hover:border-foreground/30"
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
                            className={cn('h-5 w-5', !selected && 'text-muted-foreground')}
                            style={selected ? { color: selectedColor } : undefined}
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
                          ? 'scale-110 border-foreground'
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
                          ? 'scale-110 border-foreground'
                          : 'border-border border-dashed',
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
                        <Plus className="h-4 w-4 text-muted-foreground" />
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
