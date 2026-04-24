'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  UserPlus,
  Calendar,
} from 'lucide-react'
import { getMinistryIcon } from '@/lib/iconMap'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMinistryActivities } from '@/hooks/queries/useMinistries'
import { getUserById } from '@/lib/mocks'
import { formatDistanceToNow } from '@/lib/dateUtils'
import type { Ministry } from '@/types/ministry'

interface MinistryCardProps {
  ministry: Ministry
  onDelete: (id: string) => void
}

export function MinistryCard({ ministry, onDelete }: MinistryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: activities } = useMinistryActivities(expanded ? ministry.id : '')

  const Icon = getMinistryIcon(ministry.icon)
  const leader = getUserById(ministry.leader_id)
  const fillPercent = ministry.max_members
    ? Math.round((ministry.member_count / ministry.max_members) * 100)
    : 100

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${ministry.color}18` }}
            >
              <Icon className="h-5 w-5" style={{ color: ministry.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{ministry.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Clock className="h-3 w-3" />
                {ministry.meeting_day} às {ministry.meeting_time}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
              <MoreHorizontal className="h-4 w-4" />
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
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Ver escalas
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(ministry.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {ministry.description && (
          <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
            {ministry.description}
          </p>
        )}

        {/* Leader */}
        {leader && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-6 w-6">
              <AvatarImage src={leader.avatar_url} />
              <AvatarFallback className="text-[10px] bg-gray-100">
                {leader.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{leader.name}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              Líder
            </Badge>
          </div>
        )}

        {/* Members progress */}
        {ministry.max_members && (
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {ministry.member_count} membros
              </span>
              <span>{ministry.max_members} vagas</span>
            </div>
            <Progress value={fillPercent} className="h-1.5" />
          </div>
        )}

        {/* Expand activities */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex w-full items-center justify-between text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors pt-2 border-t border-gray-100"
        >
          <span>Atividade recente</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {activities && activities.length > 0 ? (
              activities.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: ministry.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">{a.description}</p>
                    <p className="text-[11px] text-gray-400">{formatDistanceToNow(a.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">Nenhuma atividade registrada.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
