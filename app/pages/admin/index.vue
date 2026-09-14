<script setup lang="ts">
import type { Database, MycoEvent } from '~/types/database.types'
import { EVENT_TYPE_LABELS } from '~/utils/eventTypes'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { isAdmin, pending: profilePending } = useProfile()

const filterStatus = ref<'pending' | 'approved' | 'rejected'>('pending')
const events = ref<MycoEvent[]>([])
const loading = ref(true)
const actingOn = ref<string | null>(null)

async function load() {
  loading.value = true
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', filterStatus.value)
    .order('created_at', { ascending: false })
  events.value = data ?? []
  loading.value = false
}

watch([filterStatus, isAdmin], () => {
  if (isAdmin.value) load()
}, { immediate: true })

async function setStatus(event: MycoEvent, status: 'approved' | 'rejected') {
  actingOn.value = event.id
  const { error } = await supabase.from('events').update({ status }).eq('id', event.id)
  actingOn.value = null
  if (!error) {
    events.value = events.value.filter((e) => e.id !== event.id)
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <h1 class="font-display text-3xl font-bold text-stone-900">Admin — Event Review</h1>

    <div v-if="!user" class="mt-6 rounded-md bg-amber-50 p-4 text-sm text-amber-800">
      <NuxtLink to="/login" class="font-semibold underline">Sign in</NuxtLink> as an admin to review events.
    </div>
    <div v-else-if="profilePending" class="mt-6 text-stone-500">Loading…</div>
    <div v-else-if="!isAdmin" class="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
      You don't have admin access.
    </div>

    <template v-else>
      <div class="mt-6 inline-flex overflow-hidden rounded-md border border-stone-300 text-sm">
        <button
          v-for="s in (['pending', 'approved', 'rejected'] as const)"
          :key="s"
          type="button"
          class="border-l border-stone-300 px-3 py-1.5 first:border-l-0"
          :class="filterStatus === s ? 'bg-moss-700 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'"
          @click="filterStatus = s"
        >
          {{ s }}
        </button>
      </div>

      <div v-if="loading" class="mt-6 text-stone-500">Loading events…</div>
      <div v-else-if="events.length === 0" class="mt-6 rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
        No {{ filterStatus }} events.
      </div>

      <ul v-else class="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        <li v-for="event in events" :key="event.id" class="flex flex-wrap items-center gap-3 p-4">
          <div class="min-w-0 flex-1">
            <span class="text-xs text-stone-400">{{ EVENT_TYPE_LABELS[event.event_type] }}</span>
            <NuxtLink :to="`/events/${event.slug}`" class="block font-medium text-stone-900 hover:text-moss-700">
              {{ event.title }}
            </NuxtLink>
            <p class="text-sm text-stone-500">
              {{ formatEventDateRange(event) }} · {{ event.is_online ? 'Online' : [event.city, event.country].filter(Boolean).join(', ') }}
            </p>
          </div>
          <div v-if="filterStatus === 'pending'" class="flex shrink-0 gap-2">
            <button
              type="button"
              :disabled="actingOn === event.id"
              class="rounded-md bg-moss-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-moss-800 disabled:opacity-60"
              @click="setStatus(event, 'approved')"
            >
              Approve
            </button>
            <button
              type="button"
              :disabled="actingOn === event.id"
              class="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              @click="setStatus(event, 'rejected')"
            >
              Reject
            </button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
