'use client'

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Church,
  ClipboardList,
  DollarSign,
  HeartHandshakeIcon,
  LayoutDashboard,
  Network,
  Settings,
  Users,
} from 'lucide-react'
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
        'relative flex shrink-0 flex-col border-gray-200 border-r bg-white transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Floating collapse toggle — Notion/Linear style */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
        className="absolute top-5 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
      >
        {isOpen ? (
          <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center border-gray-200 border-b px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <Church className="h-4 w-4 text-white" />
          </div>
          {isOpen && (
            <span className="whitespace-nowrap font-semibold text-base text-gray-900">
              ChurchFlow
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, disabled }) => {
          const isActive =
            !disabled && (pathname === href || pathname.startsWith(href + '/'))

          if (disabled) {
            return (
              <Tooltip key={href}>
                <TooltipTrigger className="w-full">
                  <div
                    className={cn(
                      'flex cursor-not-allowed select-none items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-400 text-sm',
                      !isOpen && 'justify-center px-0',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-gray-300" />
                    {isOpen && <span>{label}</span>}
                    {isOpen && (
                      <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 font-medium text-[10px] text-gray-400">
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
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                !isOpen && 'justify-center px-0',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-500',
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
