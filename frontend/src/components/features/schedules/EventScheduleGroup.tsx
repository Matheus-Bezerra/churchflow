'use client'

import { ChevronDown, ChevronUp, ExternalLink, Pencil } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUpdateSchedule } from '@/hooks/mutations/useUpdateSchedule'
import { formatDate } from '@/lib/dateUtils'
import { mockUsers } from '@/lib/mocks'
import type { ScheduleWithMeta } from '@/types/schedule'

import { EditScheduleModal } from './EditScheduleModal'
import { VolunteerRow } from './VolunteerRow'

interface EventScheduleGroupProps {
  schedules: ScheduleWithMeta[]
}

const CONTENT_PREVIEW_LIMIT = 4

function getConfirmedCount(schedule: ScheduleWithMeta): number {
  return schedule.volunteers.filter(
    (v) => v.confirmation_status === 'confirmed',
  ).length
}

function getGroupKey(schedule: ScheduleWithMeta): string {
  return `${schedule.event_id}:${schedule.event_occurrence_date}`
}

function isUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function formatLinkLabel(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const parts = pathname.split('/').filter(Boolean)
    const slug = parts[parts.length - 1]
    const name = slug
      ? decodeURIComponent(slug).replace(/-/g, ' ').slice(0, 48)
      : hostname
    return name || hostname
  } catch {
    return url.slice(0, 48)
  }
}

interface ContentSectionProps {
  lines: string[]
}

function ContentSection({ lines }: ContentSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = lines.length > CONTENT_PREVIEW_LIMIT
  const visible =
    needsTruncation && !expanded ? lines.slice(0, CONTENT_PREVIEW_LIMIT) : lines

  return (
    <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
      <p className="mb-1.5 font-medium text-[11px] text-blue-800 uppercase tracking-wide">
        Conteúdo
      </p>
      <ul className="space-y-1">
        {visible.map((line, i) =>
          isUrl(line) ? (
            <li key={`${line}-${i.toString()}`}>
              <a
                href={line}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-700 text-xs hover:underline"
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                {formatLinkLabel(line)}
              </a>
            </li>
          ) : (
            <li
              key={`${line}-${i.toString()}`}
              className="text-blue-900 text-xs leading-relaxed"
            >
              {line}
            </li>
          ),
        )}
      </ul>
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-blue-600 text-xs hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" /> Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" /> Ver mais{' '}
              {lines.length - CONTENT_PREVIEW_LIMIT} item
              {lines.length - CONTENT_PREVIEW_LIMIT !== 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
    </div>
  )
}

export function EventScheduleGroup({ schedules }: EventScheduleGroupProps) {
  const { mutate } = useUpdateSchedule()
  const [editSchedule, setEditSchedule] = useState<ScheduleWithMeta | null>(
    null,
  )

  const grouped = schedules.reduce<Record<string, ScheduleWithMeta[]>>(
    (acc, schedule) => {
      const key = getGroupKey(schedule)
      if (!acc[key]) acc[key] = []
      acc[key].push(schedule)
      return acc
    },
    {},
  )

  const groups = Object.values(grouped).sort(
    (a, b) =>
      new Date(a[0].event_occurrence_date).getTime() -
      new Date(b[0].event_occurrence_date).getTime(),
  )

  function handleSwap(
    schedule: ScheduleWithMeta,
    volunteerIndex: number,
    newUserId: string,
  ) {
    const updatedVolunteers = schedule.volunteers.map((v, i) =>
      i === volunteerIndex ? { ...v, user_id: newUserId } : v,
    )
    mutate({ id: schedule.id, volunteers: updatedVolunteers })
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-400">
        Nenhuma escala encontrada.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {groups.map((group) => {
          const reference = group[0]
          const totalVolunteers = group.reduce(
            (sum, s) => sum + s.volunteers.length,
            0,
          )
          const totalConfirmed = group.reduce(
            (sum, s) => sum + getConfirmedCount(s),
            0,
          )

          return (
            <details
              key={getGroupKey(reference)}
              open
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: reference.event_color }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {reference.event_name}
                      <span className="ml-2 font-normal text-gray-500 text-xs">
                        {formatDate(reference.event_occurrence_date)}
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs">
                      {totalConfirmed}/{totalVolunteers} voluntários confirmados
                      · {group.length} ministério{group.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" />
              </summary>

              <div className="space-y-3 p-4">
                {group.map((schedule) => {
                  const confirmed = getConfirmedCount(schedule)
                  const contentLines: string[] = []
                  if (schedule.description)
                    contentLines.push(schedule.description)
                  if (schedule.material_links?.length)
                    contentLines.push(...schedule.material_links)
                  const hasContent = contentLines.length > 0

                  return (
                    <div
                      key={schedule.id}
                      className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      {/* Ministry header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className="text-[11px]"
                            style={{
                              backgroundColor: `${schedule.ministry_color}15`,
                              color: schedule.ministry_color,
                            }}
                          >
                            {schedule.ministry_name}
                          </Badge>
                          <span className="text-gray-500 text-xs">
                            {confirmed}/{schedule.volunteers.length} confirmados
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-gray-500 text-xs hover:text-gray-800"
                          onClick={() => setEditSchedule(schedule)}
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                      </div>

                      {/* Conteúdo */}
                      {hasContent && <ContentSection lines={contentLines} />}

                      {/* Volunteers */}
                      <div className="space-y-2">
                        {schedule.volunteers.map((volunteer, vIndex) => (
                          <VolunteerRow
                            key={`${schedule.id}-${volunteer.user_id}-${vIndex.toString()}`}
                            volunteer={volunteer}
                            user={mockUsers.find(
                              (u) => u.id === volunteer.user_id,
                            )}
                            eventName={schedule.event_name}
                            eventDate={formatDate(
                              schedule.event_occurrence_date,
                            )}
                            ministryName={schedule.ministry_name}
                            onSwap={(newUserId) =>
                              handleSwap(schedule, vIndex, newUserId)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>

      <EditScheduleModal
        schedule={editSchedule}
        open={editSchedule !== null}
        onOpenChange={(open) => {
          if (!open) setEditSchedule(null)
        }}
      />
    </>
  )
}
