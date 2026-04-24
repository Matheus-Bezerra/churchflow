'use client'

import { Calendar, AlertTriangle } from 'lucide-react'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/dateUtils'
import { cn } from '@/lib/utils'

const statusConfig = {
  confirmed: { label: 'Confirmado', className: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pendente', className: 'bg-amber-50 text-amber-700' },
  declined: { label: 'Recusado', className: 'bg-red-50 text-red-700' },
}

export function UpcomingSchedules() {
  const { data: schedules, isLoading } = useSchedules()

  const upcoming = schedules
    ?.filter((s) => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          Próximas Escalas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming?.map((schedule) => {
              const config = statusConfig[schedule.status]
              return (
                <div
                  key={schedule.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: schedule.ministry_color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{schedule.title}</p>
                      {schedule.hasConflict && (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {schedule.volunteer_name} · {formatDate(schedule.date)}
                    </p>
                  </div>
                  <Badge className={cn('shrink-0 text-xs', config.className)}>
                    {config.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
