'use client'

import { AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/dateUtils'
import type { ScheduleWithMeta } from '@/types/schedule'
import { cn } from '@/lib/utils'

const statusConfig = {
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

interface ScheduleTableProps {
  schedules: ScheduleWithMeta[]
  isLoading: boolean
}

export function ScheduleTable({ schedules, isLoading }: ScheduleTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-600">Título</TableHead>
            <TableHead className="font-semibold text-gray-600 hidden md:table-cell">Voluntário</TableHead>
            <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">Ministério</TableHead>
            <TableHead className="font-semibold text-gray-600">Data</TableHead>
            <TableHead className="font-semibold text-gray-600">Horário</TableHead>
            <TableHead className="font-semibold text-gray-600">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                Nenhuma escala encontrada.
              </TableCell>
            </TableRow>
          ) : (
            schedules.map((schedule) => {
              const config = statusConfig[schedule.status]
              return (
                <TableRow
                  key={schedule.id}
                  className={cn(
                    'hover:bg-gray-50/50',
                    schedule.hasConflict && 'bg-amber-50/30',
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: schedule.ministry_color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{schedule.title}</span>
                      {schedule.hasConflict && (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="h-4 w-4 text-amber-500 cursor-help shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Voluntário indisponível nesta data</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={schedule.volunteer_avatar} />
                        <AvatarFallback className="text-[10px] bg-gray-100">
                          {schedule.volunteer_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{schedule.volunteer_name}</span>
                    </div>
                  </TableCell>
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
                  <TableCell>
                    <span className="text-sm text-gray-700">{formatDate(schedule.date)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {schedule.start_time}
                      {schedule.end_time && ` – ${schedule.end_time}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    {schedule.status === 'declined' && schedule.decline_reason ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className={cn('cursor-help', config.className)}>
                            {config.label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium mb-1">Motivo da recusa:</p>
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
