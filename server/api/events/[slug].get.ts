export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const record = slug ? getEventBySlug(slug) : undefined

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }

  return record
})
