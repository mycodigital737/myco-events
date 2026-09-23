<script setup lang="ts">
const config = useRuntimeConfig()

const issueUrl = computed(
  () =>
    `https://github.com/${config.public.githubRepo}/issues/new?title=${encodeURIComponent('Sponsorship inquiry')}&body=${encodeURIComponent(
      'Organization name:\nWebsite:\nWhat you had in mind:\n'
    )}`
)
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
    <h1 class="font-display text-3xl font-bold text-cream-100">Become a sponsor</h1>
    <p class="mt-3 text-cream-300/70">
      The Global Myco Event Calendar is a free, open resource for the mycology
      community — no login walls, no paywalled listings. Sponsorship helps
      cover hosting and keeps it that way, and puts your organization in
      front of foragers, researchers, cultivators and event organizers
      checking the calendar worldwide.
    </p>

    <div class="mt-8 space-y-4">
      <div class="rounded-xl border border-stone-800 bg-stone-950 p-5">
        <h2 class="font-display text-lg font-semibold text-cream-100">Who this is for</h2>
        <p class="mt-2 text-sm text-cream-300/70">
          Mycological societies, cultivation and foraging suppliers, event
          organizers, publishers, or anyone whose audience overlaps with
          people planning to attend a mycology event.
        </p>
      </div>

      <div class="rounded-xl border border-stone-800 bg-stone-950 p-5">
        <h2 class="font-display text-lg font-semibold text-cream-100">Get in touch</h2>
        <p class="mt-2 text-sm text-cream-300/70">
          There's no automated checkout yet — sponsorship here is arranged
          directly. Open an inquiry on GitHub with your organization and
          what you had in mind (a footer credit, a banner, a sponsored
          listing) and we'll follow up.
        </p>
        <a
          :href="issueUrl"
          target="_blank"
          rel="noopener"
          class="mt-4 inline-block rounded-md bg-spore-600 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-spore-500"
        >
          Start a sponsorship inquiry ↗
        </a>
      </div>
    </div>
  </div>
</template>
