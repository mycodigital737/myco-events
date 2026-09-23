<script setup lang="ts">
const { events, filters, pending, error } = useEvents()
const { data: allEvents } = useAllEvents()

const countries = computed(() => uniqueCountries(allEvents.value ?? []))
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="font-display text-3xl font-bold text-cream-100">Global Myco Event Calendar</h1>
      <p class="mt-1 text-cream-300/70">Forays, conferences, workshops and festivals from around the world, in order starting this week.</p>
    </div>

    <div class="space-y-6">
      <EventFilters v-model="filters" :countries="countries" />

      <div v-if="pending" class="text-cream-300/60">Loading events…</div>
      <div v-else-if="error" class="rounded-md bg-red-950 p-4 text-red-300">Something went wrong loading events.</div>
      <div
        v-else-if="events.length === 0"
        class="rounded-xl border border-dashed border-stone-800 p-10 text-center text-cream-300/60"
      >
        No events match your filters.
      </div>
      <div v-else class="flex flex-col gap-3">
        <EventListItem v-for="event in events" :key="event.path" :event="event" />
      </div>
    </div>
  </div>
</template>
