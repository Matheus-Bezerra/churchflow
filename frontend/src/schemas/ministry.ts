import { z } from 'zod'

export const ministrySchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  description: z.string().max(200, 'Máximo de 200 caracteres').optional(),
  leader_ids: z
    .array(z.string())
    .min(1, 'Selecione ao menos um líder responsável'),
  primary_leader_id: z.string().optional(),
  volunteer_ids: z.array(z.string()).optional(),
  max_members: z
    .number()
    .int('Informe um número inteiro')
    .min(1, 'Informe pelo menos 1 vaga'),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().min(1, 'Selecione uma cor'),
})

export type MinistryFormData = z.infer<typeof ministrySchema>
