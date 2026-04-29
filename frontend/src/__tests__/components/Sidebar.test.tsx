/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import '@testing-library/jest-dom'

// Mock Next.js navigation
const mockPathname = jest.fn(() => '/dashboard')
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock Zustand store
const mockToggle = jest.fn()
let mockIsOpen = true

jest.mock('@/store/useSidebarStore', () => ({
  useSidebarStore: () => ({
    isOpen: mockIsOpen,
    toggle: mockToggle,
    open: jest.fn(),
    close: jest.fn(),
  }),
}))

// Mock shadcn tooltip — suppress TooltipContent to avoid false positives in collapsed mode
jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => (asChild ? children : <div>{children}</div>),
  TooltipContent: () => null,
}))

import { Sidebar } from '@/components/layout/Sidebar'

describe('Sidebar', () => {
  beforeEach(() => {
    mockIsOpen = true
    mockToggle.mockClear()
    mockPathname.mockReturnValue('/dashboard')
  })

  it('renders church branding text when sidebar is open', () => {
    render(<Sidebar />)
    expect(screen.getByText('AD Tatuapé')).toBeInTheDocument()
    expect(screen.getByText('Lugar de Esperança')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Sidebar />)
    expect(screen.getByText('Visão Geral')).toBeInTheDocument()
    expect(screen.getByText('Membros')).toBeInTheDocument()
    expect(screen.getByText('Ministérios')).toBeInTheDocument()
    expect(screen.getByText('Escalas')).toBeInTheDocument()
    expect(screen.getByText('Células')).toBeInTheDocument()
    expect(screen.getByText('Financeiro')).toBeInTheDocument()
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it('calls toggle when the collapse button is clicked', () => {
    render(<Sidebar />)
    const toggleBtn = screen.getByRole('button', { name: /Recolher sidebar/i })
    fireEvent.click(toggleBtn)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('hides label text when sidebar is collapsed', () => {
    mockIsOpen = false
    render(<Sidebar />)
    expect(screen.queryByText('AD Tatuapé')).not.toBeInTheDocument()
    expect(screen.queryByText('Visão Geral')).not.toBeInTheDocument()
  })

  it('shows expand button label when collapsed', () => {
    mockIsOpen = false
    render(<Sidebar />)
    expect(
      screen.getByRole('button', { name: /Expandir sidebar/i }),
    ).toBeInTheDocument()
  })

  it('highlights the active route link', () => {
    mockPathname.mockReturnValue('/dashboard')
    render(<Sidebar />)
    const dashboardLink = screen.getByRole('link', { name: /Visão Geral/i })
    expect(dashboardLink).toHaveClass('bg-primary/15')
    expect(dashboardLink).toHaveClass('text-primary')
  })

  it('does not highlight inactive route links', () => {
    mockPathname.mockReturnValue('/dashboard')
    render(<Sidebar />)
    const membersLink = screen.getByRole('link', { name: /Membros/i })
    expect(membersLink).not.toHaveClass('bg-primary/15')
  })

  it('renders sidebar with data-testid for accessibility', () => {
    render(<Sidebar />)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
