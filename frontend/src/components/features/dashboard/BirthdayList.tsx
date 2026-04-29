'use client'

import { Gift } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBirthdays } from '@/hooks/queries/useDashboardStats'
import { formatBirthday } from '@/lib/dateUtils'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'

export function BirthdayList() {
  const { data: birthdays, isLoading } = useBirthdays()
  const today = new Date().getDate()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-semibold text-base text-foreground">
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
              const birthDay = Number(member.birth_date!.split('-')[2])
              const dayDiff = birthDay - today
              const countdownLabel =
                dayDiff === 0
                  ? 'Hoje'
                  : dayDiff === 1
                    ? 'Amanhã'
                    : dayDiff < 0
                      ? `Há ${Math.abs(dayDiff)} ${Math.abs(dayDiff) === 1 ? 'dia' : 'dias'} atrás`
                      : `Em ${dayDiff} dias`
              return (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback
                      className="font-semibold text-xs"
                      style={getAvatarFallbackStyle(member.avatar_color)}
                    >
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground text-sm">
                      {member.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatBirthday(member.birth_date!)}
                    </p>
                  </div>
                  <Badge
                    variant={dayDiff === 0 ? 'default' : 'secondary'}
                    className={
                      dayDiff === 0
                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/40 dark:text-pink-300 dark:hover:bg-pink-950/40'
                        : dayDiff === 1
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-950/40'
                          : dayDiff < 0
                            ? 'bg-muted text-muted-foreground hover:bg-muted'
                            : 'text-muted-foreground'
                    }
                  >
                    {countdownLabel}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground text-sm">
            Nenhum aniversariante este mês.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
