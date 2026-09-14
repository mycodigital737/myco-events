import type { Database, Profile } from '~/types/database.types'

export function useProfile() {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const profile = ref<Profile | null>(null)
  const pending = ref(false)

  async function load() {
    if (!user.value) {
      profile.value = null
      return
    }
    pending.value = true
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()
    profile.value = data
    pending.value = false
  }

  watch(user, load, { immediate: true })

  const isAdmin = computed(() => profile.value?.is_admin === true)

  return { profile, pending, isAdmin, refresh: load }
}
