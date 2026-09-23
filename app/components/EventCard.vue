<script setup lang="ts">
import type { EventItem } from '~/types/event'
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const props = defineProps<{ event: EventItem }>()

const day = computed(() => eventDatePart(props.event.startDate, props.event.timezone, 'day'))
const month = computed(() => eventDatePart(props.event.startDate, props.event.timezone, 'month'))

const dateRange = computed(() => formatEventDateRange(props.event))

const locationLabel = computed(() => {
  if (props.event.isOnline) return 'Online'
  return [props.event.city, props.event.country].filter(Boolean).join(', ') || 'Location TBA'
})
</script>

<template>
  <NuxtLink
    :to="event.path"
    class="group flex flex-col overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-700"
  >
    <div class="relative h-40 w-full shrink-0 overflow-hidden bg-stone-900">
      <img
        v-if="event.flyer"
        :src="event.flyer"
        :alt="`${event.title} flyer`"
        class="h-full w-full object-cover"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-xs font-medium uppercase tracking-wide text-cream-300/30">
        No flyer
      </div>

      <div class="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-black/85 px-3 py-1.5 leading-none">
        <span class="text-[10px] font-bold uppercase tracking-wide text-spore-400">{{ month }}</span>
        <span class="font-display text-xl font-bold text-cream-100">{{ day }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="EVENT_TYPE_BADGE_CLASSES[event.eventType]"
        >
          {{ EVENT_TYPE_LABELS[event.eventType] }}
        </span>
        <span v-if="event.isOnline" class="rounded-full bg-stone-800 px-2.5 py-0.5 text-xs font-semibold text-cream-300">
          Online
        </span>
      </div>

      <h3 class="font-display text-lg font-semibold text-cream-100 group-hover:text-moss-400">
        {{ event.title }}
      </h3>

      <div class="flex flex-wrap items-center gap-2 text-xs text-cream-300/70">
        <span class="rounded-full bg-stone-900 px-2.5 py-1">{{ dateRange }}</span>
        <span class="rounded-full bg-stone-900 px-2.5 py-1">{{ locationLabel }}</span>
      </div>

      <span
        class="mt-auto inline-flex items-center justify-center rounded-md bg-moss-700 px-4 py-2 text-sm font-semibold text-cream-100 transition group-hover:bg-moss-600"
      >
        View details
      </span>
    </div>
  </NuxtLink>
</template>
