'use client'

import { Calendar } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentActivities } from '@/hooks/queries/useDashboardStats'
import { formatDistanceToNow } from '@/lib/dateUtils'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'

import { activityIcons } from './constants/activityIcons'

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
        <CardTitle className="flex items-center gap-2 font-semibold text-base text-gray-900">
          <Calendar className="h-4 w-4 text-blue-600" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index: number) => (
                <ActivitySkeleton
                  key={`skeleton-activity-${index.toString()}`}
                />
              ))
            : activities?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar_url} />
                      <AvatarFallback
                        className="text-xs"
                        style={getAvatarFallbackStyle(activity.avatar_color)}
                      >
                        {getInitials(activity.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
                      {activityIcons[activity.type]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-700 text-sm leading-snug">
                      {activity.description}
                    </p>
                    <p className="mt-0.5 text-gray-400 text-xs">
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
