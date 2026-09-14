import type { EventItem } from '~/types/event'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

export function formatEventDateRange(event: Pick<EventItem, 'startDate' | 'endDate'>): string {
  const start = new Date(event.startDate)
  if (!event.endDate) return dateFormatter.format(start)

  const end = new Date(event.endDate)
  if (start.toDateString() === end.toDateString()) {
    return dateFormatter.format(start)
  }
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(iso))
}
