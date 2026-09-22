import type { EventItem } from '~/types/event'
import type { EventType } from '~/utils/eventTypes'

export interface EventFilters {
  search: string
  eventType: EventType | 'all'
  country: string | 'all'
  mode: 'all' | 'online' | 'in_person'
  when: 'upcoming' | 'past' | 'all'
}

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  eventType: 'all',
  country: 'all',
  mode: 'all',
  when: 'upcoming'
}

export function useAllEvents() {
  return useFetch<EventItem[]>('/api/events', { key: 'all-events', default: () => [] })
}

export function useEvents(initialFilters: Partial<EventFilters> = {}) {
  const { data: allEvents, pending, error } = useAllEvents()
  const filters = reactive<EventFilters>({ ...DEFAULT_FILTERS, ...initialFilters })

  const events = computed(() => {
    const now = Date.now()
    let list = allEvents.value ?? []

    if (filters.when === 'upcoming') {
      list = list.filter((e) => new Date(e.endDate ?? e.startDate).getTime() >= now)
    } else if (filters.when === 'past') {
      list = list.filter((e) => new Date(e.endDate ?? e.startDate).getTime() < now)
    }

    if (filters.eventType !== 'all') {
      list = list.filter((e) => e.eventType === filters.eventType)
    }

    if (filters.country !== 'all') {
      list = list.filter((e) => e.country === filters.country)
    }

    if (filters.mode === 'online') {
      list = list.filter((e) => e.isOnline)
    } else if (filters.mode === 'in_person') {
      list = list.filter((e) => !e.isOnline)
    }

    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase()
      list = list.filter((e) =>
        [e.title, e.city, e.country, e.venueName]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term))
      )
    }

    const sorted = [...list].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    return filters.when === 'past' ? sorted.reverse() : sorted
  })

  return { events, filters, pending, error }
}

export function useEventBySlug(slug: string) {
  return useFetch<EventItem>(`/api/events/${slug}`, { key: `event-${slug}` })
}

export function uniqueCountries(events: EventItem[]): string[] {
  const unique = new Set(events.map((e) => e.country).filter(Boolean) as string[])
  return Array.from(unique).sort((a, b) => a.localeCompare(b))
}
