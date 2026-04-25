'use client'

import {
  CalendarDays,
  CalendarSearch,
  Plus,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { CreateEventModal } from '@/components/features/events/CreateEventModal'
import { EventCard } from '@/components/features/events/EventCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvents } from '@/hooks/queries/useEvents'
import { mockEventTypes } from '@/lib/mocks'

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const { data: events = [], isLoading } = useEvents({
    search,
    type_id: typeFilter,
  })

  const stats = useMemo(
    () => ({
      total: events.length,
      recurring: events.filter((e) => e.recurring).length,
      thisWeek: events.filter((e) => {
        if (e.recurring) return true
        if (!e.date) return false
        const now = new Date()
        const ev = new Date(e.date)
        const diff = (ev.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= 7
      }).length,
      ministriesInvolved: new Set(events.flatMap((e) => e.ministry_ids)).size,
    }),
    [events],
  )

  const typeItemLabel = (id: string) => {
    if (id === 'all') return 'Todos os tipos'
    return mockEventTypes.find((t) => t.id === id)?.label ?? id
  }

  function handleDelete(id: string) {
    // Local removal — no backend yet
    console.info('delete event', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">Eventos</h2>
          <p className="mt-1 text-gray-500 text-sm">
            Gerencie os eventos da sua igreja
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total"
          value={stats.total}
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Recorrentes"
          value={stats.recurring}
          description="Eventos semanais fixos"
          icon={RefreshCw}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatsCard
          title="Esta semana"
          value={stats.thisWeek}
          icon={CalendarSearch}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Ministérios"
          value={stats.ministriesInvolved}
          description="Equipes envolvidas"
          icon={Users}
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white pl-9"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value ?? 'all')}
          itemToStringLabel={typeItemLabel}
        >
          <SelectTrigger className="w-full bg-white sm:w-52">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {mockEventTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={String(i)} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-300 border-dashed bg-white py-16 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-400 text-sm">
            Nenhum evento encontrado
          </p>
          <p className="mt-1 text-gray-400 text-xs">
            Tente ajustar os filtros ou crie um novo evento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CreateEventModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
