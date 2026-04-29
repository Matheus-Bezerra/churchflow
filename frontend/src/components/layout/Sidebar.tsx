'use client'

import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  HeartHandshakeIcon,
  LayoutDashboard,
  Network,
  Settings,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/store/useSidebarStore'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  disabled?: boolean
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/members', label: 'Membros', icon: Users },
  { href: '/ministries', label: 'Ministérios', icon: HeartHandshakeIcon },
  { href: '/events', label: 'Eventos', icon: CalendarDays },
  { href: '/schedules', label: 'Escalas', icon: ClipboardList },
  { href: '/cells', label: 'Células', icon: Network },
  { href: '/cell-meetings', label: 'Reuniões de Células', icon: CalendarPlus },
  { href: '/finance', label: 'Financeiro', icon: DollarSign, disabled: true },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebarStore()

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        'relative flex shrink-0 flex-col border-border border-r bg-card transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Floating collapse toggle — Notion/Linear style */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
        className="absolute top-5 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-accent"
      >
        {isOpen ? (
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Church branding */}
      <div className="flex h-16 items-center border-border border-b px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
            <Image
              src="/church-logo.jpg"
              alt="Logo da Igreja"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          {isOpen && (
            <div className="hidden min-w-0 sm:block">
              <p className="truncate whitespace-nowrap font-semibold text-base text-foreground">
                AD Tatuapé
              </p>
              <p className="truncate text-muted-foreground text-xs">
                Lugar de Esperança
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, disabled }) => {
          const isActive =
            !disabled && (pathname === href || pathname.startsWith(`${href}/`))

          if (disabled) {
            return (
              <Tooltip key={href}>
                <TooltipTrigger className="w-full">
                  <div
                    className={cn(
                      'flex cursor-not-allowed select-none items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-muted-foreground/60 text-sm',
                      !isOpen && 'justify-center px-0',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                    {isOpen && <span>{label}</span>}
                    {isOpen && (
                      <span className="ml-auto rounded bg-muted px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground/70">
                        Em breve
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Em breve</TooltipContent>
              </Tooltip>
            )
          }

          const link = (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                !isOpen && 'justify-center px-0',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              {isOpen && <span>{label}</span>}
            </Link>
          )

          if (!isOpen) {
            return (
              <Tooltip key={href}>
                <TooltipTrigger className="w-full">{link}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          }

          return link
        })}
      </nav>
    </aside>
  )
}
