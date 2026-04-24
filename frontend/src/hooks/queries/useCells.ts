import { useQuery } from '@tanstack/react-query'
import { mockCells, mockUsers } from '@/lib/mocks'
import type { Cell } from '@/types/church'

async function fetchCells(): Promise<Cell[]> {
  await new Promise((r) => setTimeout(r, 300))
  return mockCells.filter((c) => !c.deleted_at)
}

export function useCells() {
  return useQuery({
    queryKey: ['cells'],
    queryFn: fetchCells,
  })
}

export function useCellsStats() {
  return useQuery({
    queryKey: ['cells', 'stats'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 250))
      const cells = mockCells.filter((c) => !c.deleted_at)
      const totalMembers = cells.reduce((sum, c) => sum + c.member_count, 0)
      const leaders = new Set(cells.map((c) => c.leader_id)).size
      const meetingsThisMonth = cells.length * 4

      return {
        total_cells: cells.length,
        total_members_in_cells: totalMembers,
        leaders,
        meetings_this_month: meetingsThisMonth,
      }
    },
  })
}

export function useLeaderName(leaderId: string): string {
  const leader = mockUsers.find((u) => u.id === leaderId)
  return leader?.name ?? 'Sem líder'
}
