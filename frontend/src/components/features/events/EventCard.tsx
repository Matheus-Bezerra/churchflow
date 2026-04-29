'use client'

import {
  Calendar,
  Clock,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/dateUtils'
import { EVENT_ICONS } from '@/lib/iconMap'
import { mockEventTypes, mockMinistries } from '@/lib/mocks'
import { cn } from '@/lib/utils'
import type { ChurchEvent } from '@/types/event'

interface EventCardProps {
  event: ChurchEvent
  onDelete: (id: string) => void
  onGenerateSchedule: (eventId: string) => void
}

export function EventCard({
  event,
  onDelete,
  onGenerateSchedule,
}: EventCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const Icon = EVENT_ICONS[event.icon] ?? EVENT_ICONS.Calendar
  const eventType = mockEventTypes.find((t) => t.id === event.type_id)
  const ministries = mockMinistries.filter(
    (m) => event.ministry_ids.includes(m.id) && !m.deleted_at,
  )

  const visibleMinistries = ministries.slice(0, 2)
  const extraCount = ministries.length - visibleMinistries.length

  const isMonthly = event.recurrence_type === 'monthly'
  const recurrenceDays = event.recurring
    ? [...new Set(event.recurrence_slots.map((s) => s.day))]
    : []

  return (
    <Card
      className={cn(
        'border border-gray-200 shadow-sm transition-shadow hover:shadow-md',
        menuOpen && 'ring-1 ring-blue-200',
      )}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${event.color}18` }}
            >
              <Icon className="h-5 w-5" style={{ color: event.color }} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-gray-900 text-sm">
                {event.name}
              </h3>
              <span className="text-gray-500 text-xs">
                {eventType?.label ?? '—'}
              </span>
            </div>
          </div>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGenerateSchedule(event.id)}>
                <Calendar className="mr-2 h-4 w-4" />
                Gerar Escala
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(event.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {event.description && (
          <p className="mb-3 line-clamp-2 text-gray-500 text-xs leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Recurrence badge */}
        {event.recurring && (
          <div className="mb-3">
            <Badge className="gap-1 bg-blue-50 text-blue-700 text-xs">
              <RefreshCw className="h-3 w-3" />
              {isMonthly ? 'Recorrente mensal' : 'Recorrente semanal'}
            </Badge>
          </div>
        )}

        <div className="mb-3 space-y-1">
          {event.recurring ? (
            recurrenceDays.map((day) => {
              const times = event.recurrence_slots
                .filter((s) => s.day === day)
                .map((s) => s.time)
              return (
                <div
                  key={day}
                  className="flex items-center gap-2 text-gray-600 text-xs"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="font-medium">
                    {isMonthly ? `Dia ${day}` : day}
                  </span>
                  <span className="text-gray-400">{times.join(' · ')}</span>
                </div>
              )
            })
          ) : (
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span>{event.date ? formatDate(event.date) : '—'}</span>
              {event.time && (
                <>
                  <span className="text-gray-400">·</span>
                  <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{event.time}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Ministries */}
        {ministries.length > 0 && (
          <div className="space-y-1.5 border-gray-100 border-t pt-3">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>Ministérios</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleMinistries.map((m) => {
                const req = event.ministry_requirements?.find(
                  (r) => r.ministry_id === m.id,
                )
                return (
                  <Badge
                    key={m.id}
                    className="gap-1 text-[11px]"
                    style={{ backgroundColor: `${m.color}18`, color: m.color }}
                  >
                    {m.name}
                    {req && (
                      <span className="ml-0.5 opacity-70">
                        · {req.required_count}p
                      </span>
                    )}
                  </Badge>
                )
              })}
              {extraCount > 0 && (
                <Badge className="bg-gray-100 text-[11px] text-gray-500">
                  +{extraCount}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
