export const PRESET_SEEDS = [
  // Feminino
  'ana',
  'beatriz',
  'camila',
  'julia',
  'larissa',
  'marina',
  'sofia',
  'isabela',
  // Masculino
  'gabriel',
  'lucas',
  'mateus',
  'daniel',
  'bruno',
  'rafael',
  'leonardo',
  'thiago',
]

export function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}
