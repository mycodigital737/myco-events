// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],

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
      siteName: 'Global Mycology Events',
      githubRepo: 'mycodigital737/myco-events'
    }
  }
})
