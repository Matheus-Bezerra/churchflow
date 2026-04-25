'use client';

import { Calendar, CheckCircle2, Clock, Plus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { StatsCard } from '@/components/features/dashboard/StatsCard';
import { AvailabilityAlert } from '@/components/features/schedules/AvailabilityAlert';
import { CreateScheduleModal } from '@/components/features/schedules/CreateScheduleModal';
import { ScheduleTable } from '@/components/features/schedules/ScheduleTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSchedules } from '@/hooks/queries/useSchedules';
import type { ScheduleStatus } from '@/types/schedule';

const SCHEDULE_STATUS_FILTER_LABELS: Record<string, string> = {
  all: 'Todos',
  confirmed: 'Confirmados',
  pending: 'Pendentes',
  declined: 'Recusados',
};

export default function SchedulesPage() {
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all' | null>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const { data: schedules = [], isLoading } = useSchedules();

  const filtered =
    !statusFilter || statusFilter === 'all'
      ? schedules
      : schedules.filter((s) => s.status === statusFilter);

  const confirmed = schedules.filter((s) => s.status === 'confirmed').length;
  const pending = schedules.filter((s) => s.status === 'pending').length;
  const declined = schedules.filter((s) => s.status === 'declined').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Escalas</h2>
          <p className="mt-1 text-sm text-gray-500">Gerencie as escalas de voluntários</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" />
          Nova Escala
        </Button>
      </div>

      <CreateScheduleModal open={createOpen} onOpenChange={setCreateOpen} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total"
          value={schedules.length}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title="Confirmadas"
          value={confirmed}
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

      {/* Conflict alert */}
      {!isLoading && <AvailabilityAlert schedules={schedules} />}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ScheduleStatus | 'all')}
          itemToStringLabel={(v) => SCHEDULE_STATUS_FILTER_LABELS[String(v)] ?? String(v)}
        >
          <SelectTrigger className="w-44 bg-white">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="declined">Recusados</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-400">{filtered.length} escala(s)</span>
      </div>

      {/* Table */}
      <ScheduleTable schedules={filtered} isLoading={isLoading} />
    </div>
  );
}
