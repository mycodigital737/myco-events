import type { EventItem } from '~/types/event'

function dateFmt(timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone
  })
}

export function formatEventDateRange(event: Pick<EventItem, 'startDate' | 'endDate' | 'timezone'>): string {
  const fmt = dateFmt(event.timezone)
  const startStr = fmt.format(new Date(event.startDate))
  if (!event.endDate) return startStr

  const endStr = fmt.format(new Date(event.endDate))
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`
}

export function formatDateTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone
  }).format(new Date(iso))
}

export function eventDatePart(iso: string, timezone: string, part: 'weekday' | 'day' | 'month'): string {
  if (part === 'day') {
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', timeZone: timezone }).format(new Date(iso))
  }
  return new Intl.DateTimeFormat(undefined, { [part]: 'short', timeZone: timezone } as Intl.DateTimeFormatOptions).format(
    new Date(iso)
  )
}
