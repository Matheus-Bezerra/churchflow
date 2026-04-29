'use client'

import { Calendar, CheckCircle2, Clock, Plus, XCircle } from 'lucide-react'
import { useState } from 'react'

import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { CreateScheduleModal } from '@/components/features/schedules/CreateScheduleModal'
import { EventScheduleGroup } from '@/components/features/schedules/EventScheduleGroup'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSchedules } from '@/hooks/queries/useSchedules'
import type { ScheduleStatus } from '@/types/schedule'

const SCHEDULE_STATUS_FILTER_LABELS: Record<string, string> = {
  all: 'Todos',
  confirmed: 'Confirmados',
  pending: 'Pendentes',
  declined: 'Recusados',
}

export default function SchedulesPage() {
  const [statusFilter, setStatusFilter] = useState<
    ScheduleStatus | 'all' | null
  >('all')
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [ministryFilter, setMinistryFilter] = useState<string>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const { data: schedules = [], isLoading } = useSchedules()

  const statusFiltered =
    !statusFilter || statusFilter === 'all'
      ? schedules
      : schedules.filter((s) => s.status === statusFilter)
  const eventFiltered =
    eventFilter === 'all'
      ? statusFiltered
      : statusFiltered.filter((schedule) => schedule.event_id === eventFilter)
  const filtered =
    ministryFilter === 'all'
      ? eventFiltered
      : eventFiltered.filter(
          (schedule) => schedule.ministry_id === ministryFilter,
        )

  const pending = schedules.filter((s) => s.status === 'pending').length
  const declined = schedules.filter((s) => s.status === 'declined').length
  const totalVolunteers = schedules.reduce(
    (sum, schedule) => sum + schedule.volunteers.length,
    0,
  )
  const confirmedVolunteers = schedules.reduce(
    (sum, schedule) =>
      sum +
      schedule.volunteers.filter(
        (volunteer) => volunteer.confirmation_status === 'confirmed',
      ).length,
    0,
  )
  const confirmationRate = totalVolunteers
    ? Math.round((confirmedVolunteers / totalVolunteers) * 100)
    : 0
  const eventOptions = schedules.reduce<Record<string, string>>(
    (acc, schedule) => {
      acc[schedule.event_id] = schedule.event_name
      return acc
    },
    {},
  )
  const ministryOptions = schedules.reduce<Record<string, string>>(
    (acc, schedule) => {
      acc[schedule.ministry_id] = schedule.ministry_name
      return acc
    },
    {},
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-foreground">Escalas</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Gerencie as escalas de voluntários
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nova Escala
        </Button>
      </div>

      <CreateScheduleModal open={createOpen} onOpenChange={setCreateOpen} />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total"
          value={schedules.length}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="% Confirmados"
          value={`${confirmationRate}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <StatsCard
          title="Pendentes"
          value={pending}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatsCard
          title="Recusadas"
          value={declined}
          icon={XCircle}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ScheduleStatus | 'all')}
          itemToStringLabel={(v) =>
            SCHEDULE_STATUS_FILTER_LABELS[String(v)] ?? String(v)
          }
        >
          <SelectTrigger className="w-44 bg-background">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="declined">Recusados</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={eventFilter}
          onValueChange={(value) => setEventFilter(value ?? 'all')}
          itemToStringLabel={(value) =>
            value === 'all'
              ? 'Todos os eventos'
              : (eventOptions[String(value)] ?? String(value))
          }
        >
          <SelectTrigger className="w-56 bg-background">
            <SelectValue placeholder="Filtrar por evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os eventos</SelectItem>
            {Object.entries(eventOptions).map(([eventId, eventName]) => (
              <SelectItem key={eventId} value={eventId}>
                {eventName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={ministryFilter}
          onValueChange={(value) => setMinistryFilter(value ?? 'all')}
          itemToStringLabel={(value) =>
            value === 'all'
              ? 'Todos os ministérios'
              : (ministryOptions[String(value)] ?? String(value))
          }
        >
          <SelectTrigger className="w-56 bg-background">
            <SelectValue placeholder="Filtrar por ministério" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os ministérios</SelectItem>
            {Object.entries(ministryOptions).map(
              ([ministryId, ministryName]) => (
                <SelectItem key={ministryId} value={ministryId}>
                  {ministryName}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">
          {filtered.length} escala(s)
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-xl border py-12 text-center text-muted-foreground">
          Carregando escalas...
        </div>
      ) : (
        <EventScheduleGroup schedules={filtered} />
      )}
    </div>
  )
}
