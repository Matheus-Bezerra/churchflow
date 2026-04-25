import {
  BookOpen,
  CheckCircle2,
  Droplets,
  UserPlus,
  XCircle,
} from 'lucide-react'

import type { RecentActivity } from '@/types/schedule'

export const activityIcons: Record<RecentActivity['type'], React.ReactNode> = {
  member_added: <UserPlus className="h-4 w-4 text-blue-500" />,
  schedule_confirmed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  schedule_declined: <XCircle className="h-4 w-4 text-red-500" />,
  ministry_created: <BookOpen className="h-4 w-4 text-blue-500" />,
  member_baptized: <Droplets className="h-4 w-4 text-sky-500" />,
}
