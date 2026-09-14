<script setup lang="ts">
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const route = useRoute()
const { data: event, pending } = useEventByPath(route.path)

useSeoMeta({
  title: () => (event.value ? `${event.value.title} — Global Mycology Events` : 'Event — Global Mycology Events'),
  description: () => event.value?.description?.slice(0, 160) || 'A mycological event.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div v-if="pending" class="text-stone-500">Loading event…</div>
    <div v-else-if="!event" class="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
      Event not found.
      <div class="mt-4">
        <NuxtLink to="/events" class="font-medium text-moss-700 hover:underline">← Back to the calendar</NuxtLink>
      </div>
    </div>

    <article v-else class="space-y-6">
      <NuxtLink to="/events" class="text-sm font-medium text-moss-700 hover:underline">← Back to the calendar</NuxtLink>

      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="EVENT_TYPE_BADGE_CLASSES[event.eventType]">
          {{ EVENT_TYPE_LABELS[event.eventType] }}
        </span>
        <span v-if="event.isOnline" class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
          Online
        </span>
      </div>

      <h1 class="font-display text-3xl font-bold text-stone-900 sm:text-4xl">{{ event.title }}</h1>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-stone-600">
        <span class="flex items-center gap-1.5">📅 {{ formatDateTime(event.startDate) }}</span>
        <span v-if="event.endDate" class="flex items-center gap-1.5">→ {{ formatDateTime(event.endDate) }}</span>
        <span class="flex items-center gap-1.5">🌐 {{ event.timezone }}</span>
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-stone-600">
        <span v-if="event.isOnline" class="flex items-center gap-1.5">
          💻 Online event
          <a v-if="event.onlineUrl" :href="event.onlineUrl" target="_blank" rel="noopener" class="font-medium text-moss-700 hover:underline">
            Join link
          </a>
        </span>
        <span v-else class="flex items-center gap-1.5">
          📍
          <span>
            {{ [event.venueName, event.address, event.city, event.region, event.country].filter(Boolean).join(', ') }}
          </span>
        </span>
      </div>

      <img
        v-if="event.flyer"
        :src="event.flyer"
        :alt="`${event.title} flyer`"
        class="w-full max-w-md rounded-xl border border-stone-200 shadow-sm"
      />

      <ContentRenderer :value="event" class="prose prose-stone max-w-none" />

      <div class="flex flex-wrap items-center gap-4 border-t border-stone-200 pt-6 text-sm">
        <a
          v-if="event.websiteUrl"
          :href="event.websiteUrl"
          target="_blank"
          rel="noopener"
          class="font-medium text-moss-700 hover:underline"
        >
          Event website ↗
        </a>
        <a
          v-if="event.contactEmail"
          :href="`mailto:${event.contactEmail}`"
          class="font-medium text-moss-700 hover:underline"
        >
          Contact organizer
        </a>
        <span v-if="event.organizer" class="text-stone-500">Posted by {{ event.organizer }}</span>
      </div>
    </article>
  </div>
</template>
