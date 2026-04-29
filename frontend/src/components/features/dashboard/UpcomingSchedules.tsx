'use client'

import { AlertTriangle, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SCHEDULE_STATUS_CONFIG } from '@/components/features/schedules/constants'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { formatDate } from '@/lib/dateUtils'
import { cn } from '@/lib/utils'

export function UpcomingSchedules() {
  const { data: schedules, isLoading } = useSchedules()

  const upcoming = schedules
    ?.filter((s) => new Date(s.event_occurrence_date) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.event_occurrence_date).getTime() -
        new Date(b.event_occurrence_date).getTime(),
    )
    .slice(0, 5)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-semibold text-base text-foreground">
          <Calendar className="h-4 w-4 text-blue-600" />
          Próximas Escalas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index: number) => (
              <Skeleton
                key={`skeleton-schedule-${index.toString()}`}
                className="h-14 w-full rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming?.map((schedule) => {
              const config = SCHEDULE_STATUS_CONFIG[schedule.status]
              return (
                <div
                  key={schedule.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: schedule.ministry_color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground text-sm">
                        {schedule.name}
                      </p>
                      {schedule.hasConflict && (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {schedule.event_name} ·{' '}
                      {formatDate(schedule.event_occurrence_date)}
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
