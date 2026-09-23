import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// The events calendar UI only ever links to events in the month it
// currently has open, so Nitro's link-crawler alone can't find event
// pages outside that month at prerender time. List every event route
// explicitly so `nuxt generate` always emits a static page for each one.
const eventRoutes = readdirSync(fileURLToPath(new URL('./content/events', import.meta.url)))
  .filter((file) => file.endsWith('.md'))
  .map((file) => `/events/${file.replace(/\.md$/, '')}`)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  nitro: {
    prerender: {
      routes: eventRoutes
    }
  },

  app: {
    head: {
      title: 'Global Myco Event Calendar',
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
      siteName: 'Global Myco Event Calendar',
      githubRepo: 'mycodigital737/myco-events'
    }
  }
})
