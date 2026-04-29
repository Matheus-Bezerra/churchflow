'use client'

import { CalendarDays, ChevronRight, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ptBR } from 'react-day-picker/locale'

import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedules } from '@/hooks/queries/useSchedules'
import type { EventIconName } from '@/lib/iconMap'
import { getEventIcon } from '@/lib/iconMap'
import { cn } from '@/lib/utils'
import type { ScheduleWithMeta } from '@/types/schedule'
import { normalizeDate } from '@/utils/formatters/calendar'

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseOccurrenceDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00`)
}

export function UpcomingEventsBoard() {
  const router = useRouter()
  const { data: schedules = [], isLoading } = useSchedules()
  const [viewMonth, setViewMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const today = normalizeDate(new Date())

  const upcoming = schedules
    .filter(
      (s) =>
        normalizeDate(parseOccurrenceDate(s.event_occurrence_date)) >= today,
    )
    .sort(
      (a, b) =>
        parseOccurrenceDate(a.event_occurrence_date).getTime() -
        parseOccurrenceDate(b.event_occurrence_date).getTime(),
    )
    .slice(0, 5)

  const allEventDates = schedules.map(
    (s) => new Date(`${s.event_occurrence_date}T00:00:00`),
  )

  const eventsByDay = schedules.reduce<Record<string, ScheduleWithMeta[]>>(
    (acc, schedule) => {
      const key = schedule.event_occurrence_date
      acc[key] = [...(acc[key] ?? []), schedule]
      return acc
    },
    {},
  )

  const selectedDayKey = selectedDate ? toDayKey(selectedDate) : undefined
  const selectedDayEvents = selectedDayKey
    ? (eventsByDay[selectedDayKey] ?? [])
    : []

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-semibold text-base text-foreground">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          Próximos eventos
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-64 w-[272px] shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-16 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={String(i)} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            {/* ── Calendário ── */}
            <div className="shrink-0 overflow-hidden rounded-xl border border-blue-100/60 bg-linear-to-b from-blue-50/40 to-background lg:w-[272px] dark:border-blue-900/30 dark:from-blue-950/20 dark:to-background">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={viewMonth}
                onMonthChange={setViewMonth}
                locale={ptBR}
                captionLayout="dropdown"
                startMonth={new Date(2024, 0)}
                endMonth={new Date(2028, 11)}
                modifiers={{ hasEvent: allEventDates }}
                className="w-full rounded-none border-0 bg-transparent [--cell-size:--spacing(9)]"
                components={{
                  DayButton: ({ day, modifiers, ...buttonProps }) => {
                    const key = toDayKey(day.date)
                    const dayEvents = eventsByDay[key] ?? []
                    const count = dayEvents.length
                    const firstColor = dayEvents[0]?.event_color
                    const isSelected =
                      !!modifiers.selected &&
                      !modifiers.range_start &&
                      !modifiers.range_end
                    const isToday = !!modifiers.today
                    const isOutside = !!modifiers.outside

                    return (
                      <button
                        type="button"
                        {...buttonProps}
                        className={cn(
                          'relative flex h-full w-full flex-col items-center justify-center gap-px rounded-md py-0.5 text-xs transition-all',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
                          isOutside && 'opacity-30',
                          modifiers.disabled &&
                            'pointer-events-none opacity-30',
                          !count &&
                            isToday &&
                            !isSelected &&
                            'bg-muted font-medium',
                          !count &&
                            !isToday &&
                            !isSelected &&
                            'text-foreground hover:bg-muted',
                          !count &&
                            isSelected &&
                            'bg-blue-600 text-white shadow-sm hover:bg-blue-700',
                        )}
                        style={
                          count > 0
                            ? {
                                backgroundColor: `${firstColor}${isSelected ? '35' : '18'}`,
                                ...(isSelected
                                  ? {
                                      color: firstColor,
                                      boxShadow: `0 0 0 2px ${firstColor}, 0 0 0 4px ${firstColor}30`,
                                    }
                                  : {}),
                              }
                            : undefined
                        }
                      >
                        <span
                          className={cn(
                            'leading-none',
                            count > 0 && 'font-semibold',
                          )}
                        >
                          {day.date.getDate()}
                        </span>
                        {count > 0 && (
                          <span
                            className="font-bold text-[8px] leading-none"
                            style={{
                              color: isSelected ? firstColor : firstColor,
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  },
                }}
                footer={
                  selectedDate ? (
                    <div className="border-blue-100/60 border-t p-2">
                      {selectedDayEvents.length > 0 ? (
                        <div className="space-y-1">
                          {selectedDayEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="flex items-center gap-1.5 rounded-md px-2 py-1.5"
                              style={{ backgroundColor: `${ev.event_color}12` }}
                            >
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: ev.event_color }}
                              />
                              <span
                                className="truncate font-medium text-[11px]"
                                style={{ color: ev.event_color }}
                              >
                                {ev.event_name}
                              </span>
                              {ev.event_time && (
                                <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                                  {ev.event_time}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="py-0.5 text-center text-[11px] text-muted-foreground">
                          Sem eventos em{' '}
                          {selectedDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                      )}
                    </div>
                  ) : null
                }
              />
            </div>

            {/* ── Lista de próximos ── */}
            <div className="min-w-0 flex-1 space-y-2">
              {upcoming.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">
                  Nenhuma escala futura.
                </div>
              ) : (
                <>
                  {upcoming.map((schedule) => {
                    const Icon = getEventIcon(
                      schedule.event_icon as EventIconName,
                    )
                    const date = parseOccurrenceDate(
                      schedule.event_occurrence_date,
                    )
                    const isEventToday =
                      normalizeDate(date).getTime() === today.getTime()
                    const formattedDate = isEventToday
                      ? 'Hoje'
                      : date.toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                        })

                    return (
                      <button
                        key={schedule.id}
                        type="button"
                        className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all hover:bg-muted/50 hover:shadow-sm"
                        onClick={() => router.push('/schedules')}
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${schedule.event_color}18`,
                          }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color: schedule.event_color }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground text-sm leading-tight">
                            {schedule.event_name}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-muted-foreground text-xs">
                            <span
                              className={cn(
                                'capitalize',
                                isEventToday && 'font-semibold text-blue-600',
                              )}
                            >
                              {formattedDate}
                            </span>
                            {schedule.event_time && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-0.5">
                                  <Clock className="h-2.5 w-2.5" />
                                  {schedule.event_time}
                                </span>
                              </>
                            )}
                            {schedule.ministry_name && (
                              <>
                                <span>·</span>
                                <span
                                  className="font-medium"
                                  style={{ color: schedule.ministry_color }}
                                >
                                  {schedule.ministry_name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-medium text-blue-700 text-xs transition-colors hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
                    onClick={() => router.push('/events')}
                  >
                    Ver todos os eventos
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
