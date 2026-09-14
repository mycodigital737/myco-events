<script setup lang="ts">
const config = useRuntimeConfig()

const template = `---
title: "Your Event Name"
eventType: foray
startDate: "2026-10-10T09:00:00-07:00"
endDate: "2026-10-12T17:00:00-07:00"
timezone: "America/Los_Angeles"
isOnline: false
venueName: "Example Nature Center"
address: "123 Forest Rd"
city: "Portland"
region: "Oregon"
country: "United States"
websiteUrl: "https://example.org"
contactEmail: "organizer@example.org"
flyer: "/flyers/your-event.jpg"
organizer: "Your Mycological Society"
---

Describe your event here — what to expect, who it's for, what to bring.
This text (and any markdown formatting) becomes the event's description.
`

const githubNewFileUrl = computed(
  () =>
    `https://github.com/${config.public.githubRepo}/new/main/content/events?filename=your-event.md&value=${encodeURIComponent(template)}`
)

const copied = ref(false)
function copyTemplate() {
  if (import.meta.client) {
    navigator.clipboard.writeText(template)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <h1 class="font-display text-3xl font-bold text-stone-900">Add an event</h1>
    <p class="mt-2 text-stone-600">
      This calendar is powered by plain markdown files in our
      <a
        :href="`https://github.com/${config.public.githubRepo}/tree/main/content/events`"
        target="_blank"
        rel="noopener"
        class="font-medium text-moss-700 hover:underline"
        >GitHub repository</a
      >. Adding your foray, conference, workshop or festival is a two-minute
      pull request — no account or sign-in needed here, just a (free)
      GitHub account.
    </p>

    <ol class="mt-8 space-y-6">
      <li class="flex gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-700 text-sm font-bold text-white">1</span>
        <div>
          <p class="font-medium text-stone-900">Copy the event template</p>
          <p class="text-sm text-stone-600">Fill in your event's details in this frontmatter format.</p>
          <div class="relative mt-2">
            <pre class="overflow-x-auto rounded-lg bg-stone-900 p-4 text-xs leading-relaxed text-stone-100"><code>{{ template }}</code></pre>
            <button
              type="button"
              class="absolute right-2 top-2 rounded-md bg-stone-700 px-2 py-1 text-xs font-medium text-white hover:bg-stone-600"
              @click="copyTemplate"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </li>

      <li class="flex gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-700 text-sm font-bold text-white">2</span>
        <div>
          <p class="font-medium text-stone-900">Create the file on GitHub</p>
          <p class="text-sm text-stone-600">
            Click below to open a new file, pre-filled with the template, directly in
            <code class="rounded bg-stone-100 px-1 py-0.5">content/events/</code>. Rename the file to
            something like <code class="rounded bg-stone-100 px-1 py-0.5">2026-your-event-name.md</code>,
            edit the details, then scroll down and choose
            <strong>"Create a new branch and start a pull request."</strong>
          </p>
          <a
            :href="githubNewFileUrl"
            target="_blank"
            rel="noopener"
            class="mt-3 inline-block rounded-md bg-moss-700 px-4 py-2 text-sm font-semibold text-white hover:bg-moss-800"
          >
            Create event file on GitHub ↗
          </a>
        </div>
      </li>

      <li class="flex gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-700 text-sm font-bold text-white">3</span>
        <div>
          <p class="font-medium text-stone-900">(Optional) Add a flyer or poster</p>
          <p class="text-sm text-stone-600">
            Upload your flyer image to
            <code class="rounded bg-stone-100 px-1 py-0.5">public/flyers/</code>
            in the same pull request, and reference it in the
            <code class="rounded bg-stone-100 px-1 py-0.5">flyer:</code> field, e.g.
            <code class="rounded bg-stone-100 px-1 py-0.5">/flyers/your-event.jpg</code>.
          </p>
        </div>
      </li>

      <li class="flex gap-4">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-700 text-sm font-bold text-white">4</span>
        <div>
          <p class="font-medium text-stone-900">Submit the pull request</p>
          <p class="text-sm text-stone-600">
            Once it's merged, your event automatically appears on the
            <NuxtLink to="/events" class="font-medium text-moss-700 hover:underline">calendar</NuxtLink>.
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
