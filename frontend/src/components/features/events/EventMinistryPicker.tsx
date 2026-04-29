'use client'

import { Check, ChevronsUpDown, ChevronUp, Minus, Plus, X } from 'lucide-react'
import type { FieldError } from 'react-hook-form'

import { Field, FieldError as FieldErrorComp, FieldLabel } from '@/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { mockMinistries } from '@/lib/mocks'
import { cn } from '@/lib/utils'
import type { MinistryRequirement } from '@/types/event'

const activeMinistries = mockMinistries.filter((m) => !m.deleted_at)

interface EventMinistryPickerProps {
  requirements: MinistryRequirement[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggle: (id: string) => void
  onUpdateCount: (ministryId: string, count: number) => void
  error?: FieldError
}

export function EventMinistryPicker({
  requirements,
  open,
  onOpenChange,
  onToggle,
  onUpdateCount,
  error,
}: EventMinistryPickerProps) {
  const selectedIds = requirements.map((r) => r.ministry_id)

  const label = requirements.length === 0
    ? 'Selecione ministérios'
    : requirements.length === 1
      ? (activeMinistries.find((m) => m.id === requirements[0].ministry_id)?.name ?? '1 ministério')
      : `${requirements.length} ministérios selecionados`

  function handleCountChange(ministryId: string, delta: number, current: number) {
    const next = Math.max(1, current + delta)
    onUpdateCount(ministryId, next)
  }

  function handleInputChange(ministryId: string, raw: string) {
    const parsed = Number.parseInt(raw, 10)
    if (!Number.isNaN(parsed) && parsed >= 1) {
      onUpdateCount(ministryId, parsed)
    }
  }

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>Ministérios envolvidos *</FieldLabel>

      {/* Selector popover */}
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          }
        >
          <span
            className={cn('truncate', !selectedIds.length && 'text-muted-foreground')}
          >
            {label}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </PopoverTrigger>

        <PopoverContent className="w-(--anchor-width) p-1" align="start">
          <div className="max-h-48 overflow-y-auto">
            {activeMinistries.map((m) => {
              const checked = selectedIds.includes(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onToggle(m.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      checked
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-input',
                    )}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  {m.name}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Per-ministry requirement rows */}
      {requirements.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="font-medium text-muted-foreground text-xs">
            Pessoas necessárias por ministério
          </p>
          {requirements.map((req) => {
            const ministry = activeMinistries.find((m) => m.id === req.ministry_id)
            if (!ministry) return null
            return (
              <div
                key={req.ministry_id}
                className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2"
              >
                {/* Ministry identity */}
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ministry.color }}
                />
                <span className="min-w-0 flex-1 truncate text-foreground text-sm">
                  {ministry.name}
                </span>

                {/* Counter */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCountChange(req.ministry_id, -1, req.required_count)}
                    className="flex h-6 w-6 items-center justify-center rounded border bg-background text-muted-foreground hover:bg-muted disabled:opacity-40"
                    disabled={req.required_count <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={req.required_count}
                    onChange={(e) => handleInputChange(req.ministry_id, e.target.value)}
                    className="h-6 w-10 rounded border bg-background text-center text-foreground text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCountChange(req.ministry_id, 1, req.required_count)}
                    className="flex h-6 w-6 items-center justify-center rounded border bg-background text-muted-foreground hover:bg-muted"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span className="shrink-0 text-muted-foreground text-xs">
                  {req.required_count === 1 ? 'pessoa' : 'pessoas'}
                </span>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => onToggle(req.ministry_id)}
                  className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <FieldErrorComp errors={error ? [error] : []} />
    </Field>
  )
}
