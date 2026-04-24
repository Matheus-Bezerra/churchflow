import { AlertTriangle } from 'lucide-react'
import type { ScheduleWithMeta } from '@/types/schedule'

interface AvailabilityAlertProps {
  schedules: ScheduleWithMeta[]
}

export function AvailabilityAlert({ schedules }: AvailabilityAlertProps) {
  const conflicts = schedules.filter((s) => s.hasConflict)

  if (conflicts.length === 0) return null

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800">
          {conflicts.length} escala{conflicts.length > 1 ? 's com' : ' com'} conflito de disponibilidade
        </p>
        <p className="text-xs text-amber-700 mt-0.5">
          Alguns voluntários registraram indisponibilidade nas datas destacadas. Considere reatribuir as escalas.
        </p>
        <ul className="mt-2 space-y-1">
          {conflicts.map((s) => (
            <li key={s.id} className="text-xs text-amber-700 flex items-center gap-1">
              <span className="font-medium">{s.volunteer_name}</span>
              <span>—</span>
              <span>{s.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
