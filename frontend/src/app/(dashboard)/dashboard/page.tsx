'use client'

import { CalendarDays, Gift, LayoutGrid, Users } from 'lucide-react'

import { BirthdayList } from '@/components/features/dashboard/BirthdayList'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { UpcomingEventsBoard } from '@/components/features/dashboard/UpcomingEventsBoard'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '@/hooks/queries/useDashboardStats'

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={String(i)} className="h-32 rounded-xl" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-2xl text-foreground">Resumo</h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Bem-vindo de volta, Pastor Adilson. Aqui está o resumo da sua igreja.
        </p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total de Membros"
            value={stats?.total_members ?? 0}
            description={`${stats?.active_members ?? 0} membros ativos`}
            icon={Users}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
            trend={{
              value: `+${stats?.new_members_this_month ?? 0} este mês`,
              positive: true,
            }}
          />
          <StatsCard
            title="Eventos do Mês"
            value={stats?.events_this_month ?? 0}
            description="Ocorrências de eventos"
            icon={CalendarDays}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatsCard
            title="Ministérios"
            value={stats?.ministries_count ?? 0}
            description="Ministérios ativos"
            icon={LayoutGrid}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />
          <StatsCard
            title="Aniversariantes"
            value={stats?.birthdays_this_month ?? 0}
            description="Aniversariantes neste mês"
            icon={Gift}
            iconColor="text-pink-600"
            iconBg="bg-pink-50"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingEventsBoard />
        </div>
        <div className="space-y-6">
          <BirthdayList />
        </div>
      </div>
    </div>
  )
}
