'use client'

import { useRef, useState } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { PRESET_SEEDS, dicebearUrl } from './utils/avatar'

interface AvatarPickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  name?: string
}

export function AvatarPicker({ value, onChange, name }: AvatarPickerProps) {
  const [tab, setTab] = useState<'upload' | 'preset'>('preset')
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
    <div className="flex flex-col items-center gap-4">
      {/* Preview */}
      <Avatar className="h-20 w-20 ring-2 ring-blue-100">
        <AvatarImage src={value} />
        <AvatarFallback className="bg-gray-100 text-gray-400">
          <ImageIcon className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>

      {/* Tabs */}
      <div className="flex w-full rounded-lg border border-gray-200 overflow-hidden text-sm">
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
        <div className="grid grid-cols-4 gap-2 w-full">
          {PRESET_SEEDS.map((seed) => {
            const url = dicebearUrl(seed)
            const selected = value === url
            return (
              <button
                key={seed}
                type="button"
                onClick={() => onChange(url)}
                className={cn(
                  'flex items-center justify-center rounded-lg border p-2 transition-colors',
                  selected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300',
                )}
              >
                <img
                  src={url}
                  alt={seed}
                  className="h-10 w-10 rounded-full bg-gray-100"
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Upload */}
      {tab === 'upload' && (
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
          <p className="text-xs text-gray-400">JPG, PNG ou WebP • máx. 2 MB</p>
          {fileError && <p className="text-xs text-red-500">{fileError}</p>}
          {value && value.startsWith('data:') && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Remover foto
            </button>
          )}
        </div>
      )}
    </div>
  )
}
