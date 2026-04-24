'use client'

import { Gift } from 'lucide-react'
import { useBirthdays } from '@/hooks/queries/useDashboardStats'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBirthday, getDaysUntilBirthday } from '@/lib/dateUtils'

export function BirthdayList() {
  const { data: birthdays, isLoading } = useBirthdays()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Gift className="h-4 w-4 text-pink-500" />
          Aniversariantes do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : birthdays && birthdays.length > 0 ? (
          <div className="space-y-3">
            {birthdays.map((member) => {
              const daysUntil = getDaysUntilBirthday(member.birth_date!)
              return (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="text-xs bg-pink-50 text-pink-600 font-semibold">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-400">{formatBirthday(member.birth_date!)}</p>
                  </div>
                  <Badge
                    variant={daysUntil === 0 ? 'default' : 'secondary'}
                    className={
                      daysUntil === 0
                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-100'
                        : 'text-gray-500'
                    }
                  >
                    {daysUntil === 0 ? 'Hoje!' : `${daysUntil}d`}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum aniversariante este mês.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
