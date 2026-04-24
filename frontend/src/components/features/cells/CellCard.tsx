'use client'

import { Users, Clock, MapPin, MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLeaderName } from '@/hooks/queries/useCells'
import { mockUsers } from '@/lib/mocks'
import type { Cell } from '@/types/church'

interface CellCardProps {
  cell: Cell
}

const DAY_COLORS: Record<string, { bg: string; text: string }> = {
  Domingo: { bg: 'bg-orange-50', text: 'text-orange-700' },
  Segunda: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Terça: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Quarta: { bg: 'bg-purple-50', text: 'text-purple-700' },
  Quinta: { bg: 'bg-pink-50', text: 'text-pink-700' },
  Sexta: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Sábado: { bg: 'bg-sky-50', text: 'text-sky-700' },
}

export function CellCard({ cell }: CellCardProps) {
  const leaderName = useLeaderName(cell.leader_id)
  const leader = mockUsers.find((u) => u.id === cell.leader_id)
  const dayStyle = DAY_COLORS[cell.meeting_day] ?? { bg: 'bg-gray-50', text: 'text-gray-600' }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{cell.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${dayStyle.bg} ${dayStyle.text}`}
              >
                {cell.meeting_day}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {cell.meeting_time}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar membro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Address */}
        {cell.address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{cell.address}</span>
          </div>
        )}

        {/* Leader */}
        {leader && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] bg-blue-50 text-blue-700 font-semibold">
                {leaderName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{leaderName}</p>
              <p className="text-[11px] text-gray-400">Líder da Célula</p>
            </div>
          </div>
        )}

        {/* Member count */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{cell.member_count}</span>
          <span className="text-xs text-gray-400">membros</span>
        </div>
      </CardContent>
    </Card>
  )
}
