'use client'

import {
  Clock,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLeaderName } from '@/hooks/queries/useCells'
import { mockUsers } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { Cell } from '@/types/church'

import { DAY_COLORS } from './constants'

interface CellCardProps {
  cell: Cell
}

export function CellCard({ cell }: CellCardProps) {
  const leaderName = useLeaderName(cell.leader_id)
  const leader = mockUsers.find((u) => u.id === cell.leader_id)
  const dayStyle = DAY_COLORS[cell.meeting_day] ?? {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
  }

  return (
    <Card className="border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900 text-sm">
              {cell.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs ${dayStyle.bg} ${dayStyle.text}`}
              >
                {cell.meeting_day}
              </span>
              <span className="flex items-center gap-1 text-gray-400 text-xs">
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
          <div className="mb-4 flex items-center gap-1.5 text-gray-500 text-xs">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{cell.address}</span>
          </div>
        )}

        {/* Leader */}
        {leader && (
          <div className="mb-4 flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback
                className="font-semibold text-[10px]"
                style={getAvatarFallbackStyle(leader.avatar_color)}
              >
                {getInitials(leaderName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-700 text-xs">
                {leaderName}
              </p>
              <p className="text-[11px] text-gray-400">Líder da Célula</p>
            </div>
          </div>
        )}

        {/* Member count */}
        <div className="flex items-center gap-1.5 border-gray-100 border-t pt-3">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-700 text-sm">
            {cell.member_count}
          </span>
          <span className="text-gray-400 text-xs">membros</span>
        </div>
      </CardContent>
    </Card>
  )
}
