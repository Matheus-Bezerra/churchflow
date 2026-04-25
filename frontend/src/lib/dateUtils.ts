export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min`
  if (diffHour < 24) return `há ${diffHour}h`
  if (diffDay === 1) return 'ontem'
  if (diffDay < 7) return `há ${diffDay} dias`

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatBirthday(dateString: string): string {
  const d = new Date(dateString + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

export function getDaysUntilBirthday(birthDateString: string): number {
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)

  const birth = new Date(birthDateString + 'T00:00:00')
  const thisYearBirthday = new Date(
    todayMidnight.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
  )

  if (thisYearBirthday < todayMidnight) {
    thisYearBirthday.setFullYear(todayMidnight.getFullYear() + 1)
  }

  const diff = thisYearBirthday.getTime() - todayMidnight.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function formatBirthdayCountdown(daysUntil: number): string {
  if (daysUntil === 0) return 'Hoje'
  if (daysUntil === 1) return 'Amanhã'
  return `Em ${daysUntil} dias`
}
