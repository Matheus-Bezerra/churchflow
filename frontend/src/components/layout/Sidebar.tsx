'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Music,
  Calendar,
  Network,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Church,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/store/useSidebarStore'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  disabled?: boolean
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Membros', icon: Users },
  { href: '/ministries', label: 'Ministérios', icon: Music },
  { href: '/schedules', label: 'Escalas', icon: Calendar },
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
        'relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shrink-0',
        isOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Floating collapse toggle — Notion/Linear style */}
      <button
        onClick={toggle}


    aria-label={isOpen ? 'Recolher sidebar' : 'Expandir sidebar'}
        className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
      >
        {isOpen ? (
          <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <Church className="h-4 w-4 text-white" />
          </div>
          {isOpen && (
            <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
              ChurchFlow
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, disabled }) => {
          const isActive = !disabled && (pathname === href || pathname.startsWith(href + '/'))

          if (disabled) {
            return (
              <Tooltip key={href}>
                <TooltipTrigger className="w-full">
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed select-none',
                      !isOpen && 'justify-center px-0',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-gray-300" />
                    {isOpen && <span>{label}</span>}
                    {isOpen && (
                      <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
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
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
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
