'use client'

import { AlertTriangle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/dateUtils'
import { mockUsers } from '@/lib/mocks'
import { cn, getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { ScheduleWithMeta } from '@/types/schedule'

import { MAX_AVATAR_STACK, SCHEDULE_STATUS_CONFIG } from './constants'

interface ScheduleTableProps {
  schedules: ScheduleWithMeta[]
  isLoading: boolean
}

export function ScheduleTable({ schedules, isLoading }: ScheduleTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={`skeleton-schedule-${i.toString()}`}
            className="h-14 w-full rounded-lg"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
            <TableHead className="hidden font-semibold text-muted-foreground md:table-cell">
              Evento
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">Data</TableHead>
            <TableHead className="hidden font-semibold text-muted-foreground lg:table-cell">
              Ministério
            </TableHead>
            <TableHead className="hidden font-semibold text-muted-foreground md:table-cell">
              Voluntários
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-12 text-center text-muted-foreground"
              >
                Nenhuma escala encontrada.
              </TableCell>
            </TableRow>
          ) : (
            schedules.map((schedule) => {
              const config = SCHEDULE_STATUS_CONFIG[schedule.status]
              const visibleVolunteers = schedule.volunteers.slice(
                0,
                MAX_AVATAR_STACK,
              )
              const extraVolunteers =
                schedule.volunteers.length - visibleVolunteers.length

              return (
                <TableRow
                  key={schedule.id}
                  className={cn(
                    'hover:bg-muted/50',
                    schedule.hasConflict && 'bg-amber-50/40 dark:bg-amber-950/20',
                  )}
                >
                  {/* Nome */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {schedule.name}
                      </span>
                      {schedule.hasConflict && (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="h-4 w-4 shrink-0 cursor-help text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Um ou mais voluntários indisponíveis nesta data</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>

                  {/* Evento */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: schedule.event_color }}
                      />
                      <span className="text-foreground text-sm">
                        {schedule.event_name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Data */}
                  <TableCell>
                    <span className="text-foreground text-sm">
                      {formatDate(schedule.event_occurrence_date)}
                    </span>
                  </TableCell>

                  {/* Ministério */}
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${schedule.ministry_color}15`,
                        color: schedule.ministry_color,
                      }}
                    >
                      {schedule.ministry_name}
                    </Badge>
                  </TableCell>

                  {/* Voluntários — avatar stack */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {visibleVolunteers.map((v) => {
                          const user = mockUsers.find(
                            (u) => u.id === v.user_id,
                          )
                          return (
                            <Tooltip key={v.user_id}>
                              <TooltipTrigger>
                                <Avatar className="h-7 w-7 border-2 border-background">
                                  <AvatarImage src={user?.avatar_url} />
                                  <AvatarFallback
                                    className="text-[9px]"
                                    style={getAvatarFallbackStyle(user?.avatar_color)}
                                  >
                                    {getInitials(user?.name ?? '?')}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">
                                  {user?.name ?? v.user_id}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {v.role}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                      {extraVolunteers > 0 && (
                        <span className="text-muted-foreground text-xs">
                          +{extraVolunteers}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {schedule.status === 'declined' &&
                    schedule.decline_reason ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            className={cn('cursor-help', config.className)}
                          >
                            {config.label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="mb-1 font-medium">Motivo da recusa:</p>
                          <p>{schedule.decline_reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge className={config.className}>{config.label}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
