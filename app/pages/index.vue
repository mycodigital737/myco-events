<script setup lang="ts">
const { events, pending } = useEvents({ when: 'upcoming' })

const featuredEvents = computed(() => events.value.slice(0, 6))
</script>

<template>
  <div>
    <section class="border-b border-stone-800 bg-gradient-to-b from-moss-950 to-black">
      <div class="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-moss-400">
          The global mycology community, on one calendar
        </p>
        <h1 class="mx-auto max-w-3xl font-display text-4xl font-bold text-cream-100 sm:text-5xl">
          Find forays, conferences &amp; fungal festivals happening around the world
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-cream-300/70">
          A shared calendar for mycological societies, clubs and organizers to post
          events, share flyers and posters, and reach the wider community —
          domestic or international, in-person or online.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/events"
            class="rounded-md bg-moss-700 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-moss-600"
          >
            Browse the calendar
          </NuxtLink>
          <NuxtLink
            to="/submit"
            class="rounded-md border border-moss-700 bg-black px-5 py-2.5 text-sm font-semibold text-moss-300 hover:bg-moss-950"
          >
            Add an event
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="mb-6 flex items-end justify-between">
        <h2 class="font-display text-2xl font-semibold text-cream-100">Upcoming events</h2>
        <NuxtLink to="/events" class="text-sm font-medium text-moss-400 hover:underline">
          View full calendar →
        </NuxtLink>
      </div>

      <div v-if="pending" class="text-cream-300/60">Loading events…</div>
      <div v-else-if="featuredEvents.length === 0" class="rounded-xl border border-dashed border-stone-800 p-10 text-center text-cream-300/60">
        No upcoming events yet. Be the first to
        <NuxtLink to="/submit" class="font-medium text-moss-400 hover:underline">add one</NuxtLink>.
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <EventCard v-for="event in featuredEvents" :key="event.path" :event="event" />
      </div>
    </section>

    <section class="border-t border-stone-800 bg-spore-950">
      <div class="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
        <h2 class="font-display text-2xl font-semibold text-cream-100">Running a mycological event?</h2>
        <p class="mx-auto mt-2 max-w-xl text-cream-300/70">
          Post your foray, workshop, club meeting or festival — with a flyer or
          poster — and get it in front of mycologists and mushroom enthusiasts
          worldwide.
        </p>
        <NuxtLink
          to="/submit"
          class="mt-6 inline-block rounded-md bg-spore-600 px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-spore-500"
        >
          Add your event
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
