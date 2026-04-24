'use client'

import { useRouter } from 'next/navigation'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { useSchedules } from '@/hooks/queries/useSchedules'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getMonthLabel(date: Date) {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function getShortDateLabel(date: Date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function UpcomingEventsBoard() {
  const router = useRouter()
  const { data: schedules = [], isLoading } = useSchedules()

  const today = normalizeDate(new Date())

  const upcoming = schedules
    .filter((schedule) => normalizeDate(new Date(schedule.date)) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6)

  const baseDate = upcoming.length > 0 ? new Date(upcoming[0].date) : new Date()
  const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)

  const monthDays: Date[] = []
  for (let d = 1; d <= monthEnd.getDate(); d += 1) {
    monthDays.push(new Date(baseDate.getFullYear(), baseDate.getMonth(), d))
  }

  const leadingEmptyDays = monthStart.getDay()
  const schedulesByDay = upcoming.reduce<Record<string, number>>((acc, schedule) => {
    const key = schedule.date
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          Próximos eventos e escalas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 text-sm font-medium capitalize text-gray-700">
                {getMonthLabel(baseDate)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
                {weekDays.map((day) => (
                  <div key={day} className="py-1 font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {Array.from({ length: leadingEmptyDays }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 rounded-md" />
                ))}
                {monthDays.map((day) => {
                  const dayKey = day.toISOString().slice(0, 10)
                  const daySchedules = schedulesByDay[dayKey] ?? 0
                  const isToday = dayKey === today.toISOString().slice(0, 10)

                  return (
                    <div
                      key={dayKey}
                      className={`h-10 rounded-md border text-xs flex flex-col items-center justify-center ${
                        daySchedules > 0
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-transparent text-gray-500'
                      } ${isToday ? 'ring-1 ring-blue-400' : ''}`}
                    >
                      <span>{day.getDate()}</span>
                      {daySchedules > 0 && <span className="text-[10px] leading-none">{daySchedules}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  Nenhuma escala futura cadastrada.
                </div>
              ) : (
                upcoming.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{schedule.title}</p>
                      <p className="text-xs text-gray-500">
                        {getShortDateLabel(new Date(schedule.date))} às {schedule.start_time}
                        {schedule.end_time ? ` · ${schedule.end_time}` : ''} · {schedule.ministry_name}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit gap-1"
                      onClick={() => router.push('/schedules')}
                    >
                      Ver escala
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
