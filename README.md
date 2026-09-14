# Global Mycology Events

A community calendar for domestic and international mycological events —
forays, conferences, workshops, club meetings and festivals — where
organizers can post events with flyers/posters and share them with the
public.

Built with [Nuxt 4](https://nuxt.com) and [Supabase](https://supabase.com)
(Postgres, Auth, Storage).

## Features

- 🗓️ **Global calendar** — browse a month calendar or a filterable list of
  upcoming/past events by type, country, and online vs. in-person.
- 📄 **Event pages** — each event gets its own shareable page with the
  flyer/poster image, description, dates, location and links.
- 📬 **Public submissions** — anyone with an account can submit an event
  with a flyer upload; submissions are reviewed before going live.
- 🔐 **Passwordless auth** — sign in with an email magic link (Supabase
  Auth).
- ✅ **Moderation queue** — admins approve or reject pending submissions
  from `/admin`.
- 👤 **My Events** — organizers can view, edit and delete their own
  submissions.

## Project structure

```
app/
  components/     EventCard, EventCalendar, EventFilters, header/footer
  composables/     useEvents, useProfile (Supabase data access)
  layouts/         default layout (header + footer)
  pages/           /, /events, /events/[slug], /submit, /login, /confirm,
                   /my-events, /my-events/[id]/edit, /admin
  types/           database.types.ts — hand-written types matching the schema
  utils/           slugify, date formatting, event type labels
supabase/
  migrations/0001_init.sql   full schema, RLS policies, storage bucket
```

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
   This creates:
   - `profiles` (auto-created for each new auth user via a trigger)
   - `events` (with `pending` / `approved` / `rejected` status)
   - Row Level Security policies so the public only sees approved events,
     organizers can manage their own submissions, and only admins can
     change an event's status
   - A public `flyers` storage bucket for flyer/poster uploads
3. In **Authentication → URL Configuration**, add your site URL (and
   `http://localhost:3000` for local dev) to the redirect allow list so
   magic-link emails work.
4. Grant yourself admin access so you can review submissions — after
   signing in once on the site, run in the SQL editor:
   ```sql
   update public.profiles set is_admin = true where id = 'YOUR-USER-UUID';
   ```
   (find your user UUID under **Authentication → Users**).

## 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your project's API URL and anon
key (**Project Settings → API**):

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-public-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## 4. Build for production

```bash
npm run build
npm run preview
```

Deploy the `.output` directory to any Node host (or use `npm run generate`
for static hosting, keeping in mind the calendar/event data is always
fetched live from Supabase).

## Deploying to Netlify

This repo is pre-configured for Netlify (`netlify.toml` + a `netlify`
Nitro preset in `nuxt.config.ts`):

1. Create a new site on Netlify from this GitHub repo. Netlify will pick
   up `netlify.toml` automatically (`npm run build`, publish `dist`).
2. In **Site configuration → Environment variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
3. Trigger a deploy. Netlify builds an on-demand server function for SSR
   plus static assets — no extra configuration needed.
4. Also add your Netlify site URL to Supabase's **Authentication → URL
   Configuration** redirect allow list so magic-link sign-in works in
   production.

## Notes on moderation & RLS

- New events are inserted with `status = 'pending'` and are only visible
  to their organizer until an admin approves them.
- A database trigger (`enforce_event_status_change`) prevents anyone but
  an admin (`profiles.is_admin = true`) from changing an event's status,
  even if someone calls the API directly.
- Flyer/poster images live in the public `flyers` storage bucket; anyone
  can read them, but only signed-in users can upload, and only the owner
  can replace/delete their own files.
