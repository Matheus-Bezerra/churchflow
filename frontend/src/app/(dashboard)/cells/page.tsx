'use client'

import { Calendar, Network, Plus, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'

import { CellCard } from '@/components/features/cells/CellCard'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
          <h2 className="font-bold text-2xl text-gray-900">Células</h2>
          <p className="mt-1 text-gray-500 text-sm">
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
          title="Líderes"
          value={stats?.leaders ?? 0}
          icon={UserCheck}
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
        <StatsCard
          title="Reuniões este mês"
          value={stats?.meetings_this_month ?? 0}
          description="Estimativa mensal"
          icon={Calendar}
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-300 border-dashed bg-white py-16 text-center">
          <Network className="mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-400 text-sm">
            Nenhuma célula cadastrada
          </p>
          <p className="mt-1 text-gray-400 text-xs">
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

      {/* Create placeholder modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Célula</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cell-name">Nome da Célula</Label>
              <Input id="cell-name" placeholder="Ex.: Célula Esperança" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cell-address">Endereço de Reunião</Label>
              <Input id="cell-address" placeholder="Rua, número" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cell-day">Dia da semana</Label>
                <Input id="cell-day" placeholder="Ex.: Quarta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cell-time">Horário</Label>
                <Input id="cell-time" type="time" defaultValue="19:30" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setCreateOpen(false)}
              >
                Criar Célula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
