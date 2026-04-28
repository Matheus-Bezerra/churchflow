import { z } from 'zod'

export const memberSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    email: z
      .string()
      .optional()
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: 'E-mail inválido',
      }),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || /^\(?\d{2}\)?[\s-]?9?\d{4}[-\s]?\d{4}$/.test(v), {
        message: 'Telefone inválido',
      }),
    phone_is_whatsapp: z.boolean().optional(),
    birth_date: z.string().optional(),
    status: z.enum(['active', 'inactive', 'visitor']),
    role: z.string().min(1, 'Selecione uma função'),
    avatar_url: z.string().optional(),
    avatar_color: z.string().optional(),
    baptized: z.boolean().optional(),
    baptism_date: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    is_volunteer: z.boolean().optional(),
    ministry_ids: z.array(z.string()).optional(),
    cell_id: z.string().optional(),
    unavailabilities: z
      .array(
        z.discriminatedUnion('type', [
          z.object({
            type: z.literal('period'),
            start_date: z.string().min(1, 'Informe a data inicial'),
            end_date: z.string().min(1, 'Informe a data final'),
            reason: z.string().max(200).optional(),
          }),
          z.object({
            type: z.literal('recurring'),
            day_of_week: z.string().min(1, 'Selecione o dia da semana'),
            start_time: z.string().min(1, 'Informe o horário inicial'),
            end_time: z.string().min(1, 'Informe o horário final'),
            reason: z.string().max(200).optional(),
          }),
        ]),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.baptized && !data.baptism_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['baptism_date'],
        message: 'Informe a data do batismo',
      })
    }
  })

export type MemberFormData = z.input<typeof memberSchema>

const unavailabilityPeriodSchema = z.object({
  type: z.literal('period'),
  start_date: z.string().min(1, 'Informe a data inicial'),
  end_date: z.string().min(1, 'Informe a data final'),
  reason: z.string().max(200).optional(),
})

const unavailabilityRecurringSchema = z.object({
  type: z.literal('recurring'),
  day_of_week: z.string().min(1, 'Selecione o dia da semana'),
  start_time: z.string().min(1, 'Informe o horário inicial'),
  end_time: z.string().min(1, 'Informe o horário final'),
  reason: z.string().max(200).optional(),
})

export const memberUnavailabilitySchema = z.discriminatedUnion('type', [
  unavailabilityPeriodSchema,
  unavailabilityRecurringSchema,
])

