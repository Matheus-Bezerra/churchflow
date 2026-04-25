'use client'

import { Gift } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBirthdays } from '@/hooks/queries/useDashboardStats'
import { formatBirthday, formatBirthdayCountdown, getDaysUntilBirthday } from '@/lib/dateUtils'

export function BirthdayList() {
  const { data: birthdays, isLoading } = useBirthdays()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-semibold text-base text-gray-900">
          <Gift className="h-4 w-4 text-pink-500" />
          Aniversariantes do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index: number) => (
              <div
                key={`skeleton-birthday-${index.toString()}`}
                className="flex items-center gap-3"
              >
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
                    <AvatarFallback className="bg-pink-50 font-semibold text-pink-600 text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 text-sm">
                      {member.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatBirthday(member.birth_date!)}
                    </p>
                  </div>
                  <Badge
                    variant={daysUntil === 0 ? 'default' : 'secondary'}
                    className={
                      daysUntil === 0
                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-100'
                        : daysUntil === 1
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-50'
                          : 'text-gray-500'
                    }
                  >
                    {formatBirthdayCountdown(daysUntil)}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-gray-400 text-sm">
            Nenhum aniversariante este mês.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
