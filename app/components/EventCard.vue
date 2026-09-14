<script setup lang="ts">
import type { MycoEvent } from '~/types/database.types'
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const props = defineProps<{ event: MycoEvent }>()

const flyerUrl = computed(() => flyerPublicUrl(props.event.flyer_path))

const dateRange = computed(() => formatEventDateRange(props.event))

const locationLabel = computed(() => {
  if (props.event.is_online) return 'Online'
  return [props.event.city, props.event.country].filter(Boolean).join(', ') || 'Location TBA'
})
</script>

<template>
  <NuxtLink
    :to="`/events/${event.slug}`"
    class="group flex overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="hidden w-32 shrink-0 items-center justify-center bg-stone-100 sm:flex">
      <img
        v-if="flyerUrl"
        :src="flyerUrl"
        :alt="`${event.title} flyer`"
        class="h-full w-full object-cover"
      />
      <span v-else class="text-4xl">🍄</span>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="EVENT_TYPE_BADGE_CLASSES[event.event_type]"
        >
          {{ EVENT_TYPE_LABELS[event.event_type] }}
        </span>
        <span v-if="event.is_online" class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
          Online
        </span>
      </div>

      <h3 class="font-display text-lg font-semibold text-stone-900 group-hover:text-moss-700">
        {{ event.title }}
      </h3>

      <div class="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
        <span class="flex items-center gap-1">📅 {{ dateRange }}</span>
        <span class="flex items-center gap-1">📍 {{ locationLabel }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
