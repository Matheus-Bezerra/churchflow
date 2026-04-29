'use client'

import { Music, Plus, Search, TrendingUp, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'

import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { CreateMinistryModal } from '@/components/features/ministries/CreateMinistryModal'
import { MinistryCard } from '@/components/features/ministries/MinistryCard'
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
import { useDeleteMinistry } from '@/hooks/mutations/useDeleteMinistry'
import { useDashboardStats } from '@/hooks/queries/useDashboardStats'
import { useMinistries } from '@/hooks/queries/useMinistries'
import type { MinistryStatus } from '@/types/ministry'

const MINISTRY_LIST_STATUS_LABELS: Record<string, string> = {
  all: 'Todos',
  active: 'Ativos',
  inactive: 'Inativos',
}

export default function MinistriesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<MinistryStatus | 'all' | null>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const { data: ministries = [], isLoading } = useMinistries({
    search,
    status: (status ?? 'all') as MinistryStatus | 'all',
  })
  const { data: stats } = useDashboardStats()
  const { mutate: deleteMinistry } = useDeleteMinistry()

  const totalVolunteers = ministries.reduce((sum, m) => sum + m.member_count, 0)
  const ministriesWithCapacity = ministries.filter(
    (ministry) =>
      typeof ministry.max_members === 'number' && ministry.max_members > 0,
  )
  const totalOpenSlots = ministriesWithCapacity.reduce((sum, ministry) => {
    const openSlots = ministry.max_members! - ministry.member_count
    return sum + Math.max(openSlots, 0)
  }, 0)
  const ministriesWithOpenSlots = ministriesWithCapacity.filter(
    (ministry) => ministry.max_members! > ministry.member_count,
  ).length
  const totalCapacity = ministriesWithCapacity.reduce(
    (sum, ministry) => sum + ministry.max_members!,
    0,
  )
  const coverageRate =
    totalCapacity > 0 ? Math.round((totalVolunteers / totalCapacity) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-foreground">Ministérios</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Gerencie os ministérios da sua igreja
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Ministério
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ministérios"
          value={stats?.ministries_count ?? 0}
          icon={Music}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Voluntários"
          value={totalVolunteers}
          description="Total em todos ministérios"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Vagas em Aberto"
          value={totalOpenSlots}
          description={`${ministriesWithOpenSlots} ministério(s) com vagas`}
          icon={UserPlus}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Taxa de Cobertura"
          value={`${coverageRate}%`}
          description="Ocupação das vagas configuradas"
          icon={TrendingUp}
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou líder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as MinistryStatus | 'all')}
          itemToStringLabel={(v) =>
            MINISTRY_LIST_STATUS_LABELS[String(v)] ?? String(v)
          }
        >
          <SelectTrigger className="w-full bg-background sm:w-44">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={String(i)} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : ministries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Music className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground text-sm">
            Nenhum ministério encontrado
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Tente ajustar os filtros ou crie um novo ministério
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ministries.map((ministry) => (
            <MinistryCard
              key={ministry.id}
              ministry={ministry}
              onDelete={deleteMinistry}
            />
          ))}
        </div>
      )}

      <CreateMinistryModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
