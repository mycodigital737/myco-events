import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const eventSchema = z.object({
  title: z.string(),
  eventType: z
    .enum(['foray', 'conference', 'workshop', 'festival', 'club_meeting', 'expo', 'other'])
    .default('other'),

  startDate: z.string(),
  endDate: z.string().optional(),
  timezone: z.string().default('UTC'),

  isOnline: z.boolean().default(false),
  onlineUrl: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),

  websiteUrl: z.string().optional(),
  contactEmail: z.string().optional(),
  flyer: z.string().optional(),

  organizer: z.string().optional()
})

export default defineContentConfig({
  collections: {
    events: defineCollection({
      type: 'page',
      source: 'events/**/*.md',
      schema: eventSchema
    })
  }
})
