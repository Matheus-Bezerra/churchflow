import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-sm">{title}</p>
            <p className="font-bold text-3xl text-foreground">{value}</p>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  'font-medium text-xs',
                  trend.positive ? 'text-emerald-600' : 'text-red-500',
                )}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className={cn('rounded-xl p-3', iconBg)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
