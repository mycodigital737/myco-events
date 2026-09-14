<template>
  <footer class="border-t border-stone-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-500 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          🍄 A community calendar of forays, conferences, workshops and festivals
          for mycology enthusiasts and societies worldwide.
        </p>
        <div class="flex gap-4">
          <NuxtLink to="/events" class="hover:text-moss-700">Browse Events</NuxtLink>
          <NuxtLink to="/submit" class="hover:text-moss-700">Submit an Event</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
