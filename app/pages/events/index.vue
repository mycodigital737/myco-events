<script setup lang="ts">
const { events, filters, pending, error } = useEvents()
const { data: allEvents } = useAllEvents()
const selectedDate = ref<string | null>(null)

const countries = computed(() => uniqueCountries(allEvents.value ?? []))

function eventDateKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const visibleEvents = computed(() => {
  if (!selectedDate.value) return events.value
  return events.value.filter((event) => {
    const start = eventDateKey(event.startDate)
    const end = event.endDate ? eventDateKey(event.endDate) : start
    return selectedDate.value! >= start && selectedDate.value! <= end
  })
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="font-display text-3xl font-bold text-cream-100">Global Myco Event Calendar</h1>
      <p class="mt-1 text-cream-300/70">Forays, conferences, workshops and festivals from around the world.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div class="space-y-6">
        <EventCalendar v-model:selected-date="selectedDate" :events="events" />
      </div>

      <div class="space-y-6">
        <EventFilters v-model="filters" :countries="countries" />

        <div v-if="pending" class="text-cream-300/60">Loading events…</div>
        <div v-else-if="error" class="rounded-md bg-red-950 p-4 text-red-300">Something went wrong loading events.</div>
        <div
          v-else-if="visibleEvents.length === 0"
          class="rounded-xl border border-dashed border-stone-800 p-10 text-center text-cream-300/60"
        >
          No events match your filters.
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <EventCard v-for="event in visibleEvents" :key="event.path" :event="event" />
        </div>
      </div>
    </div>
  </div>
</template>
