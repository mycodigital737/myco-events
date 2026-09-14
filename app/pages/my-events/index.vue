<script setup lang="ts">
import type { Database, MycoEvent } from '~/types/database.types'
import { EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const events = ref<MycoEvent[]>([])
const pending = ref(true)

async function load() {
  if (!user.value) {
    events.value = []
    pending.value = false
    return
  }
  pending.value = true
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.value.id)
    .order('start_date', { ascending: false })
  events.value = data ?? []
  pending.value = false
}

watch(user, load, { immediate: true })

const statusStyles: Record<string, string> = {
  approved: 'bg-moss-100 text-moss-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800'
}

async function removeEvent(id: string) {
  if (!confirm('Delete this event? This cannot be undone.')) return
  await supabase.from('events').delete().eq('id', id)
  await load()
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="font-display text-3xl font-bold text-stone-900">My Events</h1>
      <NuxtLink to="/submit" class="rounded-md bg-moss-700 px-4 py-2 text-sm font-semibold text-white hover:bg-moss-800">
        + Submit event
      </NuxtLink>
    </div>

    <div v-if="!user" class="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
      <NuxtLink to="/login" class="font-semibold underline">Sign in</NuxtLink> to see your submitted events.
    </div>
    <div v-else-if="pending" class="text-stone-500">Loading…</div>
    <div v-else-if="events.length === 0" class="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
      You haven't submitted any events yet.
    </div>

    <ul v-else class="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
      <li v-for="event in events" :key="event.id" class="flex flex-wrap items-center gap-3 p-4">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-2 py-0.5 text-xs font-semibold" :class="statusStyles[event.status]">
              {{ event.status }}
            </span>
            <span class="text-xs text-stone-400">{{ EVENT_TYPE_LABELS[event.event_type] }}</span>
          </div>
          <NuxtLink :to="`/events/${event.slug}`" class="font-medium text-stone-900 hover:text-moss-700">
            {{ event.title }}
          </NuxtLink>
          <p class="text-sm text-stone-500">{{ formatEventDateRange(event) }}</p>
        </div>
        <div class="flex shrink-0 gap-2">
          <NuxtLink
            :to="`/my-events/${event.id}/edit`"
            class="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Edit
          </NuxtLink>
          <button
            type="button"
            class="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            @click="removeEvent(event.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
