import { z } from 'zod'

export const memberSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.email('E-mail inválido'),
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
  unavailability_start: z.string().optional(),
  unavailability_end: z.string().optional(),
  unavailability_reason: z.string().max(200).optional(),
})

export type MemberFormData = z.infer<typeof memberSchema>
