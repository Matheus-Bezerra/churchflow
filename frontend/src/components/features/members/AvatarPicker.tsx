'use client'

import { ImageIcon, Plus, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { PRESET_COLORS } from '@/constants/colors'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, getAvatarFallbackStyle, getInitials } from '@/lib/utils'

interface AvatarPickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  memberName?: string
  avatarColor?: string
  onAvatarColorChange?: (value: string) => void
  name?: string
}

export function AvatarPicker({
  value,
  onChange,
  memberName,
  avatarColor,
  onAvatarColorChange,
  name,
}: AvatarPickerProps) {
  const [open, setOpen] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setFileError('Imagem deve ter no máximo 2 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {/* Preview / trigger */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            aria-label={value ? 'Alterar avatar' : 'Selecionar avatar'}
          >
            <Avatar className="h-20 w-20 ring-2 ring-blue-100">
              <AvatarImage src={value} />
              <AvatarFallback
                className="font-semibold text-gray-400"
                style={getAvatarFallbackStyle(avatarColor)}
              >
                {memberName ? (
                  <span className="text-lg">
                    {getInitials(memberName)}
                  </span>
                ) : (
                  <ImageIcon className="h-8 w-8" />
                )}
              </AvatarFallback>
            </Avatar>
          </button>

          {!value ? (
            <div className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
              <Plus className="h-4 w-4" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-red-500"
              aria-label="Remover avatar"
              title="Remover"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground text-sm">Foto do membro</p>
          <p className="text-muted-foreground text-xs">
            Clique no avatar para {value ? 'alterar' : 'selecionar'}.
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Selecionar
            </Button>
            {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-600"
                onClick={() => onChange(undefined)}
              >
                Remover
              </Button>
            )}
          </div>
        </div>
      </div>

      {onAvatarColorChange && (
        <div>
          <p className="mb-2 font-medium text-foreground text-sm">Cor do avatar</p>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label}
                onClick={() => onAvatarColorChange(color.value)}
                className={cn(
                  'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                  avatarColor === color.value
                    ? 'scale-110 border-foreground'
                    : 'border-transparent',
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Panel (collapsible) */}
      {open && (
        <div className="rounded-xl border bg-background p-3">
          <div className="flex w-full flex-col items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              name={name}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Escolher arquivo
            </Button>
            <p className="text-muted-foreground text-xs">JPG, PNG ou WebP • máx. 2 MB</p>
            {fileError && <p className="text-red-500 text-xs">{fileError}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
