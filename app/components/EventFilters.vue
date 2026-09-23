<script setup lang="ts">
import type { EventFilters } from '~/composables/useEvents'
import { EVENT_TYPE_OPTIONS } from '~/utils/eventTypes'

const filters = defineModel<EventFilters>({ required: true })

defineProps<{ countries: string[] }>()
</script>

<template>
  <div class="grid gap-3 rounded-xl border border-stone-800 bg-stone-950 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
    <div class="lg:col-span-2">
      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-cream-300/50">Search</label>
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search by name, city, country…"
        class="w-full rounded-md border border-stone-700 bg-black px-3 py-2 text-sm text-cream-100 placeholder:text-cream-300/30 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
      />
    </div>

    <div>
      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-cream-300/50">Type</label>
      <select
        v-model="filters.eventType"
        class="w-full rounded-md border border-stone-700 bg-black px-3 py-2 text-sm text-cream-100 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
      >
        <option value="all">All types</option>
        <option v-for="opt in EVENT_TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <div>
      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-cream-300/50">Country</label>
      <select
        v-model="filters.country"
        class="w-full rounded-md border border-stone-700 bg-black px-3 py-2 text-sm text-cream-100 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
      >
        <option value="all">All countries</option>
        <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div>
      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-cream-300/50">Format</label>
      <select
        v-model="filters.mode"
        class="w-full rounded-md border border-stone-700 bg-black px-3 py-2 text-sm text-cream-100 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
      >
        <option value="all">Online & in-person</option>
        <option value="online">Online only</option>
        <option value="in_person">In-person only</option>
      </select>
    </div>

    <div class="sm:col-span-2 lg:col-span-5">
      <div class="inline-flex overflow-hidden rounded-md border border-stone-700 text-sm">
        <button
          type="button"
          class="px-3 py-1.5"
          :class="filters.when === 'upcoming' ? 'bg-moss-700 text-cream-100' : 'bg-black text-cream-300/70 hover:bg-stone-900'"
          @click="filters.when = 'upcoming'"
        >
          Upcoming
        </button>
        <button
          type="button"
          class="border-l border-stone-700 px-3 py-1.5"
          :class="filters.when === 'past' ? 'bg-moss-700 text-cream-100' : 'bg-black text-cream-300/70 hover:bg-stone-900'"
          @click="filters.when = 'past'"
        >
          Past
        </button>
        <button
          type="button"
          class="border-l border-stone-700 px-3 py-1.5"
          :class="filters.when === 'all' ? 'bg-moss-700 text-cream-100' : 'bg-black text-cream-300/70 hover:bg-stone-900'"
          @click="filters.when = 'all'"
        >
          All
        </button>
      </div>
    </div>
  </div>
</template>
