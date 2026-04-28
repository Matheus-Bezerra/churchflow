import { clsx, type ClassValue } from "clsx"
import type { CSSProperties } from 'react'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function getAvatarFallbackStyle(color?: string): CSSProperties {
  if (!color) {
    return {
      backgroundColor: '#DBEAFE',
      color: '#1D4ED8',
    }
  }

  return {
    backgroundColor: `${color}22`,
    color,
  }
}
