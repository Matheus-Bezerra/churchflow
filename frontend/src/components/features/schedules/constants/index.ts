export const SCHEDULE_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  confirmed: {
    label: 'Confirmado',
    className: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-amber-50 text-amber-700 hover:bg-amber-50',
  },
  declined: {
    label: 'Recusado',
    className: 'bg-red-50 text-red-700 hover:bg-red-50',
  },
}

export const MAX_AVATAR_STACK = 3
