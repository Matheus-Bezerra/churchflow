import { z } from 'zod'

export const scheduleVolunteerSchema = z.object({
  user_id: z.string().min(1, 'Selecione um voluntário'),
  role: z.string().min(1, 'Informe o cargo'),
  confirmation_status: z.enum(['pending', 'confirmed', 'declined']),
  decline_reason: z.string().nullable().optional(),
})

export const scheduleSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  event_id: z.string().min(1, 'Selecione um evento'),
  event_occurrence_date: z.string().min(1, 'Selecione a data de ocorrência'),
  ministry_id: z.string().min(1, 'Selecione um ministério'),
  volunteers: z
    .array(scheduleVolunteerSchema)
    .min(1, 'Adicione ao menos um voluntário'),
  notes: z.string().max(300, 'Máximo de 300 caracteres').optional(),
  repeat_occurrences: z.number().min(0).max(8).optional(),
})

export type ScheduleFormData = z.infer<typeof scheduleSchema>
