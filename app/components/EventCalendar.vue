<script setup lang="ts">
import type { EventItem } from '~/types/event'

const props = defineProps<{ events: EventItem[] }>()
const selectedDate = defineModel<string | null>('selectedDate', { default: null })

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

const eventsByDay = computed(() => {
  const map = new Map<string, EventItem[]>()
  for (const event of props.events) {
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : start
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
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

function eventCount(d: Date) {
  return eventsByDay.value.get(toKey(d))?.length ?? 0
}

function selectDay(d: Date) {
  const key = toKey(d)
  selectedDate.value = selectedDate.value === key ? null : key
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
</script>

<template>
  <div class="rounded-xl border border-stone-800 bg-stone-950 p-4 shadow-sm">
    <div class="mb-3 flex items-center justify-between">
      <button
        type="button"
        class="rounded-md p-1.5 text-cream-300/70 hover:bg-stone-900"
        aria-label="Previous month"
        @click="prevMonth"
      >
        ←
      </button>
      <h2 class="font-display text-base font-semibold text-cream-100">{{ monthLabel }}</h2>
      <button
        type="button"
        class="rounded-md p-1.5 text-cream-300/70 hover:bg-stone-900"
        aria-label="Next month"
        @click="nextMonth"
      >
        →
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-cream-300/40">
      <div v-for="d in weekdayLabels" :key="d" class="py-1">{{ d }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in weeks.flat()"
        :key="day.toISOString()"
        type="button"
        class="relative aspect-square rounded-md p-1 text-sm transition"
        :class="[
          isCurrentMonth(day) ? 'text-cream-200' : 'text-stone-700',
          selectedDate === toKey(day) ? 'bg-moss-700 text-cream-100' : 'hover:bg-moss-950',
          isToday(day) && selectedDate !== toKey(day) ? 'ring-1 ring-moss-400' : ''
        ]"
        @click="selectDay(day)"
      >
        <span>{{ day.getDate() }}</span>
        <span
          v-if="eventCount(day) > 0"
          class="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
          :class="selectedDate === toKey(day) ? 'bg-cream-100' : 'bg-spore-500'"
        />
      </button>
    </div>

    <button
      v-if="selectedDate"
      type="button"
      class="mt-3 text-xs font-medium text-moss-400 hover:underline"
      @click="selectedDate = null"
    >
      Clear selected date
    </button>
  </div>
</template>
