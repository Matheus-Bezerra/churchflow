'use client'

import { ArrowLeftRight, X } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockUsers } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { ScheduleVolunteer } from '@/types/schedule'
import type { User } from '@/types/user'

import { VOLUNTEER_CONFIRMATION_STATUS_CONFIG } from './constants'
import { NotificationDropdown } from './NotificationDropdown'

interface VolunteerRowProps {
  volunteer: ScheduleVolunteer
  user?: User
  eventName: string
  eventDate: string
  ministryName: string
  onSwap?: (newUserId: string) => void
}

export function VolunteerRow({
  volunteer,
  user,
  eventName,
  eventDate,
  ministryName,
  onSwap,
}: VolunteerRowProps) {
  const [swapping, setSwapping] = useState(false)

  const statusConfig =
    VOLUNTEER_CONFIRMATION_STATUS_CONFIG[volunteer.confirmation_status] ??
    VOLUNTEER_CONFIRMATION_STATUS_CONFIG.pending

  function handleSwap(newUserId: string | null) {
    if (!newUserId) return
    onSwap?.(newUserId)
    setSwapping(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback
            className="text-[10px]"
            style={getAvatarFallbackStyle(user?.avatar_color)}
          >
            {getInitials(user?.name ?? volunteer.user_id)}
          </AvatarFallback>
        </Avatar>

        {swapping ? (
          <div className="flex flex-1 items-center gap-2">
            <Select onValueChange={handleSwap} defaultOpen>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione o substituto" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers
                  .filter((u) => !u.deleted_at && u.id !== volunteer.user_id)
                  .map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <span className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback
                            className="text-[10px]"
                            style={getAvatarFallbackStyle(u.avatar_color)}
                          >
                            {getInitials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{u.name}</span>
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={() => setSwapping(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm leading-tight">
              {user?.name ?? volunteer.user_id}
            </p>
            <p className="text-gray-500 text-xs">{volunteer.role}</p>
          </div>
        )}
      </div>

      {!swapping && (
        <div className="flex items-center gap-2">
          <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
          {onSwap && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-gray-500 text-xs hover:text-gray-800"
              onClick={() => setSwapping(true)}
            >
              <ArrowLeftRight className="h-3 w-3" />
              Trocar
            </Button>
          )}
          {user && (
            <NotificationDropdown
              user={user}
              eventName={eventName}
              eventDate={eventDate}
              ministryName={ministryName}
            />
          )}
        </div>
      )}
    </div>
  )
}
