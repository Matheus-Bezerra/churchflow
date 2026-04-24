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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { useCreateMember } from '@/hooks/mutations/useCreateMember'
import { AvatarPicker } from './AvatarPicker'

const memberSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\(?\d{2}\)?[\s-]?9?\d{4}[-\s]?\d{4}$/.test(v), {
      message: 'Telefone inválido',
    }),
  birth_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'visitor']),
  role: z.enum(['member', 'leader', 'pastor', 'deacon', 'elder']),
  avatar_url: z.string().optional(),
})

type MemberFormData = z.infer<typeof memberSchema>

interface CreateMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMemberModal({ open, onOpenChange }: CreateMemberModalProps) {
  const { mutate, isPending } = useCreateMember()

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
          <DialogTitle className="text-xl font-bold text-gray-900">Novo Membro</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Preencha os dados do novo membro
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? 'Salvando...' : 'Cadastrar Membro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
