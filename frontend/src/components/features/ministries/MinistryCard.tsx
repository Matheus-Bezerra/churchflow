'use client'

import {
  Calendar,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { MINISTRY_ICONS } from '@/lib/iconMap'
import { getUserById, mockUsers } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { Ministry } from '@/types/ministry'

interface MinistryCardProps {
  ministry: Ministry
  onDelete: (id: string) => void
}

export function MinistryCard({ ministry, onDelete }: MinistryCardProps) {
  const Icon =
    MINISTRY_ICONS[ministry.icon as keyof typeof MINISTRY_ICONS] ??
    MINISTRY_ICONS.Music

  const leaders = ministry.leader_ids
    ? ministry.leader_ids.map((id) => getUserById(id)).filter(Boolean)
    : [getUserById(ministry.leader_id)].filter(Boolean)

  const volunteers = ministry.volunteer_ids
    ? ministry.volunteer_ids
        .map((id) => mockUsers.find((u) => u.id === id))
        .filter(Boolean)
    : []

  const fillPercent = ministry.max_members
    ? Math.round((ministry.member_count / ministry.max_members) * 100)
    : 100

  return (
    <Card className="border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${ministry.color}18` }}
            >
              <Icon className="h-5 w-5" style={{ color: ministry.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {ministry.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1 text-gray-500 text-xs">
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
          <p className="mb-4 line-clamp-2 text-gray-500 text-xs leading-relaxed">
            {ministry.description}
          </p>
        )}

        {/* Leaders */}
        {leaders.length > 0 && (
          <div className="mb-3 space-y-1.5">
            <p className="font-medium text-[11px] text-gray-400 uppercase tracking-wide">
              {leaders.length === 1 ? 'Líder' : 'Líderes'}
            </p>
            {leaders.map((leader) =>
              leader ? (
                <div key={leader.id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={leader.avatar_url} />
                    <AvatarFallback
                      className="text-[10px]"
                      style={getAvatarFallbackStyle(leader.avatar_color)}
                    >
                      {getInitials(leader.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-600 text-xs">{leader.name}</span>
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    Líder
                  </Badge>
                </div>
              ) : null,
            )}
          </div>
        )}

        {/* Volunteers */}
        {volunteers.length > 0 && (
          <div className="mb-3 space-y-1.5">
            <p className="font-medium text-[11px] text-gray-400 uppercase tracking-wide">
              Voluntários ({volunteers.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {volunteers.slice(0, 5).map((v) =>
                v ? (
                  <Avatar key={v.id} className="h-6 w-6" title={v.name}>
                    <AvatarImage src={v.avatar_url} />
                    <AvatarFallback
                      className="text-[9px]"
                      style={getAvatarFallbackStyle(v.avatar_color)}
                    >
                      {getInitials(v.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : null,
              )}
              {volunteers.length > 5 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[9px] text-gray-500">
                  +{volunteers.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Members progress */}
        {ministry.max_members ? (
          <div className="space-y-1.5 border-gray-100 border-t pt-3">
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {ministry.member_count} membros
              </span>
              <span>{ministry.max_members} vagas</span>
            </div>
            <Progress value={fillPercent} className="h-1.5" />
          </div>
        ) : (
          <div className="flex items-center gap-1 border-gray-100 border-t pt-3 text-gray-500 text-xs">
            <Users className="h-3 w-3" />
            {ministry.member_count} membros
          </div>
        )}
      </CardContent>
    </Card>
  )
}
