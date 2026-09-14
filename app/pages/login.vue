<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const sent = ref(false)
const errorMsg = ref<string | null>(null)
const loading = ref(false)

watch(
  user,
  (u) => {
    if (u) navigateTo('/')
  },
  { immediate: true }
)

async function sendMagicLink() {
  errorMsg.value = null
  loading.value = true
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: import.meta.client ? `${window.location.origin}/confirm` : undefined
    }
  })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
  } else {
    sent.value = true
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6">
    <h1 class="font-display text-2xl font-bold text-stone-900">Sign in</h1>
    <p class="mt-2 text-center text-stone-600">
      Sign in with a magic link to submit and manage your mycological events.
    </p>

    <form v-if="!sent" class="mt-8 w-full space-y-3" @submit.prevent="sendMagicLink">
      <label class="block text-sm font-medium text-stone-700">Email address</label>
      <input
        v-model="email"
        type="email"
        required
        placeholder="you@example.com"
        class="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500"
      />
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-md bg-moss-700 px-4 py-2 text-sm font-semibold text-white hover:bg-moss-800 disabled:opacity-60"
      >
        {{ loading ? 'Sending…' : 'Send magic link' }}
      </button>
      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </form>

    <div v-else class="mt-8 rounded-md bg-moss-50 p-4 text-center text-sm text-moss-800">
      Check <strong>{{ email }}</strong> for a sign-in link.
    </div>
  </div>
</template>
