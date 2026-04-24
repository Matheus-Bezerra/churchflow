import { type LucideIcon } from 'lucide-react'
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
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && <p className="text-xs text-gray-400">{description}</p>}
            {trend && (
              <p
                className={cn(
                  'text-xs font-medium',
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
