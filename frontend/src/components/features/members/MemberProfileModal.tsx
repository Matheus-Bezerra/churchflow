'use client'

import { Calendar, Droplets, Mail, MapPin, Network, Phone } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useMemberFunctions } from '@/hooks/queries/useMemberFunctions'
import { formatDate } from '@/lib/dateUtils'
import { mockCells, mockMinistries } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { User } from '@/types/user'

import { MEMBER_ROLE_LABELS, MEMBER_STATUS_CONFIG } from './constants/labels'

interface MemberProfileModalProps {
  member: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberProfileModal({
  member,
  open,
  onOpenChange,
}: MemberProfileModalProps) {
  const { data: memberFunctions = [] } = useMemberFunctions()

  if (!member) return null

  const statusCfg = MEMBER_STATUS_CONFIG[member.status]
  const cell = mockCells.find((c) => c.id === member.cell_id)
  const ministries = mockMinistries.filter((m) =>
    member.ministry_ids.includes(m.id),
  )
  const roleLabel =
    memberFunctions.find((f) => f.id === String(member.role))?.label ??
    MEMBER_ROLE_LABELS[String(member.role)] ??
    String(member.role)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Perfil do Membro</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Avatar + basic info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.avatar_url} />
              <AvatarFallback
                className="font-bold text-lg"
                style={getAvatarFallbackStyle(member.avatar_color)}
              >
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {member.name}
              </h3>
              <p className="text-muted-foreground text-sm">{roleLabel}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
                {member.baptized && (
                  <Badge className="bg-sky-50 text-sky-700">
                    <Droplets className="mr-1 h-3 w-3" /> Batizado
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
              Contato
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {member.email}
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {member.phone}
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-2 text-foreground text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {member.address}, {member.city} — {member.state}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Personal */}
          <div className="grid grid-cols-2 gap-4">
            {member.birth_date && (
              <div>
                <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Nascimento
                </p>
                <p className="flex items-center gap-1 text-foreground text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(member.birth_date)}
                </p>
              </div>
            )}
            {member.baptism_date && (
              <div>
                <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Batismo
                </p>
                <p className="flex items-center gap-1 text-foreground text-sm">
                  <Droplets className="h-3.5 w-3.5 text-sky-400" />
                  {formatDate(member.baptism_date)}
                </p>
              </div>
            )}
            {cell && (
              <div>
                <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Célula
                </p>
                <p className="flex items-center gap-1 text-foreground text-sm">
                  <Network className="h-3.5 w-3.5 text-muted-foreground" />
                  {cell.name}
                </p>
              </div>
            )}
            <div>
              <p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                Membro desde
              </p>
              <p className="text-foreground text-sm">
                {formatDate(member.joined_at)}
              </p>
            </div>
          </div>

          {ministries.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Ministérios
                </p>
                <div className="flex flex-wrap gap-2">
                  {ministries.map((m) => (
                    <Badge
                      key={m.id}
                      style={{
                        backgroundColor: `${m.color}15`,
                        color: m.color,
                      }}
                    >
                      {m.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
