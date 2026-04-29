'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebarStore } from '@/store/useSidebarStore'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Visão Geral',
  '/members': 'Membros',
  '/ministries': 'Ministérios',
  '/schedules': 'Escalas',
  '/cells': 'Células',
  '/cell-meetings': 'Reuniões de Células',
  '/finance': 'Financeiro',
  '/settings': 'Configurações',
}

export function Header() {
  const pathname = usePathname()
  const { toggle } = useSidebarStore()

  const pageTitle =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path),
    )?.[1] ?? 'ChurchFlow'

  return (
    <header className="flex h-16 items-center gap-4 border-gray-200 border-b bg-white px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h1 className="font-semibold text-gray-900 text-xl">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Church chip */}
        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 sm:flex">
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
            <Image
              src="/church-logo.jpg"
              alt="Logo da Igreja"
              fill
              className="object-cover"
              sizes="28px"
            />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-xs leading-tight">
              AD Tatuapé
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Lugar de Esperança
            </p>
          </div>
        </div>

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100 focus-visible:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage />
              <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 text-xs">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="font-medium text-gray-900 text-sm">Adilson Rossi</p>
              <p className="text-gray-500 text-xs">Pastor</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
