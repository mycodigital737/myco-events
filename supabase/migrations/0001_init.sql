-- Global Mycology Events — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- for a fresh project.

-- ─────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- profiles
-- One row per auth user. Created automatically on signup.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Anonymous',
  organization text,
  website_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- events
-- ─────────────────────────────────────────────────────────────
create type public.event_type as enum (
  'foray',
  'conference',
  'workshop',
  'festival',
  'club_meeting',
  'expo',
  'other'
);

create type public.event_status as enum (
  'pending',
  'approved',
  'rejected'
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null default '',
  event_type public.event_type not null default 'other',
  status public.event_status not null default 'pending',

  start_date timestamptz not null,
  end_date timestamptz,
  timezone text not null default 'UTC',

  is_online boolean not null default false,
  online_url text,
  venue_name text,
  address text,
  city text,
  region text,
  country text,
  country_code text,

  website_url text,
  contact_email text,
  flyer_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint online_or_location check (
    is_online = true or (city is not null or venue_name is not null or country is not null)
  )
);

create index if not exists events_start_date_idx on public.events (start_date);
create index if not exists events_status_idx on public.events (status);
create index if not exists events_country_idx on public.events (country);
create index if not exists events_event_type_idx on public.events (event_type);

alter table public.events enable row level security;

-- Public can see approved events; organizers can always see their own.
create policy "Approved events are public"
  on public.events for select
  using (status = 'approved' or organizer_id = auth.uid());

-- Any signed-in user can submit an event, as themselves.
create policy "Signed-in users can submit events"
  on public.events for insert
  with check (auth.uid() = organizer_id);

-- Organizers can update their own events; admins can update any.
create policy "Organizers or admins can update events"
  on public.events for update
  using (
    organizer_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Organizers can delete their own events; admins can delete any.
create policy "Organizers or admins can delete events"
  on public.events for delete
  using (
    organizer_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Only admins may change an event's status away from 'pending'.
-- (Organizers can still edit their own pending event's other fields.)
create or replace function public.enforce_event_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin) then
      raise exception 'Only an admin can change an event''s review status';
    end if;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_event_update on public.events;
create trigger on_event_update
  before update on public.events
  for each row execute procedure public.enforce_event_status_change();

-- ─────────────────────────────────────────────────────────────
-- Storage: flyers / posters bucket
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('flyers', 'flyers', true)
on conflict (id) do nothing;

create policy "Flyer images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'flyers');

create policy "Signed-in users can upload flyers"
  on storage.objects for insert
  with check (bucket_id = 'flyers' and auth.role() = 'authenticated');

create policy "Owners can update or delete their own flyer files"
  on storage.objects for update
  using (bucket_id = 'flyers' and owner = auth.uid());

create policy "Owners can delete their own flyer files"
  on storage.objects for delete
  using (bucket_id = 'flyers' and owner = auth.uid());
