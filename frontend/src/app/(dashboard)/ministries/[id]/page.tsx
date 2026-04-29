'use client'

import { ArrowLeft, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserById, mockMinistries, mockUsers } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'

export default function MinistryDetailPage() {
  const params = useParams<{ id: string }>()
  const ministryId = String(params.id)
  const ministry = mockMinistries.find(
    (item) => item.id === ministryId && !item.deleted_at,
  )

  if (!ministry) {
    notFound()
  }

  const leaders = ministry.leader_ids?.length
    ? ministry.leader_ids.map((id) => getUserById(id)).filter(Boolean)
    : [getUserById(ministry.leader_id)].filter(Boolean)
  const volunteers = ministry.volunteer_ids?.length
    ? mockUsers.filter((user) => ministry.volunteer_ids?.includes(user.id))
    : []

  return (
    <div className="space-y-6">
      <Link href="/ministries">
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para ministérios
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{ministry.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ministry.description && (
            <p className="text-muted-foreground text-sm">
              {ministry.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            {ministry.member_count} membros
            {typeof ministry.max_members === 'number' && (
              <span>· {ministry.max_members} vagas totais</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liderança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaders.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Sem líderes definidos.
            </p>
          ) : (
            leaders.map((leader) => (
              <div
                key={leader?.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={leader?.avatar_url} />
                    <AvatarFallback
                      className="text-[10px]"
                      style={getAvatarFallbackStyle(leader?.avatar_color)}
                    >
                      {getInitials(leader?.name ?? '?')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{leader?.name}</span>
                </div>
                {ministry.primary_leader_id === leader?.id && (
                  <Badge className="gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <Star className="h-3 w-3 fill-current" />
                    Principal
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Voluntários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {volunteers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum voluntário vinculado.
            </p>
          ) : (
            volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="flex items-center gap-2 rounded-md border p-3"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={volunteer.avatar_url} />
                  <AvatarFallback
                    className="text-[10px]"
                    style={getAvatarFallbackStyle(volunteer.avatar_color)}
                  >
                    {getInitials(volunteer.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{volunteer.name}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
