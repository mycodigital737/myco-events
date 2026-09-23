<script setup lang="ts">
import type { EventItem } from '~/types/event'
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const props = defineProps<{ event: EventItem }>()

const dateRange = computed(() => formatEventDateRange(props.event))

const locationLabel = computed(() => {
  if (props.event.isOnline) return 'Online'
  return [props.event.city, props.event.country].filter(Boolean).join(', ') || 'Location TBA'
})
</script>

<template>
  <NuxtLink
    :to="event.path"
    class="group flex overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-700"
  >
    <div class="hidden w-32 shrink-0 items-center justify-center bg-stone-900 sm:flex">
      <img
        v-if="event.flyer"
        :src="event.flyer"
        :alt="`${event.title} flyer`"
        class="h-full w-full object-cover"
      />
      <span v-else class="text-4xl">🍄</span>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
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

      <div class="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream-300/60">
        <span class="flex items-center gap-1">📅 {{ dateRange }}</span>
        <span class="flex items-center gap-1">📍 {{ locationLabel }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
