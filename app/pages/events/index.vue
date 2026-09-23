<script setup lang="ts">
const { events, filters, pending, error } = useEvents()
const { data: allEvents } = useAllEvents()

const countries = computed(() => uniqueCountries(allEvents.value ?? []))
const regions = computed(() => uniqueRegions(allEvents.value ?? []))
const monthOptions = computed(() => monthOptionsFrom(allEvents.value ?? []))

const now = new Date()
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div class="mb-6">
      <h1 class="font-display text-3xl font-bold text-cream-100">Global Myco Event Calendar</h1>
      <p class="mt-1 text-cream-300/70">Forays, conferences, workshops and festivals from around the world, in order starting this week.</p>
    </div>

    <div class="space-y-6">
      <EventFilters
        v-model="filters"
        v-model:month="selectedMonth"
        :countries="countries"
        :regions="regions"
        :month-options="monthOptions"
      />

      <div v-if="pending" class="text-cream-300/60">Loading events…</div>
      <div v-else-if="error" class="rounded-md bg-red-950 p-4 text-red-300">Something went wrong loading events.</div>
      <EventCalendarGrid v-else v-model:selected-month="selectedMonth" :events="events" />
    </div>
  </div>
</template>
