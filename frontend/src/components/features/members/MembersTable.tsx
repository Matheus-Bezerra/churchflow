'use client'

import {
  Eye,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMemberFunctions } from '@/hooks/queries/useMemberFunctions'
import { mockCells, mockMinistries } from '@/lib/mocks'
import { getAvatarFallbackStyle, getInitials } from '@/lib/utils'
import type { User } from '@/types/user'

import {
  MEMBER_PAGE_SIZE,
  MEMBER_ROLE_LABELS,
  MEMBER_STATUS_CONFIG,
} from './constants/labels'
import { MemberProfileModal } from './MemberProfileModal'

interface MembersTableProps {
  members: User[]
  isLoading: boolean
}

export function MembersTable({ members, isLoading }: MembersTableProps) {
  const [page, setPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const { data: memberFunctions = [] } = useMemberFunctions()

  const roleLabel = (roleId: string) =>
    memberFunctions.find((f) => f.id === roleId)?.label ??
    MEMBER_ROLE_LABELS[roleId] ??
    roleId

  const totalPages = Math.ceil(members.length / MEMBER_PAGE_SIZE)
  const paginated = members.slice(
    (page - 1) * MEMBER_PAGE_SIZE,
    page * MEMBER_PAGE_SIZE,
  )

  function openProfile(member: User) {
    setSelectedMember(member)
    setProfileOpen(true)
  }

  function whatsappLink(phone?: string) {
    if (!phone) return null
    const digits = phone.replace(/\D/g, '')
    if (!digits) return null
    const withCountry = digits.startsWith('55') ? digits : `55${digits}`
    return `https://wa.me/${withCountry}`
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={`skeleton-member-${i.toString()}`}
            className="h-14 w-full rounded-lg"
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {paginated.length === 0 ? (
          <div className="rounded-xl border py-12 text-center text-muted-foreground">
            Nenhum membro encontrado.
          </div>
        ) : (
          paginated.map((member) => {
            const statusCfg = MEMBER_STATUS_CONFIG[member.status]
            const hasWhatsapp = Boolean(member.phone && member.phone_is_whatsapp)
            const whatsappUrl = whatsappLink(member.phone)

            return (
              <div
                key={member.id}
                className="rounded-xl border bg-background p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback
                        className="font-semibold text-xs"
                        style={getAvatarFallbackStyle(member.avatar_color)}
                      >
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground text-sm">
                        {member.name}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-muted-foreground text-xs">
                    {roleLabel(String(member.role))}
                  </div>
                  <div className="flex items-center gap-1">
                    {hasWhatsapp ? (
                      <a
                        href={whatsappUrl ?? ''}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Chamar ${member.name} no WhatsApp`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-not-allowed text-muted-foreground/40"
                        disabled
                        aria-label="Sem telefone"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openProfile(member)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {member.status === 'active' ? (
                          <DropdownMenuItem className="text-amber-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Inativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-muted-foreground">
                Membro
              </TableHead>
              <TableHead className="hidden font-semibold text-muted-foreground md:table-cell">
                Contato
              </TableHead>

              <TableHead className="hidden font-semibold text-muted-foreground lg:table-cell">
                Função
              </TableHead>
              <TableHead className="hidden font-semibold text-muted-foreground xl:table-cell">
                Ministérios
              </TableHead>
              <TableHead className="hidden font-semibold text-muted-foreground xl:table-cell">
                Célula
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-10 text-center font-semibold text-muted-foreground">
                WhatsApp
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((member) => {
                const statusCfg = MEMBER_STATUS_CONFIG[member.status]
                const cell = mockCells.find((c) => c.id === member.cell_id)
                const ministries = mockMinistries.filter((m) =>
                  member.ministry_ids.includes(m.id),
                )

                const hasWhatsapp = Boolean(
                  member.phone && member.phone_is_whatsapp,
                )
                const whatsappUrl = whatsappLink(member.phone)

                return (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback
                            className="font-semibold text-xs"
                            style={getAvatarFallbackStyle(member.avatar_color)}
                          >
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {member.name}
                          </p>
                          <p className="text-muted-foreground text-xs md:hidden">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p className="text-foreground text-sm">
                          {member.email}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {member.phone}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {roleLabel(String(member.role))}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {ministries.slice(0, 1).map((m) => (
                          <Badge
                            key={m.id}
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${m.color}18`,
                              color: m.color,
                            }}
                          >
                            {m.name.split(' ')[0]}
                          </Badge>
                        ))}
                        {ministries.length > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            +{ministries.length - 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {cell?.name ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusCfg.className}>
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {hasWhatsapp ? (
                        <a
                          href={whatsappUrl ?? ''}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Chamar ${member.name} no WhatsApp`}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-not-allowed text-muted-foreground/40"
                          disabled
                          aria-label="Sem telefone"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfile(member)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {member.status === 'active' ? (
                            <DropdownMenuItem className="text-amber-600">
                              <UserX className="mr-2 h-4 w-4" />
                              Inativar
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-emerald-600">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Ativar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-muted-foreground text-sm">
            {members.length} membros · Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <MemberProfileModal
        member={selectedMember}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </>
  )
}
