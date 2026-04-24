'use client'

import { Users, Music, Calendar, Gift } from 'lucide-react'
import { useDashboardStats } from '@/hooks/queries/useDashboardStats'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { BirthdayList } from '@/components/features/dashboard/BirthdayList'
import { UpcomingEventsBoard } from '@/components/features/dashboard/UpcomingEventsBoard'
import { Skeleton } from '@/components/ui/skeleton'

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo de volta, Pastor Diego. Aqui está o resumo da sua igreja.
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
            trend={{ value: `+${stats?.new_members_this_month ?? 0} este mês`, positive: true }}
          />
          <StatsCard
            title="Ministérios"
            value={stats?.ministries_count ?? 0}
            description="Ministérios ativos"
            icon={Music}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatsCard
            title="Escalas do Mês"
            value={stats?.schedules_this_month ?? 0}
            description="Escalas programadas"
            icon={Calendar}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
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
