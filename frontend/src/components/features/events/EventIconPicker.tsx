'use client'

import type { Control, FieldError } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Field, FieldLabel } from '@/components/ui/field'
import { EVENT_ICON_NAMES, getEventIcon } from '@/lib/iconMap'
import type { EventFormData } from '@/schemas/event'

interface EventIconPickerProps {
  control: Control<EventFormData>
  selectedColor: string
  error?: FieldError
}

export function EventIconPicker({
  control,
  selectedColor,
  error,
}: EventIconPickerProps) {
  return (
    <Controller
      name="icon"
      control={control}
      render={({ field }) => (
        <Field data-invalid={!!error}>
          <FieldLabel>Ícone</FieldLabel>
          <div className="grid grid-cols-6 gap-2 pt-1">
            {EVENT_ICON_NAMES.map((iconName) => {
              const Icon = getEventIcon(iconName)
              const selected = field.value === iconName
              return (
                <button
                  key={iconName}
                  type="button"
                  title={iconName}
                  onClick={() => field.onChange(iconName)}
                  className="flex items-center justify-center rounded-lg border p-2.5 transition-colors hover:border-gray-300"
                  style={
                    selected
                      ? {
                          backgroundColor: `${selectedColor}1f`,
                          borderColor: selectedColor,
                        }
                      : undefined
                  }
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: selected ? selectedColor : '#6B7280' }}
                  />
                </button>
              )
            })}
          </div>
        </Field>
      )}
    />
  )
}
