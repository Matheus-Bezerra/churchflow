export const PRESET_COLORS = [
  { label: 'Violeta', value: '#8B5CF6' },
  { label: 'Azul', value: '#0EA5E9' },
  { label: 'Verde', value: '#10B981' },
  { label: 'Laranja', value: '#F97316' },
  { label: 'Âmbar', value: '#F59E0B' },
  { label: 'Rosa', value: '#EC4899' },
  { label: 'Vermelho', value: '#EF4444' },
] as const

export type PresetColor = (typeof PRESET_COLORS)[number]
