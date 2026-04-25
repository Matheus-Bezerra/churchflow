import {
  Baby,
  Bell,
  BookOpen,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Camera,
  Church,
  Cross,
  Flame,
  Globe,
  HandHeart,
  Heart,
  HeartHandshake,
  type LucideIcon,
  MapPin,
  Megaphone,
  MessageCircle,
  Mic,
  Monitor,
  Music,
  Shield,
  Sparkles,
  Star,
  Sun,
  Ticket,
  Tv,
  Users,
} from 'lucide-react'

export const MINISTRY_ICONS = {
  Baby,
  BookOpen,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Camera,
  Church,
  Cross,
  Flame,
  Globe,
  HandHeart,
  Heart,
  HeartHandshake,
  Megaphone,
  MessageCircle,
  Mic,
  Monitor,
  Music,
  Shield,
  Sparkles,
  Star,
  Tv,
  Users,
} satisfies Record<string, LucideIcon>

export type MinistryIconName = keyof typeof MINISTRY_ICONS

export const MINISTRY_ICON_NAMES = Object.keys(
  MINISTRY_ICONS,
) as MinistryIconName[]

export function getMinistryIcon(name: MinistryIconName): LucideIcon {
  return MINISTRY_ICONS[name] ?? MINISTRY_ICONS.Church
}

export const EVENT_ICONS = {
  Baby,
  Camera,
  Bell,
  MapPin,
  Ticket,
  Calendar,
  CalendarCheck,
  Church,
  Star,
  Mic,
  Music,
  Users,
  Globe,
  Flame,
  Heart,
  BookOpen,
  Megaphone,
  MessageCircle,
  Monitor,
  Sun,
  Sparkles,
  Cross,
  Shield,
  HandHeart,
  HeartHandshake,
} satisfies Record<string, LucideIcon>

export type EventIconName = keyof typeof EVENT_ICONS

export const EVENT_ICON_NAMES = Object.keys(EVENT_ICONS) as EventIconName[]

export function getEventIcon(name: EventIconName): LucideIcon {
  return EVENT_ICONS[name] ?? EVENT_ICONS.Calendar
}
