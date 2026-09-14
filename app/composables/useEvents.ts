import type { Database, EventType, MycoEvent } from '~/types/database.types'

export interface EventFilters {
  search?: string
  eventType?: EventType | 'all'
  country?: string | 'all'
  mode?: 'all' | 'online' | 'in_person'
  when?: 'upcoming' | 'past' | 'all'
}

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  eventType: 'all',
  country: 'all',
  mode: 'all',
  when: 'upcoming'
}

export function useEvents(initialFilters: EventFilters = {}) {
  const supabase = useSupabaseClient<Database>()
  const filters = reactive<EventFilters>({ ...DEFAULT_FILTERS, ...initialFilters })

  const events = ref<MycoEvent[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchEvents() {
    pending.value = true
    error.value = null

    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'approved')

    const now = new Date().toISOString()
    if (filters.when === 'upcoming') {
      query = query.gte('start_date', now).order('start_date', { ascending: true })
    } else if (filters.when === 'past') {
      query = query.lt('start_date', now).order('start_date', { ascending: false })
    } else {
      query = query.order('start_date', { ascending: true })
    }

    if (filters.eventType && filters.eventType !== 'all') {
      query = query.eq('event_type', filters.eventType)
    }

    if (filters.country && filters.country !== 'all') {
      query = query.eq('country', filters.country)
    }

    if (filters.mode === 'online') {
      query = query.eq('is_online', true)
    } else if (filters.mode === 'in_person') {
      query = query.eq('is_online', false)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,city.ilike.%${filters.search}%,country.ilike.%${filters.search}%`
      )
    }

    const { data, error: err } = await query

    if (err) {
      error.value = err.message
      events.value = []
    } else {
      events.value = data ?? []
    }

    pending.value = false
  }

  watch(
    filters,
    () => {
      fetchEvents()
    },
    { deep: true }
  )

  onMounted(fetchEvents)

  return { events, filters, pending, error, refresh: fetchEvents }
}

export function useEventBySlug(slug: string) {
  const supabase = useSupabaseClient<Database>()
  const event = ref<MycoEvent | null>(null)
  const pending = ref(true)
  const error = ref<string | null>(null)

  async function load() {
    pending.value = true
    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (err) {
      error.value = err.message
    } else {
      event.value = data
    }
    pending.value = false
  }

  onMounted(load)

  return { event, pending, error, refresh: load }
}

export async function fetchApprovedCountries(): Promise<string[]> {
  const supabase = useSupabaseClient<Database>()
  const { data } = await supabase
    .from('events')
    .select('country')
    .eq('status', 'approved')
    .not('country', 'is', null)

  const unique = new Set((data ?? []).map((row) => row.country as string))
  return Array.from(unique).sort((a, b) => a.localeCompare(b))
}

export function flyerPublicUrl(path: string | null | undefined): string | null {
  if (!path) return null
  const supabase = useSupabaseClient<Database>()
  const { data } = supabase.storage.from('flyers').getPublicUrl(path)
  return data.publicUrl
}
