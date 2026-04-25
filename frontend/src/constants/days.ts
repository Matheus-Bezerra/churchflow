export const WEEK_DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const

export type WeekDay = (typeof WEEK_DAYS)[number]

export const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
