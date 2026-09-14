import type { MycoEvent } from '~/types/database.types'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

export function formatEventDateRange(event: Pick<MycoEvent, 'start_date' | 'end_date'>): string {
  const start = new Date(event.start_date)
  if (!event.end_date) return dateFormatter.format(start)

  const end = new Date(event.end_date)
  if (start.toDateString() === end.toDateString()) {
    return dateFormatter.format(start)
  }
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`
}

export function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
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
