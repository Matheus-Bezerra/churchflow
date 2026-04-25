'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
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
import { useCreateMember } from '@/hooks/mutations/useCreateMember'
import { mockUnavailabilities } from '@/lib/mocks'
import { memberSchema, type MemberFormData } from '@/schemas/member'

import { AvatarPicker } from './AvatarPicker'

const MEMBER_STATUS_LABELS: Record<MemberFormData['status'], string> = {
  active: 'Ativo',
  visitor: 'Visitante',
  inactive: 'Inativo',
}

const MEMBER_ROLE_LABELS: Record<MemberFormData['role'], string> = {
  member: 'Membro',
  leader: 'Líder',
  deacon: 'Diácono',
  elder: 'Ancião',
  pastor: 'Pastor',
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
      unavailability_start: '',
      unavailability_end: '',
      unavailability_reason: '',
    },
  })

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
        ministry_ids: [],
        cell_id: null,
        joined_at: new Date().toISOString(),
      },
      {
        onSuccess: (newMember) => {
          // Save unavailability locally if provided
          if (data.unavailability_start && data.unavailability_end) {
            mockUnavailabilities.push({
              id: `unavail-${Date.now()}`,
              user_id: newMember.id,
              start_date: data.unavailability_start,
              end_date: data.unavailability_end,
              reason: data.unavailability_reason ?? undefined,
              created_at: new Date().toISOString(),
            })
          }
          onOpenChange(false)
          reset()
          setUnavailabilityOpen(false)
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
                    <FieldLabel>Função</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      itemToStringLabel={(v) =>
                        MEMBER_ROLE_LABELS[v as MemberFormData['role']] ??
                        String(v)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Membro</SelectItem>
                        <SelectItem value="leader">Líder</SelectItem>
                        <SelectItem value="deacon">Diácono</SelectItem>
                        <SelectItem value="elder">Ancião</SelectItem>
                        <SelectItem value="pastor">Pastor</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
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
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="unavail-start">
                        Data inicial
                      </FieldLabel>
                      <Input
                        id="unavail-start"
                        type="date"
                        {...register('unavailability_start')}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="unavail-end">Data final</FieldLabel>
                      <Input
                        id="unavail-end"
                        type="date"
                        {...register('unavailability_end')}
                      />
                    </Field>
                  </div>
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
  )
}
