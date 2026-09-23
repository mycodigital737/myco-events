<script setup lang="ts">
import type { EventItem } from '~/types/event'
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const props = defineProps<{ event: EventItem }>()

const weekday = computed(() => eventDatePart(props.event.startDate, props.event.timezone, 'weekday'))
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
    class="group flex gap-4 rounded-xl border border-stone-800 bg-stone-950 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-700 sm:gap-6"
  >
    <div class="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg border border-stone-800 bg-black py-2 sm:w-20">
      <span class="text-[11px] font-semibold uppercase tracking-wide text-cream-300/50">{{ weekday }}</span>
      <span class="font-display text-3xl font-bold leading-none text-cream-100 sm:text-4xl">{{ day }}</span>
      <span class="text-[11px] font-semibold uppercase tracking-wide text-cream-300/50">{{ month }}</span>
    </div>

    <div class="hidden h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-900 sm:flex">
      <img
        v-if="event.flyer"
        :src="event.flyer"
        :alt="`${event.title} flyer`"
        class="h-full w-full object-cover"
      />
      <span v-else class="px-1 text-center text-[10px] font-medium uppercase tracking-wide text-cream-300/30">No flyer</span>
    </div>

    <div class="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
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

      <h3 class="truncate font-display text-lg font-semibold text-cream-100 group-hover:text-moss-400 sm:text-xl">
        {{ event.title }}
      </h3>

      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream-300/60">
        <span>{{ dateRange }}</span>
        <span>{{ locationLabel }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
