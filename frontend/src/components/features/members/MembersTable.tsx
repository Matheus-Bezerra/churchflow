'use client'

import { Eye, MoreHorizontal, Pencil, UserCheck, UserX } from 'lucide-react'
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
import { mockCells, mockMinistries } from '@/lib/mocks'
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

  const totalPages = Math.ceil(members.length / MEMBER_PAGE_SIZE)
  const paginated = members.slice(
    (page - 1) * MEMBER_PAGE_SIZE,
    page * MEMBER_PAGE_SIZE,
  )

  function openProfile(member: User) {
    setSelectedMember(member)
    setProfileOpen(true)
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-600">
                Membro
              </TableHead>
              <TableHead className="hidden font-semibold text-gray-600 md:table-cell">
                Contato
              </TableHead>
              <TableHead className="hidden font-semibold text-gray-600 lg:table-cell">
                Função
              </TableHead>
              <TableHead className="hidden font-semibold text-gray-600 xl:table-cell">
                Ministérios
              </TableHead>
              <TableHead className="hidden font-semibold text-gray-600 xl:table-cell">
                Célula
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                Status
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-400"
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

                return (
                  <TableRow key={member.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 text-xs">
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {member.name}
                          </p>
                          <p className="text-gray-400 text-xs md:hidden">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p className="text-gray-700 text-sm">{member.email}</p>
                        <p className="text-gray-400 text-xs">{member.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-gray-600 text-sm">
                        {MEMBER_ROLE_LABELS[member.role]}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {ministries.slice(0, 2).map((m) => (
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
                        {ministries.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{ministries.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <span className="text-gray-500 text-sm">
                        {cell?.name ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusCfg.className}>
                        {statusCfg.label}
                      </Badge>
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
          <p className="text-gray-500 text-sm">
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
