'use client'

import { useState } from 'react'
import { Plus, Search, Music, Users, Calendar, TrendingUp } from 'lucide-react'
import { useMinistries } from '@/hooks/queries/useMinistries'
import { useDeleteMinistry } from '@/hooks/mutations/useDeleteMinistry'
import { useDashboardStats } from '@/hooks/queries/useDashboardStats'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { MinistryCard } from '@/components/features/ministries/MinistryCard'
import { CreateMinistryModal } from '@/components/features/ministries/CreateMinistryModal'
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
import type { MinistryStatus } from '@/types/ministry'

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
  const activeSchedules = 8 // from stats mock

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ministérios</h2>
          <p className="mt-1 text-sm text-gray-500">Gerencie os ministérios da sua igreja</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Ministério
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
          title="Escalas Ativas"
          value={activeSchedules}
          icon={Calendar}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Novos no Mês"
          value={stats?.new_members_this_month ?? 0}
          icon={TrendingUp}
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou líder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as MinistryStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-44 bg-white">
            <SelectValue placeholder="Status" />
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
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : ministries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Music className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-400">Nenhum ministério encontrado</p>
          <p className="text-xs text-gray-400 mt-1">Tente ajustar os filtros ou crie um novo ministério</p>
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
