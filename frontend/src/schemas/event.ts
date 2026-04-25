import { z } from 'zod'

const baseEventSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  description: z.string().max(300, 'Máximo de 300 caracteres').optional(),
  type_id: z.string().min(1, 'Selecione um tipo'),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().min(1, 'Selecione uma cor'),
  ministry_ids: z.array(z.string()).min(1, 'Selecione ao menos um ministério'),
  recurring: z.boolean(),
  recurrence_type: z.enum(['weekly', 'monthly']).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  recurrence_slots: z.array(z.object({ day: z.string(), time: z.string() })),
})

export const eventSchema = baseEventSchema.superRefine((data, ctx) => {
  if (!data.recurring) {
    if (!data.date) {
      ctx.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Data obrigatória',
      })
    }
    if (!data.time) {
      ctx.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'Horário obrigatório',
      })
    }
    return
  }

  if (data.recurrence_slots.length === 0) {
    ctx.addIssue({
      code: 'custom',
      path: ['recurrence_slots'],
      message: 'Adicione ao menos um horário',
    })
  }
})

export type EventFormData = z.infer<typeof eventSchema>
