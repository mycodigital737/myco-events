<script setup lang="ts">
import type { Database, MycoEvent } from '~/types/database.types'
import { EVENT_TYPE_OPTIONS } from '~/utils/eventTypes'

const route = useRoute()
const id = route.params.id as string

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const original = ref<MycoEvent | null>(null)
const loading = ref(true)
const notFound = ref(false)

const form = reactive({
  title: '',
  description: '',
  event_type: 'foray',
  start_date: '',
  end_date: '',
  timezone: '',
  is_online: false,
  online_url: '',
  venue_name: '',
  address: '',
  city: '',
  region: '',
  country: '',
  website_url: '',
  contact_email: ''
})

const flyerFile = ref<File | null>(null)
const submitting = ref(false)
const errorMsg = ref<string | null>(null)

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  flyerFile.value = target.files?.[0] ?? null
}

async function load() {
  loading.value = true
  const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle()

  if (!data || data.organizer_id !== user.value?.id) {
    notFound.value = true
    loading.value = false
    return
  }

  original.value = data
  form.title = data.title
  form.description = data.description
  form.event_type = data.event_type
  form.start_date = isoToDatetimeLocal(data.start_date)
  form.end_date = isoToDatetimeLocal(data.end_date)
  form.timezone = data.timezone
  form.is_online = data.is_online
  form.online_url = data.online_url ?? ''
  form.venue_name = data.venue_name ?? ''
  form.address = data.address ?? ''
  form.city = data.city ?? ''
  form.region = data.region ?? ''
  form.country = data.country ?? ''
  form.website_url = data.website_url ?? ''
  form.contact_email = data.contact_email ?? ''

  loading.value = false
}

watch(user, load, { immediate: true })

async function handleSubmit() {
  if (!original.value) return
  errorMsg.value = null
  submitting.value = true

  try {
    let flyer_path = original.value.flyer_path

    if (flyerFile.value) {
      const ext = flyerFile.value.name.split('.').pop()
      const path = `${user.value!.id}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('flyers')
        .upload(path, flyerFile.value, { upsert: false })
      if (uploadError) throw uploadError
      flyer_path = path
    }

    const { error: updateError } = await supabase
      .from('events')
      .update({
        title: form.title,
        description: form.description,
        event_type: form.event_type as any,
        start_date: new Date(form.start_date).toISOString(),
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        timezone: form.timezone,
        is_online: form.is_online,
        online_url: form.is_online ? form.online_url || null : null,
        venue_name: form.is_online ? null : form.venue_name || null,
        address: form.is_online ? null : form.address || null,
        city: form.is_online ? null : form.city || null,
        region: form.is_online ? null : form.region || null,
        country: form.is_online ? null : form.country || null,
        website_url: form.website_url || null,
        contact_email: form.contact_email || null,
        flyer_path
      })
      .eq('id', id)

    if (updateError) throw updateError

    navigateTo('/my-events')
  } catch (err: any) {
    errorMsg.value = err.message ?? 'Something went wrong saving your event.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
    <h1 class="font-display text-3xl font-bold text-stone-900">Edit event</h1>

    <div v-if="loading" class="mt-6 text-stone-500">Loading…</div>
    <div v-else-if="notFound" class="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
      Event not found, or you don't have permission to edit it.
    </div>

    <form v-else class="mt-8 space-y-5" @submit.prevent="handleSubmit">
      <div v-if="original?.status !== 'pending'" class="rounded-md bg-stone-100 p-3 text-sm text-stone-600">
        This event is <strong>{{ original?.status }}</strong>. Editing it will not change its review status.
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Event title *</label>
        <input v-model="form.title" required type="text" class="input" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Description</label>
        <textarea v-model="form.description" rows="5" class="input"></textarea>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Event type</label>
          <select v-model="form.event_type" class="input">
            <option v-for="opt in EVENT_TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Timezone</label>
          <input v-model="form.timezone" type="text" class="input" />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Start date &amp; time *</label>
          <input v-model="form.start_date" required type="datetime-local" class="input" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">End date &amp; time</label>
          <input v-model="form.end_date" type="datetime-local" class="input" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input id="is_online" v-model="form.is_online" type="checkbox" class="h-4 w-4 rounded border-stone-300" />
        <label for="is_online" class="text-sm font-medium text-stone-700">This is an online event</label>
      </div>

      <div v-if="form.is_online">
        <label class="mb-1 block text-sm font-medium text-stone-700">Online join URL</label>
        <input v-model="form.online_url" type="url" placeholder="https://…" class="input" />
      </div>

      <template v-else>
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Venue name</label>
          <input v-model="form.venue_name" type="text" class="input" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Address</label>
          <input v-model="form.address" type="text" class="input" />
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">City</label>
            <input v-model="form.city" type="text" class="input" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Region / State</label>
            <input v-model="form.region" type="text" class="input" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Country</label>
            <input v-model="form.country" type="text" class="input" />
          </div>
        </div>
      </template>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Event website</label>
          <input v-model="form.website_url" type="url" placeholder="https://…" class="input" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Contact email</label>
          <input v-model="form.contact_email" type="email" class="input" />
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Replace flyer / poster image</label>
        <input type="file" accept="image/*" class="block w-full text-sm" @change="onFileChange" />
      </div>

      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-md bg-moss-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-moss-800 disabled:opacity-60"
        >
          {{ submitting ? 'Saving…' : 'Save changes' }}
        </button>
        <NuxtLink to="/my-events" class="rounded-md border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.input {
  @apply w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500;
}
</style>
