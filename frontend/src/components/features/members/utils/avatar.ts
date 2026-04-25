export const PRESET_SEEDS = [
  'alex',
  'sam',
  'jordan',
  'taylor',
  'morgan',
  'casey',
  'riley',
  'avery',
]

export function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}
