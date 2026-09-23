<script setup lang="ts">
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const route = useRoute()
const slug = route.params.slug as string
const { data: event, pending } = useEventBySlug(slug)

useSeoMeta({
  title: () => (event.value ? `${event.value.title} — Global Myco Event Calendar` : 'Event — Global Myco Event Calendar'),
  description: () => event.value?.title ? `${event.value.title} — a mycological event.` : 'A mycological event.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div v-if="pending" class="text-cream-300/60">Loading event…</div>
    <div v-else-if="!event" class="rounded-xl border border-dashed border-stone-800 p-10 text-center text-cream-300/60">
      Event not found.
      <div class="mt-4">
        <NuxtLink to="/events" class="font-medium text-moss-400 hover:underline">← Back to the calendar</NuxtLink>
      </div>
    </div>

    <article v-else class="space-y-6">
      <NuxtLink to="/events" class="text-sm font-medium text-moss-400 hover:underline">← Back to the calendar</NuxtLink>

      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="EVENT_TYPE_BADGE_CLASSES[event.eventType]">
          {{ EVENT_TYPE_LABELS[event.eventType] }}
        </span>
        <span v-if="event.isOnline" class="rounded-full bg-stone-800 px-2.5 py-0.5 text-xs font-semibold text-cream-300">
          Online
        </span>
      </div>

      <h1 class="font-display text-3xl font-bold text-cream-100 sm:text-4xl">{{ event.title }}</h1>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-cream-300/70">
        <span class="flex items-center gap-1.5">{{ formatDateTime(event.startDate) }}</span>
        <span v-if="event.endDate" class="flex items-center gap-1.5">→ {{ formatDateTime(event.endDate) }}</span>
        <span class="flex items-center gap-1.5">{{ event.timezone }}</span>
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-cream-300/70">
        <span v-if="event.isOnline" class="flex items-center gap-1.5">
          Online event
          <a v-if="event.onlineUrl" :href="event.onlineUrl" target="_blank" rel="noopener" class="font-medium text-moss-400 hover:underline">
            Join link
          </a>
        </span>
        <span v-else class="flex items-center gap-1.5">
          <span>
            {{ [event.venueName, event.address, event.city, event.region, event.country].filter(Boolean).join(', ') }}
          </span>
        </span>
      </div>

      <img
        v-if="event.flyer"
        :src="event.flyer"
        :alt="`${event.title} flyer`"
        class="w-full max-w-md rounded-xl border border-stone-800 shadow-sm"
      />

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose prose-invert max-w-none" v-html="event.descriptionHtml" />

      <div class="flex flex-wrap items-center gap-4 border-t border-stone-800 pt-6 text-sm">
        <a
          v-if="event.websiteUrl"
          :href="event.websiteUrl"
          target="_blank"
          rel="noopener"
          class="font-medium text-moss-400 hover:underline"
        >
          Event website ↗
        </a>
        <a
          v-if="event.contactEmail"
          :href="`mailto:${event.contactEmail}`"
          class="font-medium text-moss-400 hover:underline"
        >
          Contact organizer
        </a>
        <span v-if="event.organizer" class="text-cream-300/50">Posted by {{ event.organizer }}</span>
      </div>
    </article>
  </div>
</template>
