<script setup lang="ts">
import type { EventItem } from '~/types/event'
import { EVENT_TYPE_ICON_BG } from '~/utils/eventTypes'

const props = defineProps<{
  event: EventItem
  variant?: 'card' | 'tile'
}>()

const flyerFailed = ref(false)
const faviconFailed = ref(false)

// Fall back to the event's own site favicon as a stand-in logo when no
// flyer has been uploaded. Most sites serve one at this well-known path;
// if it 404s or the URL is unparseable, showFavicon below just skips it.
const faviconUrl = computed(() => {
  if (!props.event.websiteUrl) return null
  try {
    return new URL('/favicon.ico', props.event.websiteUrl).href
  } catch {
    return null
  }
})

const showFlyer = computed(() => !!props.event.flyer && !flyerFailed.value)
const showFavicon = computed(() => !showFlyer.value && !!faviconUrl.value && !faviconFailed.value)
</script>

<template>
  <img
    v-if="showFlyer"
    :src="event.flyer"
    :alt="`${event.title} flyer`"
    class="h-full w-full object-cover"
    @error="flyerFailed = true"
  />
  <div
    v-else-if="showFavicon"
    class="flex h-full w-full items-center justify-center bg-cream-100"
    :class="variant === 'tile' ? 'p-1' : 'p-4'"
  >
    <img
      :src="faviconUrl!"
      :alt="`${event.title} logo`"
      class="h-full w-full object-contain"
      @error="faviconFailed = true"
    />
  </div>
  <div v-else class="h-full w-full" :class="EVENT_TYPE_ICON_BG[event.eventType]" />
</template>
