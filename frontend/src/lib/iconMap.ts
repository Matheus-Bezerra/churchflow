import {
  Music,
  Monitor,
  Heart,
  BookOpen,
  Baby,
  Flame,
  Megaphone,
  Globe,
  Users,
  Star,
  Cross,
  Mic,
  Camera,
  Tv,
  type LucideIcon,
} from 'lucide-react'

export const MINISTRY_ICONS: Record<string, LucideIcon> = {
  Music,
  Monitor,
  Heart,
  BookOpen,
  Baby,
  Flame,
  Megaphone,
  Globe,
  Users,
  Star,
  Mic,
  Camera,
  Tv,
}

export const MINISTRY_ICON_NAMES = Object.keys(MINISTRY_ICONS) as Array<
  keyof typeof MINISTRY_ICONS
>

export function getMinistryIcon(name: string): LucideIcon {
  return MINISTRY_ICONS[name] ?? Music
}
