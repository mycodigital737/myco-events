// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    preset: 'netlify'
  },

  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],

  supabase: {
    // Everything is public by default for this site; auth is only
    // enforced in-app (submitting/editing events, admin review).
    redirect: false
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Global Mycology Events',
      meta: [
        {
          name: 'description',
          content:
            'A global calendar of mycological events — forays, conferences, workshops and festivals — with flyers and posters shared by the community.'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      siteName: 'Global Mycology Events'
    }
  }
})
