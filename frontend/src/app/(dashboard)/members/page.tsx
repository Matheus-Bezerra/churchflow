'use client'

import { Droplets, Search, UserCheck, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'

import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { CreateMemberModal } from '@/components/features/members/CreateMemberModal'
import { MembersTable } from '@/components/features/members/MembersTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardStats } from '@/hooks/queries/useDashboardStats'
import { useMembers } from '@/hooks/queries/useMembers'
import { mockMinistries } from '@/lib/mocks'
import type { MemberStatus } from '@/types/user'

const MEMBER_LIST_STATUS_LABELS: Record<string, string> = {
  all: 'Todos os status',
  active: 'Ativos',
  visitor: 'Visitantes',
  inactive: 'Inativos',
}

function ministryFilterLabel(ministryId: string): string {
  if (ministryId === 'all') return 'Todos os ministérios'
  const m = mockMinistries.find((x) => x.id === ministryId && !x.deleted_at)
  return m?.name ?? ministryId
}

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<MemberStatus | 'all' | null>('all')
  const [ministryId, setMinistryId] = useState<string | null>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const { data: members = [], isLoading } = useMembers({
    search,
    status: (status ?? 'all') as MemberStatus | 'all',
    ministry_id: ministryId ?? 'all',
  })

  const { data: stats } = useDashboardStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">Membros</h2>
          <p className="mt-1 text-gray-500 text-sm">
            Gerencie os membros da sua igreja
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Novo Membro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total"
          value={stats?.total_members ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Ativos"
          value={stats?.active_members ?? 0}
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatsCard
          title="Visitantes"
          value={stats?.visitors ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Batizados"
          value={stats?.baptized ?? 0}
          icon={Droplets}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as MemberStatus | 'all')}
          itemToStringLabel={(v) =>
            MEMBER_LIST_STATUS_LABELS[String(v)] ?? String(v)
          }
        >
          <SelectTrigger className="w-full bg-white sm:w-44">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="visitor">Visitantes</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={ministryId}
          onValueChange={setMinistryId}
          itemToStringLabel={(v) => ministryFilterLabel(String(v))}
        >
          <SelectTrigger className="w-full bg-white sm:w-48">
            <SelectValue placeholder="Filtrar por ministério" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os ministérios</SelectItem>
            {mockMinistries
              .filter((m) => !m.deleted_at)
              .map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <MembersTable members={members} isLoading={isLoading} />

      {/* Create Modal */}
      <CreateMemberModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
