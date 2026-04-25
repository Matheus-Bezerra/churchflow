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
  role: z.string().min(1, 'Selecione uma função'),
  avatar_url: z.string().optional(),
  is_volunteer: z.boolean().optional(),
  ministry_ids: z.array(z.string()).optional(),
  cell_id: z.string().optional(),
  unavailability_mode: z.enum(['none', 'period', 'recurring']).optional(),
  unavailability_start: z.string().optional(),
  unavailability_end: z.string().optional(),
  unavailability_weekday: z.string().optional(),
  unavailability_start_time: z.string().optional(),
  unavailability_end_time: z.string().optional(),
  unavailability_reason: z.string().max(200).optional(),
}).superRefine((data, ctx) => {
  if (data.unavailability_mode === 'period') {
    if (!data.unavailability_start) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe a data inicial',
        path: ['unavailability_start'],
      })
    }
    if (!data.unavailability_end) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe a data final',
        path: ['unavailability_end'],
      })
    }
  }

  if (data.unavailability_mode === 'recurring') {
    if (!data.unavailability_weekday) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione o dia da semana',
        path: ['unavailability_weekday'],
      })
    }
    if (!data.unavailability_start_time) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o horário inicial',
        path: ['unavailability_start_time'],
      })
    }
    if (!data.unavailability_end_time) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o horário final',
        path: ['unavailability_end_time'],
      })
    }
  }
})

export type MemberFormData = z.input<typeof memberSchema>
