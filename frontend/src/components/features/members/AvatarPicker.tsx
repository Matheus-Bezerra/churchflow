'use client'

import { ImageIcon, Plus, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { dicebearUrl, PRESET_SEEDS } from './utils/avatar'

interface AvatarPickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  name?: string
}

export function AvatarPicker({ value, onChange, name }: AvatarPickerProps) {
  const [tab, setTab] = useState<'upload' | 'preset'>('preset')
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
              <AvatarFallback className="bg-gray-100 text-gray-400">
                <ImageIcon className="h-8 w-8" />
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
              className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-red-500"
              aria-label="Remover avatar"
              title="Remover"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 text-sm">Foto do membro</p>
          <p className="text-gray-500 text-xs">
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
                className="text-gray-500 hover:text-red-600"
                onClick={() => onChange(undefined)}
              >
                Remover
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Panel (collapsible) */}
      {open && (
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          {/* Tabs */}
          <div className="flex w-full overflow-hidden rounded-lg border border-gray-200 text-sm">
            <button
              type="button"
              onClick={() => setTab('preset')}
              className={cn(
                'flex-1 py-1.5 font-medium transition-colors',
                tab === 'preset'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-white text-gray-500 hover:bg-gray-50',
              )}
            >
              Avatares
            </button>
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={cn(
                'flex-1 py-1.5 font-medium transition-colors',
                tab === 'upload'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-white text-gray-500 hover:bg-gray-50',
              )}
            >
              Enviar foto
            </button>
          </div>

          {/* Preset grid */}
          {tab === 'preset' && (
            <div className="mt-3 grid max-h-48 grid-cols-6 gap-2 overflow-auto pr-1">
              {PRESET_SEEDS.map((seed) => {
                const url = dicebearUrl(seed)
                const selected = value === url
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => {
                      onChange(url)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex items-center justify-center rounded-lg border p-1.5 transition-colors',
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300',
                    )}
                    title={seed}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={url} />
                      <AvatarFallback className="bg-gray-100 text-[10px] text-gray-400">
                        {seed.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                )
              })}
            </div>
          )}

          {/* Upload */}
          {tab === 'upload' && (
            <div className="mt-3 flex w-full flex-col items-center gap-2">
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
              <p className="text-gray-400 text-xs">
                JPG, PNG ou WebP • máx. 2 MB
              </p>
              {fileError && <p className="text-red-500 text-xs">{fileError}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
