'use client'

import { Pencil, Plus, Settings2, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import {
  useCreateMemberFunction,
  useDeleteMemberFunction,
  useUpdateMemberFunction,
} from '@/hooks/mutations/useMemberFunctions'
import type { MemberFunction } from '@/types/user'

const MAX_MEMBER_FUNCTIONS = 10

interface MemberFunctionManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  functions: MemberFunction[]
}

export function MemberFunctionManager({
  open,
  onOpenChange,
  functions,
}: MemberFunctionManagerProps) {
  const [newLabel, setNewLabel] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  const createFn = useCreateMemberFunction()
  const updateFn = useUpdateMemberFunction()
  const deleteFn = useDeleteMemberFunction()

  const activeCount = functions.length
  const canAdd = activeCount < MAX_MEMBER_FUNCTIONS

  const byId = useMemo(() => {
    return Object.fromEntries(functions.map((f) => [f.id, f]))
  }, [functions])

  function handleAdd() {
    const trimmed = newLabel.trim()
    if (!trimmed || !canAdd) return
    createFn.mutate({ label: trimmed })
    setNewLabel('')
  }

  function startEdit(fn: MemberFunction) {
    if (fn.is_default) return
    setEditingId(fn.id)
    setEditLabel(fn.label)
  }

  function commitEdit() {
    if (!editingId) return
    const trimmed = editLabel.trim()
    if (!trimmed) return
    const fn = byId[editingId]
    if (!fn || fn.is_default) return
    updateFn.mutate({ id: editingId, label: trimmed })
    setEditingId(null)
    setEditLabel('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditLabel('')
  }

  function handleDelete(id: string) {
    const fn = byId[id]
    if (!fn || fn.is_default) return
    deleteFn.mutate({ id })
  }

  const isBusy = createFn.isPending || updateFn.isPending || deleteFn.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-semibold text-gray-900">
            <Settings2 className="h-4 w-4" />
            Gerenciar funções de membro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
            {functions.map((fn) => {
              const isEditing = editingId === fn.id
              return (
                <li key={fn.id} className="flex items-center gap-2 px-3 py-2">
                  {isEditing ? (
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
                        disabled={isBusy}
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isBusy}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-800 text-sm">
                        {fn.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {fn.is_default && (
                          <Badge className="bg-gray-100 text-[10px] text-gray-500">
                            Padrão
                          </Badge>
                        )}
                        <button
                          type="button"
                          onClick={() => startEdit(fn)}
                          disabled={fn.is_default || isBusy}
                          className={cn(
                            'rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                            (fn.is_default || isBusy) &&
                              'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400',
                          )}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(fn.id)}
                          disabled={fn.is_default || isBusy}
                          className={cn(
                            'rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500',
                            (fn.is_default || isBusy) &&
                              'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400',
                          )}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Nova função..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                disabled={!canAdd || isBusy}
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd()
                }}
              />
              <Button
                type="button"
                size="icon-sm"
                disabled={!canAdd || !newLabel.trim() || isBusy}
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
                activeCount >= MAX_MEMBER_FUNCTIONS
                  ? 'text-red-500'
                  : 'text-gray-400',
              )}
            >
              {activeCount}/{MAX_MEMBER_FUNCTIONS} funções
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

