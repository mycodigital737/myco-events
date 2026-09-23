<script setup lang="ts">
const config = useRuntimeConfig()
const mobileOpen = ref(false)
</script>

<template>
  <header class="border-b border-stone-800 bg-black">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
      <NuxtLink to="/" class="font-display text-lg font-semibold text-cream-100">
        Global Myco Event Calendar
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm font-medium text-cream-300/70 md:flex">
        <NuxtLink to="/events" class="hover:text-cream-100">Calendar</NuxtLink>
        <NuxtLink to="/submit" class="hover:text-cream-100">Add an Event</NuxtLink>
        <a
          :href="`https://github.com/${config.public.githubRepo}`"
          target="_blank"
          rel="noopener"
          class="hover:text-cream-100"
        >
          GitHub
        </a>
      </nav>

      <NuxtLink
        to="/submit"
        class="hidden rounded-md bg-moss-700 px-3 py-1.5 text-sm font-medium text-cream-100 hover:bg-moss-600 md:inline-block"
      >
        Add an event
      </NuxtLink>

      <button
        class="inline-flex items-center justify-center rounded-md p-2 text-cream-300/70 md:hidden"
        aria-label="Toggle menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="text-xl">{{ mobileOpen ? '✕' : '☰' }}</span>
      </button>
    </div>

    <div v-if="mobileOpen" class="border-t border-stone-800 bg-black md:hidden">
      <nav class="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-cream-200">
        <NuxtLink to="/events" class="rounded px-2 py-2 hover:bg-stone-900" @click="mobileOpen = false">Calendar</NuxtLink>
        <NuxtLink to="/submit" class="rounded px-2 py-2 hover:bg-stone-900" @click="mobileOpen = false">Add an Event</NuxtLink>
        <a
          :href="`https://github.com/${config.public.githubRepo}`"
          target="_blank"
          rel="noopener"
          class="rounded px-2 py-2 hover:bg-stone-900"
        >
          GitHub
        </a>
      </nav>
    </div>
  </header>
</template>
