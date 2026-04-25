import { AlertTriangle } from 'lucide-react'

import { mockUsers } from '@/lib/mocks'
import type { ScheduleWithMeta } from '@/types/schedule'

interface AvailabilityAlertProps {
  schedules: ScheduleWithMeta[]
}

export function AvailabilityAlert({ schedules }: AvailabilityAlertProps) {
  const conflicts = schedules.filter((s) => s.hasConflict)

  if (conflicts.length === 0) return null

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div>
        <p className="font-semibold text-amber-800 text-sm">
          {conflicts.length} escala{conflicts.length > 1 ? 's com' : ' com'}{' '}
          conflito de disponibilidade
        </p>
        <p className="mt-0.5 text-amber-700 text-xs">
          Alguns voluntários registraram indisponibilidade nas datas destacadas.
          Considere reatribuir as escalas.
        </p>
        <ul className="mt-2 space-y-1">
          {conflicts.map((s) => {
            const volunteerNames = s.volunteers
              ?.map(
                (v) =>
                  mockUsers.find((u) => u.id === v.user_id)?.name ?? v.user_id,
              )
              .join(', ')
            return (
              <li
                key={s.id}
                className="flex items-center gap-1 text-amber-700 text-xs"
              >
                <span className="font-medium">{volunteerNames}</span>
                <span>—</span>
                <span>{s.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
