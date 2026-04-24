import { useQuery } from '@tanstack/react-query'
import { mockDashboardStats, mockRecentActivities, getBirthdaysThisMonth } from '@/lib/mocks'
import type { DashboardStats } from '@/types/user'
import type { RecentActivity } from '@/types/schedule'
import type { User } from '@/types/user'

async function fetchDashboardStats(): Promise<DashboardStats> {
  await new Promise((r) => setTimeout(r, 300))
  return mockDashboardStats
}

async function fetchRecentActivities(): Promise<RecentActivity[]> {
  await new Promise((r) => setTimeout(r, 250))
  return mockRecentActivities
}

async function fetchBirthdays(): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 200))
  return getBirthdaysThisMonth()
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: fetchRecentActivities,
  })
}

export function useBirthdays() {
  return useQuery({
    queryKey: ['dashboard', 'birthdays'],
    queryFn: fetchBirthdays,
  })
}
