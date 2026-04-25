'use client'

import { Pencil, Plus, Settings2, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { EventType } from '@/types/event'

import { MAX_EVENT_TYPES } from './constants'

interface EventTypeManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  types: EventType[]
  onAdd: (label: string) => void
  onEdit: (id: string, label: string) => void
  onDelete: (id: string) => void
}

export function EventTypeManager({
  open,
  onOpenChange,
  types,
  onAdd,
  onEdit,
  onDelete,
}: EventTypeManagerProps) {
  const [newLabel, setNewLabel] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  const canAdd = types.length < MAX_EVENT_TYPES

  function handleAdd() {
    const trimmed = newLabel.trim()
    if (!trimmed || !canAdd) return
    onAdd(trimmed)
    setNewLabel('')
  }

  function startEdit(type: EventType) {
    setEditingId(type.id)
    setEditLabel(type.label)
  }

  function commitEdit() {
    if (editingId && editLabel.trim()) {
      onEdit(editingId, editLabel.trim())
    }
    setEditingId(null)
    setEditLabel('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditLabel('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-semibold text-gray-900">
            <Settings2 className="h-4 w-4" />
            Gerenciar tipos de evento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* List */}
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {types.map((type) => (
              <li
                key={type.id}
                className="flex items-center gap-2 px-3 py-2"
              >
                {editingId === type.id ? (
                  <>
                    <Input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="h-7 flex-1 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                    />
                    <button
                      type="button"
                      onClick={commitEdit}
                      className="text-emerald-600 text-xs hover:underline"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-gray-800 text-sm">
                      {type.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {type.is_default && (
                        <Badge className="bg-gray-100 text-[10px] text-gray-500">
                          Padrão
                        </Badge>
                      )}
                      <button
                        type="button"
                        onClick={() => startEdit(type)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(type.id)}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Add new */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Novo tipo..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                disabled={!canAdd}
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd()
                }}
              />
              <Button
                type="button"
                size="icon-sm"
                disabled={!canAdd || !newLabel.trim()}
                onClick={handleAdd}
                className={cn(
                  'shrink-0',
                  canAdd
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'cursor-not-allowed opacity-50',
                )}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p
              className={cn(
                'text-right text-xs',
                types.length >= MAX_EVENT_TYPES ? 'text-red-500' : 'text-gray-400',
              )}
            >
              {types.length}/{MAX_EVENT_TYPES} tipos
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
