<script setup lang="ts">
import type { EventItem } from '~/types/event'

const props = defineProps<{ events: EventItem[] }>()

// "YYYY-MM" — shared with a parent's month-jump dropdown so it can
// drive the same view this component's own prev/next arrows do.
const selectedMonth = defineModel<string>('selectedMonth', { required: true })

const viewYear = computed(() => Number(selectedMonth.value.split('-')[0]))
const viewMonth = computed(() => Number(selectedMonth.value.split('-')[1]) - 1) // 0-indexed

const today = new Date()

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  })
)

function setMonth(year: number, month: number) {
  selectedMonth.value = `${year}-${String(month + 1).padStart(2, '0')}`
}

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
  if (viewMonth.value === 0) setMonth(viewYear.value - 1, 11)
  else setMonth(viewYear.value, viewMonth.value - 1)
}

function nextMonth() {
  if (viewMonth.value === 11) setMonth(viewYear.value + 1, 0)
  else setMonth(viewYear.value, viewMonth.value + 1)
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// Generous — this is meant to be readable at a glance, not a compact
// list, so we'd rather let a busy day grow the row than hide entries.
const MAX_VISIBLE_PER_DAY = 6
</script>

<template>
  <div class="rounded-xl border border-stone-800 bg-stone-950 p-3 shadow-sm sm:p-4">
    <div class="mb-3 flex items-center justify-between px-1">
      <button
        type="button"
        class="rounded-md p-2 text-cream-300/70 hover:bg-stone-900"
        aria-label="Previous month"
        @click="prevMonth"
      >
        ←
      </button>
      <h2 class="font-display text-xl font-semibold text-cream-100 sm:text-2xl">{{ monthLabel }}</h2>
      <button
        type="button"
        class="rounded-md p-2 text-cream-300/70 hover:bg-stone-900"
        aria-label="Next month"
        @click="nextMonth"
      >
        →
      </button>
    </div>

    <p class="mb-2 text-center text-xs text-cream-300/40 sm:hidden">↔ Swipe to see the rest of the week</p>

    <div class="overflow-x-auto">
      <div class="min-w-[820px]">
        <div class="grid grid-cols-7 gap-1 text-center text-sm font-semibold uppercase tracking-wide text-cream-300/40">
          <div v-for="d in weekdayLabels" :key="d" class="py-1">{{ d }}</div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="day in weeks.flat()"
            :key="day.toISOString()"
            class="flex min-h-[190px] flex-col gap-1.5 rounded-lg border p-2"
            :class="[
              isCurrentMonth(day) ? 'border-stone-800' : 'border-transparent',
              isToday(day) ? 'ring-2 ring-moss-400' : ''
            ]"
          >
            <span
              class="shrink-0 text-base font-semibold"
              :class="isCurrentMonth(day) ? 'text-cream-300/70' : 'text-stone-700'"
            >
              {{ day.getDate() }}
            </span>

            <div v-if="isCurrentMonth(day) && dayEvents(day).length" class="flex flex-col gap-1">
              <NuxtLink
                v-for="event in dayEvents(day).slice(0, MAX_VISIBLE_PER_DAY)"
                :key="event.path"
                :to="event.path"
                :title="event.title"
                class="flex items-start gap-1.5 rounded px-1 py-0.5 hover:bg-stone-900"
              >
                <span class="mt-0.5 h-6 w-6 shrink-0 overflow-hidden rounded-sm">
                  <EventIcon :event="event" variant="tile" />
                </span>
                <span class="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-tight text-cream-100">{{ event.title }}</span>
              </NuxtLink>
              <span
                v-if="dayEvents(day).length > MAX_VISIBLE_PER_DAY"
                class="px-1 text-xs font-medium text-cream-300/50"
              >
                +{{ dayEvents(day).length - MAX_VISIBLE_PER_DAY }} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
