import {
  checkConflict,
  mockMinistries,
  mockSchedules,
  mockUnavailabilities,
  mockUsers,
} from '@/lib/mocks'
import type { Schedule } from '@/types/schedule'
import type { UserUnavailability } from '@/types/user'

// ─── checkConflict unit tests ─────────────────────────────────────────────────

describe('checkConflict', () => {
  const baseSchedule: Schedule = {
    id: 'test-sched',
    church_id: 'church-1',
    event_id: 'event-1',
    ministry_id: 'ministry-1',
    event_occurrence_date: '2026-05-04',
    name: 'Test Schedule',
    volunteers: [{ user_id: 'user-2', role: 'Vocal' }],
    status: 'pending',
    decline_reason: null,
    notes: null,
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    deleted_at: null,
  }

  it('returns true when volunteer is unavailable on the exact schedule date', () => {
    const unavailabilities: UserUnavailability[] = [
      {
        id: 'u1',
        user_id: 'user-2',
        type: 'period',
        start_date: '2026-05-04',
        end_date: '2026-05-04',
        created_at: '2025-04-01T00:00:00Z',
      },
    ]
    expect(checkConflict(baseSchedule, unavailabilities)).toBe(true)
  })

  it('returns true when schedule date falls within a multi-day unavailability range', () => {
    const unavailabilities: UserUnavailability[] = [
      {
        id: 'u2',
        user_id: 'user-2',
        type: 'period',
        start_date: '2026-05-01',
        end_date: '2026-05-10',
        created_at: '2025-04-01T00:00:00Z',
      },
    ]
    expect(checkConflict(baseSchedule, unavailabilities)).toBe(true)
  })

  it('returns false when volunteer is not in any unavailability entry', () => {
    const unavailabilities: UserUnavailability[] = [
      {
        id: 'u3',
        user_id: 'user-99',
        type: 'period',
        start_date: '2026-05-04',
        end_date: '2026-05-04',
        created_at: '2025-04-01T00:00:00Z',
      },
    ]
    expect(checkConflict(baseSchedule, unavailabilities)).toBe(false)
  })

  it('returns false when the schedule date is before the unavailability period', () => {
    const unavailabilities: UserUnavailability[] = [
      {
        id: 'u4',
        user_id: 'user-2',
        type: 'period',
        start_date: '2026-05-10',
        end_date: '2026-05-20',
        created_at: '2025-04-01T00:00:00Z',
      },
    ]
    expect(checkConflict(baseSchedule, unavailabilities)).toBe(false)
  })

  it('returns false when the schedule date is after the unavailability period', () => {
    const unavailabilities: UserUnavailability[] = [
      {
        id: 'u5',
        user_id: 'user-2',
        type: 'period',
        start_date: '2026-04-20',
        end_date: '2026-04-30',
        created_at: '2025-04-01T00:00:00Z',
      },
    ]
    expect(checkConflict(baseSchedule, unavailabilities)).toBe(false)
  })

  it('returns false when there are no unavailabilities', () => {
    expect(checkConflict(baseSchedule, [])).toBe(false)
  })
})

// ─── Mock data integrity tests ────────────────────────────────────────────────

describe('mockSchedules soft-delete filter', () => {
  it('filters out schedules with deleted_at set', () => {
    const active = mockSchedules.filter((s) => !s.deleted_at)
    const softDeleted = mockSchedules.filter((s) => s.deleted_at)

    expect(softDeleted.length).toBeGreaterThan(0)
    expect(active.length).toBeLessThan(mockSchedules.length)
    active.forEach((s) => {
      expect(s.deleted_at).toBeFalsy()
    })
  })

  it('does not include soft-deleted schedule in active list', () => {
    const deletedSchedule = mockSchedules.find((s) => s.id === 'sched-9')
    expect(deletedSchedule).toBeDefined()
    expect(deletedSchedule?.deleted_at).toBeTruthy()

    const active = mockSchedules.filter((s) => !s.deleted_at)
    expect(active.find((s) => s.id === 'sched-9')).toBeUndefined()
  })
})

describe('mockSchedules conflict detection with real data', () => {
  it('detects conflict for sched-1 (user-2 unavailable on 2026-05-03)', () => {
    const schedule = mockSchedules.find((s) => s.id === 'sched-1')!
    expect(checkConflict(schedule, mockUnavailabilities)).toBe(true)
  })

  it('detects no conflict for sched-3 (user-4 and user-12 have no unavailabilities)', () => {
    const schedule = mockSchedules.find((s) => s.id === 'sched-3')!
    expect(checkConflict(schedule, mockUnavailabilities)).toBe(false)
  })

  it('detects conflict for sched-4 (user-7 unavailable on 2026-05-24)', () => {
    const schedule = mockSchedules.find((s) => s.id === 'sched-4')!
    expect(checkConflict(schedule, mockUnavailabilities)).toBe(true)
  })
})

describe('mockSchedules include declined with reason', () => {
  it('has at least one declined schedule with a decline_reason', () => {
    const declined = mockSchedules.filter(
      (s) => s.status === 'declined' && s.decline_reason,
    )
    expect(declined.length).toBeGreaterThan(0)
  })
})

describe('mockUsers soft-delete filter', () => {
  it('filters out users with deleted_at set', () => {
    const active = mockUsers.filter((u) => !u.deleted_at)
    const softDeleted = mockUsers.filter((u) => u.deleted_at)
    expect(softDeleted.length).toBeGreaterThan(0)
    active.forEach((u) => {
      expect(u.deleted_at).toBeFalsy()
    })
  })
})

describe('mock data volunteer resolution', () => {
  it('resolves volunteer name for each active schedule', () => {
    const active = mockSchedules.filter((s) => !s.deleted_at)
    active.forEach((schedule) => {
      schedule.volunteers.forEach((v) => {
        const user = mockUsers.find((u) => u.id === v.user_id)
        expect(user).toBeDefined()
      })
    })
  })

  it('resolves ministry for each active schedule', () => {
    const active = mockSchedules.filter((s) => !s.deleted_at)
    active.forEach((schedule) => {
      const ministry = mockMinistries.find((m) => m.id === schedule.ministry_id)
      expect(ministry).toBeDefined()
    })
  })
})
