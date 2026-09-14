<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const mobileOpen = ref(false)

async function signOut() {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <header class="border-b border-stone-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2 font-display text-lg font-semibold text-moss-800">
        <span aria-hidden="true">🍄</span>
        <span>Global Mycology Events</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
        <NuxtLink to="/events" class="hover:text-moss-700">Calendar</NuxtLink>
        <NuxtLink to="/submit" class="hover:text-moss-700">Submit an Event</NuxtLink>
        <NuxtLink v-if="user" to="/my-events" class="hover:text-moss-700">My Events</NuxtLink>
        <NuxtLink v-if="user" to="/admin" class="hover:text-moss-700">Admin</NuxtLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <template v-if="user">
          <span class="text-sm text-stone-500">{{ user.email }}</span>
          <button
            class="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
            @click="signOut"
          >
            Sign out
          </button>
        </template>
        <NuxtLink
          v-else
          to="/login"
          class="rounded-md bg-moss-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-moss-800"
        >
          Sign in
        </NuxtLink>
      </div>

      <button
        class="inline-flex items-center justify-center rounded-md p-2 text-stone-600 md:hidden"
        aria-label="Toggle menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="text-xl">{{ mobileOpen ? '✕' : '☰' }}</span>
      </button>
    </div>

    <div v-if="mobileOpen" class="border-t border-stone-200 bg-white md:hidden">
      <nav class="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-stone-700">
        <NuxtLink to="/events" class="rounded px-2 py-2 hover:bg-stone-100" @click="mobileOpen = false">Calendar</NuxtLink>
        <NuxtLink to="/submit" class="rounded px-2 py-2 hover:bg-stone-100" @click="mobileOpen = false">Submit an Event</NuxtLink>
        <NuxtLink v-if="user" to="/my-events" class="rounded px-2 py-2 hover:bg-stone-100" @click="mobileOpen = false">My Events</NuxtLink>
        <NuxtLink v-if="user" to="/admin" class="rounded px-2 py-2 hover:bg-stone-100" @click="mobileOpen = false">Admin</NuxtLink>
        <template v-if="user">
          <button class="rounded px-2 py-2 text-left hover:bg-stone-100" @click="signOut">Sign out</button>
        </template>
        <NuxtLink v-else to="/login" class="rounded px-2 py-2 hover:bg-stone-100" @click="mobileOpen = false">Sign in</NuxtLink>
      </nav>
    </div>
  </header>
</template>
