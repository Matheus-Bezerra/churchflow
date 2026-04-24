'use client'

import { formatDistanceToNow } from '@/lib/dateUtils'
import { useRecentActivities } from '@/hooks/queries/useDashboardStats'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { UserPlus, Calendar, CheckCircle2, XCircle, BookOpen, Droplets } from 'lucide-react'
import type { RecentActivity as RecentActivityType } from '@/types/schedule'

const activityIcons: Record<RecentActivityType['type'], React.ReactNode> = {
  member_added: <UserPlus className="h-4 w-4 text-blue-500" />,
  schedule_confirmed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  schedule_declined: <XCircle className="h-4 w-4 text-red-500" />,
  ministry_created: <BookOpen className="h-4 w-4 text-blue-500" />,
  member_baptized: <Droplets className="h-4 w-4 text-sky-500" />,
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivities()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ActivitySkeleton key={i} />)
            : activities?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar_url} />
                      <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                        {activity.user_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
                      {activityIcons[activity.type]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDistanceToNow(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
