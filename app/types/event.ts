import type { EventType } from '~/utils/eventTypes'

export interface EventItem {
  slug: string
  path: string
  title: string
  eventType: EventType
  startDate: string
  endDate?: string
  timezone: string
  isOnline: boolean
  onlineUrl?: string
  venueName?: string
  address?: string
  city?: string
  region?: string
  country?: string
  websiteUrl?: string
  contactEmail?: string
  flyer?: string
  organizer?: string
  descriptionHtml: string
}
