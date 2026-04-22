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
  status       text not null default 'new' check (status in ('new', 'contacted', 'completed')),
  completed_by text,
  created_at   timestamptz not null default now()
);
alter table worship_requests add column if not exists completed_by text;

-- Newsletter Subscribers
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  status     text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

-- Video Testimonies
create table if not exists video_testimonies (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  video_url     text not null,
  thumbnail_url text,
  description   text,
  published     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);
-- Migrate from youtube_url → video_url if table was created under the old schema
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'video_testimonies' and column_name = 'youtube_url'
  ) then
    alter table video_testimonies rename column youtube_url to video_url;
  end if;
end $$;
alter table video_testimonies add column if not exists thumbnail_url text;
alter table video_testimonies add column if not exists autoplay boolean not null default false;
alter table video_testimonies add column if not exists muted boolean not null default false;
alter table video_testimonies add column if not exists loop boolean not null default false;
alter table video_testimonies add column if not exists overlay_opacity int not null default 0;
-- Placement flags: control where each video appears
alter table video_testimonies add column if not exists show_on_home boolean not null default true;
alter table video_testimonies add column if not exists show_on_videos boolean not null default true;

-- Instagram Posts (manually curated + auto-synced feed)
create table if not exists instagram_posts (
  id           uuid primary key default gen_random_uuid(),
  instagram_id text unique,        -- null for manually added posts
  image_url    text not null,
  post_url     text not null,
  caption      text,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);
-- Add instagram_id if the table was created before this column existed
alter table instagram_posts add column if not exists instagram_id text unique;

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
alter table video_testimonies enable row level security;
alter table instagram_posts enable row level security;

-- Events
drop policy if exists "Public read events" on events;
drop policy if exists "Auth insert events" on events;
drop policy if exists "Auth update events" on events;
drop policy if exists "Auth delete events" on events;
create policy "Public read events"   on events for select using (true);
create policy "Auth insert events"   on events for insert with check (auth.role() = 'authenticated');
create policy "Auth update events"   on events for update using (auth.role() = 'authenticated');
create policy "Auth delete events"   on events for delete using (auth.role() = 'authenticated');

-- Video testimonies
drop policy if exists "Public read video_testimonies"  on video_testimonies;
drop policy if exists "Auth insert video_testimonies"  on video_testimonies;
drop policy if exists "Auth update video_testimonies"  on video_testimonies;
drop policy if exists "Auth delete video_testimonies"  on video_testimonies;
create policy "Public read video_testimonies"  on video_testimonies for select using (published = true or auth.role() = 'authenticated');
create policy "Auth insert video_testimonies"  on video_testimonies for insert with check (auth.role() = 'authenticated');
create policy "Auth update video_testimonies"  on video_testimonies for update using (auth.role() = 'authenticated');
create policy "Auth delete video_testimonies"  on video_testimonies for delete using (auth.role() = 'authenticated');

-- Instagram posts
drop policy if exists "Public read instagram_posts"  on instagram_posts;
drop policy if exists "Auth insert instagram_posts"  on instagram_posts;
drop policy if exists "Auth update instagram_posts"  on instagram_posts;
drop policy if exists "Auth delete instagram_posts"  on instagram_posts;
create policy "Public read instagram_posts"  on instagram_posts for select using (published = true or auth.role() = 'authenticated');
create policy "Auth insert instagram_posts"  on instagram_posts for insert with check (auth.role() = 'authenticated');
create policy "Auth update instagram_posts"  on instagram_posts for update using (auth.role() = 'authenticated');
create policy "Auth delete instagram_posts"  on instagram_posts for delete using (auth.role() = 'authenticated');

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

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
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

drop policy if exists "Public read videos"  on storage.objects;
drop policy if exists "Auth upload videos"  on storage.objects;
drop policy if exists "Auth delete videos"  on storage.objects;
create policy "Public read videos"
  on storage.objects for select using (bucket_id = 'videos');
create policy "Auth upload videos"
  on storage.objects for insert
  with check (bucket_id = 'videos' and auth.role() = 'authenticated');
create policy "Auth delete videos"
  on storage.objects for delete
  using (bucket_id = 'videos' and auth.role() = 'authenticated');

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
