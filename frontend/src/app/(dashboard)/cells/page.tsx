'use client'

import { Activity, Network, Plus, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

import { CellCard } from '@/components/features/cells/CellCard'
import { CreateCellModal } from '@/components/features/cells/CreateCellModal'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCells, useCellsStats } from '@/hooks/queries/useCells'

export default function CellsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: cells = [], isLoading } = useCells()
  const { data: stats } = useCellsStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-foreground">Células</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Gerencie os grupos de crescimento da sua igreja
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nova Célula
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Células"
          value={stats?.total_cells ?? 0}
          icon={Network}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Membros em Células"
          value={stats?.total_members_in_cells ?? 0}
          description="Membros em alguma célula"
          icon={Users}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Frequência média"
          value={`${stats?.avg_attendance_pct ?? 0}%`}
          description="Presença média no mês"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Células ativas no mês"
          value={`${stats?.active_cells ?? 0} / ${stats?.total_cells ?? 0}`}
          description="Com ao menos 1 reunião"
          icon={Activity}
          iconColor="text-purple-500"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Cell grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={String(i)} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : cells.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Network className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground text-sm">
            Nenhuma célula cadastrada
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Clique em &quot;Nova Célula&quot; para começar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) => (
            <CellCard key={cell.id} cell={cell} />
          ))}
        </div>
      )}

      <CreateCellModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
