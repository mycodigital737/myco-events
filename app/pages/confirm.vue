<script setup lang="ts">
definePageMeta({ ssr: false })

const user = useSupabaseUser()

watch(
  user,
  (u) => {
    if (u) navigateTo('/', { replace: true })
  },
  { immediate: true }
)

// Fallback: if no session appears shortly, send the user back to login.
onMounted(() => {
  setTimeout(() => {
    if (!user.value) navigateTo('/login', { replace: true })
  }, 4000)
})
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center text-stone-600">
    <p>Signing you in…</p>
  </div>
</template>
