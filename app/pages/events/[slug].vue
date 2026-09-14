<script setup lang="ts">
import { EVENT_TYPE_BADGE_CLASSES, EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const route = useRoute()
const slug = route.params.slug as string
const { event, pending, error } = useEventBySlug(slug)

const flyerUrl = computed(() => flyerPublicUrl(event.value?.flyer_path))

const shareUrl = computed(() => (import.meta.client ? window.location.href : ''))

function copyLink() {
  if (import.meta.client) {
    navigator.clipboard.writeText(shareUrl.value)
  }
}

useSeoMeta({
  title: () => (event.value ? `${event.value.title} — Global Mycology Events` : 'Event — Global Mycology Events'),
  description: () => event.value?.description?.slice(0, 160) || 'A mycological event.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div v-if="pending" class="text-stone-500">Loading event…</div>
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-red-700">{{ error }}</div>
    <div v-else-if="!event" class="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
      Event not found. It may have been removed or is awaiting approval.
      <div class="mt-4">
        <NuxtLink to="/events" class="font-medium text-moss-700 hover:underline">← Back to the calendar</NuxtLink>
      </div>
    </div>

    <article v-else class="space-y-6">
      <NuxtLink to="/events" class="text-sm font-medium text-moss-700 hover:underline">← Back to the calendar</NuxtLink>

      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="EVENT_TYPE_BADGE_CLASSES[event.event_type]">
          {{ EVENT_TYPE_LABELS[event.event_type] }}
        </span>
        <span v-if="event.is_online" class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
          Online
        </span>
        <span v-if="event.status !== 'approved'" class="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          {{ event.status === 'pending' ? 'Pending review — only visible to you' : 'Not approved' }}
        </span>
      </div>

      <h1 class="font-display text-3xl font-bold text-stone-900 sm:text-4xl">{{ event.title }}</h1>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-stone-600">
        <span class="flex items-center gap-1.5">📅 {{ formatDateTime(event.start_date) }}</span>
        <span v-if="event.end_date" class="flex items-center gap-1.5">→ {{ formatDateTime(event.end_date) }}</span>
        <span class="flex items-center gap-1.5">🌐 {{ event.timezone }}</span>
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-2 text-stone-600">
        <span v-if="event.is_online" class="flex items-center gap-1.5">
          💻 Online event
          <a v-if="event.online_url" :href="event.online_url" target="_blank" rel="noopener" class="font-medium text-moss-700 hover:underline">
            Join link
          </a>
        </span>
        <span v-else class="flex items-center gap-1.5">
          📍
          <span>
            {{ [event.venue_name, event.address, event.city, event.region, event.country].filter(Boolean).join(', ') }}
          </span>
        </span>
      </div>

      <img
        v-if="flyerUrl"
        :src="flyerUrl"
        :alt="`${event.title} flyer`"
        class="w-full max-w-md rounded-xl border border-stone-200 shadow-sm"
      />

      <div class="prose prose-stone max-w-none whitespace-pre-line">
        {{ event.description }}
      </div>

      <div class="flex flex-wrap items-center gap-4 border-t border-stone-200 pt-6 text-sm">
        <a
          v-if="event.website_url"
          :href="event.website_url"
          target="_blank"
          rel="noopener"
          class="font-medium text-moss-700 hover:underline"
        >
          Event website ↗
        </a>
        <a
          v-if="event.contact_email"
          :href="`mailto:${event.contact_email}`"
          class="font-medium text-moss-700 hover:underline"
        >
          Contact organizer
        </a>
        <button type="button" class="font-medium text-stone-500 hover:text-moss-700 hover:underline" @click="copyLink">
          🔗 Copy share link
        </button>
      </div>
    </article>
  </div>
</template>
