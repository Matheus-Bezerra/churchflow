export const MEMBER_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: 'Ativo',
    className: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
  },
  visitor: {
    label: 'Visitante',
    className: 'bg-blue-50 text-blue-700 hover:bg-blue-50',
  },
}

export const MEMBER_ROLE_LABELS: Record<string, string> = {
  member: 'Membro',
  leader: 'Líder',
  pastor: 'Pastor',
  deacon: 'Diácono',
  elder: 'Ancião',
}

export const MEMBER_PAGE_SIZE = 8
