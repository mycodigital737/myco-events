<script setup lang="ts">
import type { EventItem } from '~/types/event'
import { EVENT_TYPE_ICON_BG } from '~/utils/eventTypes'

const props = defineProps<{ events: EventItem[] }>()

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  })
)

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Bucket events onto every local calendar day they span, using each
// event's own timezone so a day's contents match what that event's
// organizer intended, not the viewer's local offset.
const eventsByDay = computed(() => {
  const map = new Map<string, EventItem[]>()

  for (const event of props.events) {
    const startKey = eventDatePartsKey(event.startDate, event.timezone)
    const endKey = event.endDate ? eventDatePartsKey(event.endDate, event.timezone) : startKey

    const cursor = new Date(`${startKey}T00:00:00`)
    const last = new Date(`${endKey}T00:00:00`)
    let guard = 0
    while (cursor.getTime() <= last.getTime() && guard < 60) {
      const key = toKey(cursor)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
      cursor.setDate(cursor.getDate() + 1)
      guard++
    }
  }
  return map
})

const weeks = computed(() => {
  const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1)
  const startOffset = firstOfMonth.getDay() // 0 = Sunday
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(gridStart.getDate() - startOffset)

  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    days.push(d)
  }

  const result = []
  for (let i = 0; i < 6; i++) {
    result.push(days.slice(i * 7, i * 7 + 7))
  }
  return result
})

function isCurrentMonth(d: Date) {
  return d.getMonth() === viewMonth.value
}

function isToday(d: Date) {
  return toKey(d) === toKey(today)
}

function dayEvents(d: Date) {
  return eventsByDay.value.get(toKey(d)) ?? []
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_ICONS_PER_DAY = 3
</script>

<template>
  <div class="rounded-xl border border-stone-800 bg-stone-950 p-3 shadow-sm sm:p-4">
    <div class="mb-3 flex items-center justify-between px-1">
      <button
        type="button"
        class="rounded-md p-1.5 text-cream-300/70 hover:bg-stone-900"
        aria-label="Previous month"
        @click="prevMonth"
      >
        ←
      </button>
      <h2 class="font-display text-lg font-semibold text-cream-100">{{ monthLabel }}</h2>
      <button
        type="button"
        class="rounded-md p-1.5 text-cream-300/70 hover:bg-stone-900"
        aria-label="Next month"
        @click="nextMonth"
      >
        →
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-cream-300/40 sm:text-xs">
      <div v-for="d in weekdayLabels" :key="d" class="py-1">{{ d }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="day in weeks.flat()"
        :key="day.toISOString()"
        class="flex min-h-[72px] flex-col gap-1 rounded-lg border p-1 sm:min-h-[104px] sm:p-1.5"
        :class="[
          isCurrentMonth(day) ? 'border-stone-800' : 'border-transparent',
          isToday(day) ? 'ring-1 ring-moss-400' : ''
        ]"
      >
        <span
          class="text-xs font-medium"
          :class="isCurrentMonth(day) ? 'text-cream-300/60' : 'text-stone-700'"
        >
          {{ day.getDate() }}
        </span>

        <div v-if="isCurrentMonth(day) && dayEvents(day).length" class="flex flex-wrap gap-1">
          <NuxtLink
            v-for="event in dayEvents(day).slice(0, MAX_ICONS_PER_DAY)"
            :key="event.path"
            :to="event.path"
            :title="event.title"
            class="block h-7 w-7 shrink-0 overflow-hidden rounded-md border border-stone-700 transition hover:scale-105 sm:h-9 sm:w-9"
          >
            <img
              v-if="event.flyer"
              :src="event.flyer"
              :alt="`${event.title} flyer`"
              class="h-full w-full object-cover"
            />
            <span v-else class="block h-full w-full" :class="EVENT_TYPE_ICON_BG[event.eventType]" />
          </NuxtLink>
          <span
            v-if="dayEvents(day).length > MAX_ICONS_PER_DAY"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-900 text-[10px] font-semibold text-cream-300/60 sm:h-9 sm:w-9"
          >
            +{{ dayEvents(day).length - MAX_ICONS_PER_DAY }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
