'use client'

import { Menu, Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

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
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const pageTitle =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path),
    )?.[1] ?? ''

  return (
    <header className="flex h-16 items-center gap-4 border-border border-b bg-background px-6">
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
        <h1 className="font-semibold text-foreground text-xl">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-accent focus-visible:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage />
              <AvatarFallback className="bg-primary/15 font-semibold text-primary text-xs">
                AR
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="font-medium text-foreground text-sm">
                Adilson Rossi
              </p>
              <p className="text-muted-foreground text-xs">Pastor</p>
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
