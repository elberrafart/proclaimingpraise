-- ============================================================
-- Proclaiming Praise – Supabase Schema
-- Safe to run multiple times (idempotent)
-- ============================================================

-- Events
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  location    text not null,
  date        text not null,
  time        text not null,
  description text,
  image_url   text,
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Worship / Personal Praise Requests
create table if not exists worship_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  city        text not null,
  purpose     text not null check (purpose in ('high', 'low')),
  description text not null,
  event_month int,
  event_day   int,
  event_year  int,
  event_time  text,
  date_tbd    boolean not null default false,
  status      text not null default 'new' check (status in ('new', 'contacted', 'completed')),
  created_at  timestamptz not null default now()
);

-- Newsletter Subscribers
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  status     text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

-- Praise Reports / Testimonials
create table if not exists praise_reports (
  id         uuid primary key default gen_random_uuid(),
  quote      text not null,
  name       text not null,
  role       text not null,
  published  boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table events enable row level security;
alter table worship_requests enable row level security;
alter table newsletter_subscribers enable row level security;
alter table praise_reports enable row level security;

-- Events
drop policy if exists "Public read events" on events;
drop policy if exists "Auth insert events" on events;
drop policy if exists "Auth update events" on events;
drop policy if exists "Auth delete events" on events;
create policy "Public read events"   on events for select using (true);
create policy "Auth insert events"   on events for insert with check (auth.role() = 'authenticated');
create policy "Auth update events"   on events for update using (auth.role() = 'authenticated');
create policy "Auth delete events"   on events for delete using (auth.role() = 'authenticated');

-- Worship requests
drop policy if exists "Auth all worship_requests"    on worship_requests;
drop policy if exists "Anyone insert worship_requests" on worship_requests;
create policy "Auth all worship_requests"      on worship_requests using (auth.role() = 'authenticated');
create policy "Anyone insert worship_requests" on worship_requests for insert with check (true);

-- Newsletter
drop policy if exists "Anyone insert newsletter" on newsletter_subscribers;
drop policy if exists "Auth read newsletter"     on newsletter_subscribers;
drop policy if exists "Auth delete newsletter"   on newsletter_subscribers;
create policy "Anyone insert newsletter" on newsletter_subscribers for insert with check (true);
create policy "Auth read newsletter"     on newsletter_subscribers for select using (auth.role() = 'authenticated');
create policy "Auth delete newsletter"   on newsletter_subscribers for delete using (auth.role() = 'authenticated');

-- Praise reports
drop policy if exists "Public read published praise_reports" on praise_reports;
drop policy if exists "Auth insert praise_reports"           on praise_reports;
drop policy if exists "Public insert praise_reports"         on praise_reports;
drop policy if exists "Auth update praise_reports"           on praise_reports;
drop policy if exists "Auth delete praise_reports"           on praise_reports;
create policy "Public read published praise_reports"
  on praise_reports for select using (published = true or auth.role() = 'authenticated');
create policy "Public insert praise_reports"
  on praise_reports for insert with check (published = false);
create policy "Auth update praise_reports"
  on praise_reports for update using (auth.role() = 'authenticated');
create policy "Auth delete praise_reports"
  on praise_reports for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Storage: event image uploads
-- ============================================================
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read event-images"  on storage.objects;
drop policy if exists "Auth upload event-images"  on storage.objects;
drop policy if exists "Auth delete event-images"  on storage.objects;
create policy "Public read event-images"
  on storage.objects for select using (bucket_id = 'event-images');
create policy "Auth upload event-images"
  on storage.objects for insert
  with check (bucket_id = 'event-images' and auth.role() = 'authenticated');
create policy "Auth delete event-images"
  on storage.objects for delete
  using (bucket_id = 'event-images' and auth.role() = 'authenticated');

-- ============================================================
-- Seed: initial event and praise reports
-- Skipped if the tables already have data
-- ============================================================
insert into events (title, location, date, time, description, image_url, featured)
select
  'Public Praise Salt Creek Sunset',
  'Salt Creek Bluff Park, CA',
  'April 18, 2026',
  '6:00 PM',
  'Join us for a powerful evening of worship overlooking the Pacific Ocean as the sun sets. Bring a blanket, invite a friend, and come ready to praise.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  true
where not exists (select 1 from events);

insert into praise_reports (quote, name, role, published)
select * from (values
  ('The Salt Creek sunset praise was one of the most powerful worship experiences of my life. God showed up in such a real way.', 'Sarah M.', 'Worship Attendee', true),
  ('Proclaiming Praise has given me a community where I can grow in my faith and use my gifts to serve others.', 'David R.', 'Worship Warrior', true),
  ('I love how this ministry takes worship outside the four walls. It''s changing lives and transforming hearts.', 'Maria L.', 'Volunteer', true)
) as v(quote, name, role, published)
where not exists (select 1 from praise_reports);
