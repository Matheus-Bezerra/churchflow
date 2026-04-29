'use client'

import { Mail, MessageCircle, MessageSquareMore } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User } from '@/types/user'

interface NotificationDropdownProps {
  user: User
  eventName: string
  eventDate: string
  ministryName: string
}

function normalizePhone(phone?: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

export function NotificationDropdown({
  user,
  eventName,
  eventDate,
  ministryName,
}: NotificationDropdownProps) {
  const phone = normalizePhone(user.phone)
  const hasPhone = phone.length > 0
  const hasWhatsapp = hasPhone && user.phone_is_whatsapp

  const message = `Oi ${user.name}, voce foi escalado(a) para ${ministryName} no evento ${eventName} em ${eventDate}. Confirma sua presenca?`
  const encodedMessage = encodeURIComponent(message)
  const encodedSubject = encodeURIComponent(`Confirmacao de escala - ${eventName}`)

  const whatsappLink = hasWhatsapp
    ? `https://wa.me/55${phone}?text=${encodedMessage}`
    : null
  const smsLink = hasPhone ? `sms:${phone}?body=${encodedMessage}` : null
  const emailLink = user.email
    ? `mailto:${user.email}?subject=${encodedSubject}&body=${encodedMessage}`
    : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="inline-flex h-8 items-center rounded-md border border-input bg-background px-3 font-medium text-xs">
          Notificar
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={!emailLink}
          onSelect={() => {
            if (emailLink) window.open(emailLink, '_blank', 'noopener,noreferrer')
          }}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!smsLink}
          onSelect={() => {
            if (smsLink) window.open(smsLink, '_blank', 'noopener,noreferrer')
          }}
        >
          <MessageSquareMore className="mr-2 h-4 w-4" />
          SMS
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!whatsappLink}
          onSelect={() => {
            if (whatsappLink) window.open(whatsappLink, '_blank', 'noopener,noreferrer')
          }}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
