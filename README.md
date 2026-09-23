# Global Myco Event Calendar

A community calendar for domestic and international mycological events —
forays, conferences, workshops, club meetings and festivals.

Built as a **static site** with [Nuxt 4](https://nuxt.com): events are
plain markdown files in this repo, parsed at build time (via
`gray-matter` + `marked`, no database), and anyone can add one by
opening a pull request — no
database, login, or backend required.

> A Supabase-backed version (accounts, a submission form with flyer
> uploads, and an admin approval queue) is on hold for later — see
> [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
> if you want to pick that back up.

## Features

- 🗓️ **Global calendar** — browse a month calendar or a filterable list of
  upcoming/past events by type, country, and online vs. in-person.
- 📄 **Event pages** — each event gets its own shareable page with an
  optional flyer/poster image, description, dates, location and links.
- 📬 **Markdown-based submissions** — `/submit` walks anyone through
  adding an event as a pull request, with a copy-paste template and a
  pre-filled "create file on GitHub" link.
- ⚡ **Fully static** — no server, database or environment variables to
  configure. Deploys anywhere that serves static files.

## Project structure

```
content/events/*.md    One markdown file per event (frontmatter + description)
server/
  utils/events.ts       Parses content/events/*.md with gray-matter + marked
  api/events/            GET /api/events and /api/events/[slug]
app/
  components/          EventCard, EventCalendar, EventFilters, header/footer
  composables/          useEvents, useAllEvents, useEventBySlug (fetch the server API)
  layouts/              default layout (header + footer)
  pages/                /, /events, /events/[slug], /submit
  types/event.ts         EventItem shape
  utils/                 event type labels, date formatting
public/flyers/          Flyer/poster images referenced from event frontmatter
supabase/                On hold — schema for a future Supabase-backed version
```

## Adding an event

See the in-app guide at `/submit`, or directly:

1. Add a new file to `content/events/` named e.g. `2026-your-event.md`.
2. Fill in the frontmatter:

   ```yaml
   ---
   title: "Your Event Name"
   eventType: foray # foray | conference | workshop | festival | club_meeting | expo | other
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
   Everything after the frontmatter is the event description (markdown supported).
   ```

3. (Optional) drop a flyer/poster image in `public/flyers/` and reference
   it in the `flyer` field.
4. Open a pull request. Once merged, the event appears on the calendar
   automatically — no rebuild steps needed beyond the normal deploy.

For online events, set `isOnline: true` and use `onlineUrl` instead of a
venue/address/city.

## Run locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## Build a static site

```bash
npm run generate
npx serve .output/public   # preview locally
```

`npm run generate` prerenders every page — including one page per event,
discovered automatically by crawling links from the homepage and calendar
— into `.output/public` as plain HTML/CSS/JS.

## Deploying to Netlify

`netlify.toml` is already configured:

```toml
[build]
  command = "npm run generate"
  publish = ".output/public"
```

Just connect this repo to a Netlify site — no environment variables are
required for the static build.
