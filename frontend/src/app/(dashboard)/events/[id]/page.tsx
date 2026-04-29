'use client'

import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/dateUtils'
import { EVENT_ICONS } from '@/lib/iconMap'
import { mockEvents, mockMinistries, mockSchedules } from '@/lib/mocks'

export default function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const eventId = String(params.id)
  const event = mockEvents.find(
    (item) => item.id === eventId && !item.deleted_at,
  )

  if (!event) {
    notFound()
  }

  const Icon = EVENT_ICONS[event.icon] ?? EVENT_ICONS.Calendar
  const requirements = event.ministry_requirements
    .map((requirement) => {
      const ministry = mockMinistries.find(
        (item) => item.id === requirement.ministry_id,
      )
      return {
        requirement,
        ministry,
      }
    })
    .filter((entry) => Boolean(entry.ministry))
  const eventSchedules = mockSchedules.filter(
    (schedule) => schedule.event_id === event.id && !schedule.deleted_at,
  )

  return (
    <div className="space-y-6">
      <Link href="/events">
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para eventos
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${event.color}1f` }}
            >
              <Icon className="h-5 w-5" style={{ color: event.color }} />
            </span>
            <span>{event.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.description && (
            <p className="text-muted-foreground text-sm">{event.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
            {event.date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(event.date)}
              </span>
            )}
            {event.time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {event.time}
              </span>
            )}
            <Badge variant="secondary">
              {event.recurring ? 'Recorrente' : 'Data única'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ministérios e demanda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {requirements.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum ministério vinculado.
            </p>
          ) : (
            requirements.map(({ requirement, ministry }) => (
              <div
                key={requirement.ministry_id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span className="font-medium text-sm">{ministry?.name}</span>
                <Badge variant="secondary">
                  {requirement.required_count} pessoas
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Escalas vinculadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {eventSchedules.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma escala vinculada a este evento.
            </p>
          ) : (
            eventSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span className="font-medium text-sm">{schedule.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(schedule.event_occurrence_date)} ·{' '}
                  {schedule.volunteers.length} voluntários
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
