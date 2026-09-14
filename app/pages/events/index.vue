<script setup lang="ts">
const { events, filters, pending, error } = useEvents()
const countries = ref<string[]>([])
const selectedDate = ref<string | null>(null)

onMounted(async () => {
  countries.value = await fetchApprovedCountries()
})

function eventDateKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const visibleEvents = computed(() => {
  if (!selectedDate.value) return events.value
  return events.value.filter((event) => {
    const start = eventDateKey(event.start_date)
    const end = event.end_date ? eventDateKey(event.end_date) : start
    return selectedDate.value! >= start && selectedDate.value! <= end
  })
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="font-display text-3xl font-bold text-stone-900">Global Mycology Calendar</h1>
      <p class="mt-1 text-stone-600">Forays, conferences, workshops and festivals from around the world.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div class="space-y-6">
        <EventCalendar v-model:selected-date="selectedDate" :events="events" />
      </div>

      <div class="space-y-6">
        <EventFilters v-model="filters" :countries="countries" />

        <div v-if="pending" class="text-stone-500">Loading events…</div>
        <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-red-700">{{ error }}</div>
        <div
          v-else-if="visibleEvents.length === 0"
          class="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-500"
        >
          No events match your filters.
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2">
          <EventCard v-for="event in visibleEvents" :key="event.id" :event="event" />
        </div>
      </div>
    </div>
  </div>
</template>
