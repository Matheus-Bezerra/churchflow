'use client'

import { Plus } from 'lucide-react'
import type { Control, FieldError } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Field, FieldLabel } from '@/components/ui/field'
import { PRESET_COLORS } from '@/constants/colors'
import { cn } from '@/lib/utils'
import type { EventFormData } from '@/schemas/event'

interface EventColorPickerProps {
  control: Control<EventFormData>
  error?: FieldError
}

export function EventColorPicker({ control, error }: EventColorPickerProps) {
  return (
    <Controller
      name="color"
      control={control}
      render={({ field }) => {
        const isCustomColor =
          !!field.value && !PRESET_COLORS.some((c) => c.value === field.value)

        return (
          <Field data-invalid={!!error}>
            <FieldLabel>Cor</FieldLabel>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => field.onChange(c.value)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                    field.value === c.value
                      ? 'scale-110 border-foreground'
                      : 'border-transparent',
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}

              {/* Custom color */}
              <label
                title="Cor personalizada"
                className={cn(
                  'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-transform hover:scale-110',
                  isCustomColor
                    ? 'scale-110 border-foreground'
                    : 'border-border border-dashed',
                )}
                style={{
                  backgroundColor: isCustomColor ? field.value : undefined,
                }}
              >
                {!isCustomColor && <Plus className="h-4 w-4 text-muted-foreground" />}
                <input
                  type="color"
                  value={field.value || '#000000'}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </Field>
        )
      }}
    />
  )
}
