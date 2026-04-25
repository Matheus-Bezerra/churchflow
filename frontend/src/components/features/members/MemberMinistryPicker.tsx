'use client'

import { Check, ChevronsUpDown, ChevronUp, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Field, FieldError as FieldErrorComp, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { mockMinistries } from '@/lib/mocks'
import { cn } from '@/lib/utils'

const activeMinistries = mockMinistries.filter((m) => !m.deleted_at)

interface MemberMinistryPickerProps {
  selectedIds: string[]
  label: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggle: (id: string) => void
  error?: import('react-hook-form').FieldError
}

export function MemberMinistryPicker({
  selectedIds,
  label,
  open,
  onOpenChange,
  onToggle,
  error,
}: MemberMinistryPickerProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>Ministérios</FieldLabel>

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
            className={cn(
              'truncate',
              !selectedIds.length && 'text-muted-foreground',
            )}
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
          <div className="max-h-56 overflow-y-auto">
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
                        : 'border-gray-300',
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

      {selectedIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const m = activeMinistries.find((x) => x.id === id)
            if (!m) return null
            return (
              <Badge
                key={id}
                className="gap-1 text-xs"
                style={{ backgroundColor: `${m.color}18`, color: m.color }}
              >
                {m.name}
                <button
                  type="button"
                  onClick={() => onToggle(id)}
                  className="rounded-full opacity-70 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      <FieldErrorComp errors={error ? [error] : []} />
    </Field>
  )
}

