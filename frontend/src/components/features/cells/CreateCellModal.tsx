'use client'

import { Check, ChevronDown, Star, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WEEK_DAYS } from '@/constants/days'
import { useCreateCell } from '@/hooks/mutations/useCreateCell'
import { mockUsers } from '@/lib/mocks'
import { cn, getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { User } from '@/types/user'

interface CreateCellModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MultiSelectProps {
  options: User[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () =>
      options.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  )
  const selected = options.filter((user) => value.includes(user.id))

  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((item) => item !== id) : [...value, id],
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open && 'ring-2 ring-ring',
        )}
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          selected.map((user) => (
            <span
              key={user.id}
              className="flex items-center gap-1 rounded-full bg-muted py-0.5 pr-1.5 pl-1 text-foreground text-xs"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback
                  className="text-[8px]"
                  style={getAvatarFallbackStyle(user.avatar_color)}
                >
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {user.name.split(' ')[0]}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(value.filter((item) => item !== user.id))
                }}
                className="ml-0.5 rounded-full hover:text-foreground"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))
        )}
        <ChevronDown
          className={cn(
            'ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setOpen(false)
              setSearch('')
            }}
          />
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
            <div className="border-b p-2">
              <Input
                autoFocus
                placeholder="Buscar..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <ul className="max-h-52 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <li className="py-4 text-center text-muted-foreground text-xs">
                  Nenhum resultado
                </li>
              ) : (
                filtered.map((user) => {
                  const checked = value.includes(user.id)
                  return (
                    <li key={user.id}>
                      <button
                        type="button"
                        onClick={() => toggle(user.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent',
                          checked && 'bg-accent/50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                            checked
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-input',
                          )}
                        >
                          {checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback
                            className="text-[10px]"
                            style={getAvatarFallbackStyle(user.avatar_color)}
                          >
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-left">{user.name}</span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export function CreateCellModal({ open, onOpenChange }: CreateCellModalProps) {
  const { mutate, isPending } = useCreateCell()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [meetingDay, setMeetingDay] = useState<string>(WEEK_DAYS[3])
  const [meetingTime, setMeetingTime] = useState('19:30')
  const [leaderIds, setLeaderIds] = useState<string[]>([])
  const [primaryLeaderId, setPrimaryLeaderId] = useState<string | undefined>()
  const [memberIds, setMemberIds] = useState<string[]>([])

  const leaders = useMemo(
    () =>
      mockUsers.filter(
        (user) =>
          !user.deleted_at &&
          ['leader', 'pastor', 'elder', 'deacon'].includes(user.role),
      ),
    [],
  )
  const members = useMemo(
    () =>
      mockUsers.filter(
        (user) => !user.deleted_at && user.status !== 'inactive',
      ),
    [],
  )
  const selectedLeaders = leaders.filter((leader) =>
    leaderIds.includes(leader.id),
  )

  function resetState() {
    setName('')
    setAddress('')
    setMeetingDay(WEEK_DAYS[3])
    setMeetingTime('19:30')
    setLeaderIds([])
    setPrimaryLeaderId(undefined)
    setMemberIds([])
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetState()
    }
    onOpenChange(nextOpen)
  }

  function handleSubmit() {
    if (!name.trim() || leaderIds.length === 0) {
      return
    }

    const normalizedPrimary =
      primaryLeaderId && leaderIds.includes(primaryLeaderId)
        ? primaryLeaderId
        : leaderIds[0]

    mutate(
      {
        church_id: 'church-1',
        name: name.trim(),
        leader_id: normalizedPrimary,
        leader_ids: leaderIds,
        primary_leader_id: normalizedPrimary,
        member_ids: memberIds,
        meeting_day: meetingDay,
        meeting_time: meetingTime,
        address: address.trim() || undefined,
        member_count: memberIds.length,
      },
      {
        onSuccess: () => handleOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <DialogTitle className="font-bold text-foreground text-xl">
            Nova Célula
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Defina os dados da célula, liderança e membros iniciais.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="cell-name">Nome da Célula *</Label>
            <Input
              id="cell-name"
              placeholder="Ex.: Célula Esperança"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell-address">Endereço de Reunião</Label>
            <Input
              id="cell-address"
              placeholder="Rua, número"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Dia da semana *</Label>
              <Select
                value={meetingDay}
                onValueChange={(value) => setMeetingDay(value ?? WEEK_DAYS[3])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cell-time">Horário *</Label>
              <Input
                id="cell-time"
                type="time"
                value={meetingTime}
                onChange={(event) => setMeetingTime(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Líderes *</Label>
            <MultiSelect
              options={leaders}
              value={leaderIds}
              onChange={(value) => {
                setLeaderIds(value)
                if (primaryLeaderId && !value.includes(primaryLeaderId)) {
                  setPrimaryLeaderId(undefined)
                }
              }}
              placeholder="Selecione um ou mais líderes"
            />
          </div>

          <div className="space-y-2">
            <Label>Líder principal</Label>
            {selectedLeaders.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                Selecione líderes para definir o principal.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedLeaders.map((leader) => {
                  const isPrimary = primaryLeaderId === leader.id
                  return (
                    <button
                      key={leader.id}
                      type="button"
                      onClick={() =>
                        setPrimaryLeaderId(isPrimary ? undefined : leader.id)
                      }
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                        isPrimary
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'
                          : 'border-input hover:bg-accent/50',
                      )}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={leader.avatar_url} />
                        <AvatarFallback
                          className="text-[10px]"
                          style={getAvatarFallbackStyle(leader.avatar_color)}
                        >
                          {getInitials(leader.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{leader.name}</span>
                      <Star
                        className={cn(
                          'h-4 w-4',
                          isPrimary
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-muted-foreground',
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Membros</Label>
            <MultiSelect
              options={members}
              value={memberIds}
              onChange={setMemberIds}
              placeholder="Selecione os membros da célula"
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t px-6 pt-4 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isPending || !name.trim() || leaderIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {isPending ? 'Criando...' : 'Criar Célula'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
