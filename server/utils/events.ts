import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { EventType } from '../../app/utils/eventTypes'

export interface EventRecord {
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

const CONTENT_DIR = join(process.cwd(), 'content/events')

let cache: EventRecord[] | null = null

function loadEvents(): EventRecord[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))

  const events = files.map((file): EventRecord => {
    const slug = file.replace(/\.md$/, '')
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      path: `/events/${slug}`,
      title: data.title,
      eventType: (data.eventType as EventType) ?? 'other',
      startDate: data.startDate,
      endDate: data.endDate,
      timezone: data.timezone ?? 'UTC',
      isOnline: !!data.isOnline,
      onlineUrl: data.onlineUrl,
      venueName: data.venueName,
      address: data.address,
      city: data.city,
      region: data.region,
      country: data.country,
      websiteUrl: data.websiteUrl,
      contactEmail: data.contactEmail,
      flyer: data.flyer,
      organizer: data.organizer,
      descriptionHtml: marked.parse(content.trim(), { async: false }) as string
    }
  })

  events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  return events
}

export function getAllEvents(): EventRecord[] {
  if (!cache) cache = loadEvents()
  return cache
}

export function getEventBySlug(slug: string): EventRecord | undefined {
  return getAllEvents().find((e) => e.slug === slug)
}
