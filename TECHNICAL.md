# Proclaiming Praise — Technical Documentation

> Last updated: June 2026  
> Author: Tonny Luganda  
> Live site: [proclaimingpraise.org](https://proclaimingpraise.org)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [Authentication](#6-authentication)
7. [Server Actions](#7-server-actions)
8. [Email System](#8-email-system)
9. [Spam Protection](#9-spam-protection)
10. [SEO & Metadata](#10-seo--metadata)
11. [Public Pages](#11-public-pages)
12. [Admin Portal](#12-admin-portal)
13. [Key Components](#13-key-components)
14. [Event Registration System](#14-event-registration-system)
15. [Instagram Auto-Sync](#15-instagram-auto-sync)
16. [File Upload (Event Images)](#16-file-upload-event-images)
17. [CSV Exports](#17-csv-exports)
18. [Deployment](#18-deployment)
19. [Known Limitations & Backlog](#19-known-limitations--backlog)

---

## 1. Project Overview

Proclaiming Praise is a 501(c)(3) worship ministry based in Southern California. This codebase is the ministry's full public website and internal admin portal, built as a single Next.js application.

**What the site does:**
- Publishes upcoming worship events with full registration support (walk-in, free RSVP, paid tickets)
- Collects and displays praise reports / testimonials from the community
- Manages a Stay Connected community list (newsletter subscribers)
- Accepts worship requests from the public
- Displays video testimonies via YouTube embed
- Syncs and displays the ministry's Instagram feed
- Sends transactional email notifications to admin and users on form submissions
- Provides a password-protected admin portal to manage all of the above

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.2 | App Router, Server Actions, Edge runtime for OG image |
| UI | React | 19 | Server + client components |
| Styling | Tailwind CSS | v4 | `@theme inline` tokens in `globals.css` (no config file) |
| Database | Supabase (PostgreSQL) | latest | Hosted; Row Level Security on all tables |
| Auth | Supabase Auth | — | Email/password; session via SSR cookies |
| Storage | Supabase Storage | — | `event-images` bucket (public) |
| Email | Resend | ^6.12 | Transactional email via REST API |
| Icons | lucide-react | ^1.7 | Tree-shaken SVG icons |
| QR Codes | qrcode | — | Server-side PNG generation |
| Language | TypeScript | — | Strict mode; full DB type coverage in `types/database.ts` |
| Hosting | Vercel | — | Automatic deploys from GitHub; Cron jobs via `vercel.json` |

---

## 3. Architecture

### Full-stack in one process

Next.js runs both the frontend and backend. There is no separate API server. All database mutations go through **Server Actions** (`src/app/actions/`). Data fetching for server-rendered pages happens directly in `async` page components via the Supabase server client.

```
Browser
  └── Next.js (Vercel)
        ├── React Server Components  →  fetch data from Supabase
        ├── Server Actions           →  mutate data in Supabase
        │     └── src/lib/email.ts   →  send emails via Resend
        └── API Routes               →  Cron (Instagram sync), CSV exports
              └── Supabase service client (bypasses RLS)
```

### Request flow — public form submission

```
User fills form
  → Client component calls Server Action
      → Honeypot check (spam protection)
      → Supabase insert
      → revalidatePath (purge Next.js cache for affected pages)
      → sendEmail (fire-and-forget via Resend)
  → UI updates (success state)
```

### Request flow — admin page

```
Browser hits /admin/*
  → middleware (proxy.ts) checks Supabase session cookie
      → no session → redirect to /admin/login
      → session valid → render (protected) layout
          → async page component fetches data directly from Supabase
```

### Caching

Next.js App Router caches `fetch` calls and page renders. Server Actions call `revalidatePath()` after mutations to purge the relevant cached pages. Key revalidation targets:

| Mutation | Paths revalidated |
|---|---|
| Create / update / delete event | `/`, `/events`, `/events/[id]` |
| RSVP submitted | `/events`, `/events/[id]`, `/admin/event-rsvps` |
| RSVP deleted | `/events`, `/events/[id]`, `/admin/event-rsvps` |
| Praise report changes | `/`, `/admin/praise-reports` |
| Video changes | `/`, `/videos`, `/admin/videos` |
| Instagram changes | `/`, `/admin/instagram` |

---

## 4. Environment Variables

| Variable | Required | Where to get it | Used in |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase → Settings → API | Client + Server Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase → Settings → API | Client + Server Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase → Settings → API | Service client (bypasses RLS) — CSV export, cron |
| `INSTAGRAM_ACCESS_TOKEN` | ✅ | Meta Developer Console | Instagram sync API calls |
| `CRON_SECRET` | ✅ | Any random string | Secures `/api/sync-instagram` endpoint |
| `RESEND_API_KEY` | ✅ | resend.com → API Keys | All outgoing email |
| `RESEND_FROM` | ✅ | Your verified Resend domain | Email "from" address |
| `ADMIN_EMAIL` | ✅ | Any email address | Destination for admin notification emails |

> `NEXT_PUBLIC_*` variables are safe to expose to the browser. All others must remain server-only.

**Local development:** Copy `.env.local.example` to `.env.local` and fill in values.  
**Production:** Set all variables in Vercel project → Settings → Environment Variables.

---

## 5. Database Schema

All tables live in a single Supabase (PostgreSQL) project. The full idempotent schema is in `supabase/schema.sql`.

### Tables

#### `events`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | auto-generated |
| `title` | text | required |
| `description` | text | optional |
| `date` | text | display string (e.g. "July 15, 2026") |
| `time` | text | display string (e.g. "7:00 PM") |
| `location` | text | venue / address |
| `image_url` | text | Supabase Storage URL or external URL |
| `featured` | boolean | shows first in listings |
| `registration_type` | enum | `none \| free_rsvp \| paid` |
| `registration_url` | text | used when `registration_type = paid` |
| `created_at` | timestamptz | auto |

#### `event_rsvps`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `event_id` | uuid FK → events | cascade delete |
| `name` | text | |
| `email` | text | |
| `created_at` | timestamptz | |

#### `worship_requests`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `email` | text | |
| `phone` | text | |
| `city` | text | |
| `purpose` | enum | `high \| low` |
| `description` | text | |
| `event_month` | int | nullable |
| `event_day` | int | nullable |
| `event_year` | int | nullable |
| `event_time` | text | nullable |
| `date_tbd` | boolean | |
| `status` | enum | `new \| contacted \| completed` |
| `completed_by` | text | nullable — who completed it |
| `created_at` | timestamptz | |

#### `newsletter_subscribers`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `email` | text | unique — upsert on conflict |
| `city` | text | |
| `phone` | text | nullable |
| `status` | text | `active \| unsubscribed` |
| `created_at` | timestamptz | |

#### `praise_reports`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `quote` | text | the testimonial text |
| `name` | text | person's name |
| `role` | text | e.g. "Community Member" |
| `published` | boolean | false = draft, true = visible on site |
| `created_at` | timestamptz | |

#### `video_testimonies`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `title` | text | |
| `youtube_url` | text | any YouTube URL format |
| `sort_order` | int | lower = first; 0 = default |
| `published` | boolean | |
| `created_at` | timestamptz | |

#### `instagram_posts`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `instagram_id` | text | unique; null = manually added |
| `image_url` | text | |
| `caption` | text | nullable |
| `permalink` | text | link to Instagram post |
| `published` | boolean | sync never overwrites this |
| `created_at` | timestamptz | |

### Row Level Security

All tables have RLS enabled. Policies:

| Table | Anonymous (public) | Authenticated (admin) |
|---|---|---|
| `events` | SELECT | SELECT, INSERT, UPDATE, DELETE |
| `event_rsvps` | INSERT | SELECT, DELETE |
| `worship_requests` | INSERT | SELECT, UPDATE, DELETE |
| `newsletter_subscribers` | INSERT | SELECT, DELETE |
| `praise_reports` | SELECT (published only); INSERT | SELECT, UPDATE, DELETE |
| `video_testimonies` | SELECT (published only) | SELECT, INSERT, UPDATE, DELETE |
| `instagram_posts` | SELECT (published only) | SELECT, INSERT, UPDATE, DELETE |

### Storage

**Bucket:** `event-images` (public)
- Anyone can read (GET)
- Authenticated users can upload (POST) and delete (DELETE)
- Used for event banner images uploaded from the admin panel

---

## 6. Authentication

**Provider:** Supabase Auth (email + password only)

**Session management:** Supabase SSR package (`@supabase/ssr`) stores the session in HTTP-only cookies. The `createClient` server helper in `src/lib/supabase/server.ts` reads cookies on every request.

**Middleware:** `src/proxy.ts` runs on every `/admin/*` request (except `/admin/login`). It calls `supabase.auth.getUser()` — if no session, it redirects to `/admin/login`.

**Admin layout:** `src/app/admin/(protected)/layout.tsx` re-checks the session server-side as a secondary guard. This ensures even if middleware is bypassed, unauthenticated users can't render admin pages.

**Login flow:**
1. User hits `/admin/login`
2. Submits email + password to `signIn` server action (`src/app/actions/auth.ts`)
3. Supabase validates credentials and sets a session cookie
4. Redirect to `/admin`

**Logout:** `signOut` server action clears the Supabase session and redirects to `/admin/login`.

---

## 7. Server Actions

All database mutations are implemented as Next.js Server Actions in `src/app/actions/`. These run exclusively on the server — never exposed as public API endpoints.

### `auth.ts`
- `signIn(email, password)` — Supabase sign-in
- `signOut()` — clears session, redirects to login

### `events.ts`
- `createEvent(formData)` — insert new event; revalidates `/events`, `/`
- `updateEvent(id, formData)` — update event; revalidates `/events`, `/events/${id}`, `/`
- `deleteEvent(id)` — delete event; revalidates `/events`, `/`

### `event-rsvps.ts`
- `submitRsvp(eventId, name, email, honeypot)` — insert RSVP; revalidates event pages; sends admin + attendee emails
- `deleteRsvp(id, eventId)` — delete RSVP; revalidates event pages

### `worship-requests.ts`
- `submitWorshipRequest(prevState, formData)` — insert request; sends admin + submitter emails
- `updateRequestStatus(id, status, completedBy)` — admin status update
- `deleteWorshipRequest(id)` — admin delete

### `newsletter.ts`
- `subscribeNewsletter(prevState, formData)` — upsert subscriber (conflict on email); sends welcome + admin emails
- `deleteSubscriber(id)` — admin delete

### `praise-reports.ts`
- `submitPraiseReport(prevState, formData)` — public submit (always unpublished); sends admin email
- `createPraiseReport(formData)` — admin create (can set published)
- `updatePraiseReport(id, formData)` — admin update
- `deletePraiseReport(id)` — admin delete
- `togglePublished(id, published)` — flip published flag; revalidates `/`, `/praise-reports`

### `videos.ts`
- `createVideo(formData)`, `updateVideo(id, formData)`, `deleteVideo(id)`, `toggleVideoPublished(id, published)` — full CRUD

### `instagram.ts`
- `createPost(formData)`, `updatePost(id, formData)`, `deletePost(id)`, `togglePostPublished(id, published)` — manual post management
- `syncInstagramNow()` — triggers the Instagram sync inline from the admin

---

## 8. Email System

**Provider:** [Resend](https://resend.com)  
**Implementation:** `src/lib/email.ts`

### Design

All email logic is in a single file. The module exports one function per trigger. All sends are **fire-and-forget** using `void` — a slow or failed send never blocks the user's form response. If `RESEND_API_KEY` is missing, sends are silently skipped.

```
src/lib/email.ts
  ├── layout(body)              — shared branded HTML wrapper
  ├── badge(text)               — gold pill label
  ├── infoRow(label, value)     — two-line data row for tables
  ├── button(label, href)       — gold CTA button
  ├── send(to, subject, html)   — Resend API call with error handling
  ├── sendWorshipRequestEmails  — admin alert + submitter confirmation
  ├── sendRsvpEmails            — admin alert + attendee confirmation
  ├── sendNewsletterEmails      — admin alert + subscriber welcome
  └── sendPraiseReportNotification — admin alert only
```

### Email triggers

| Trigger | Admin email | User email |
|---|---|---|
| Worship request submitted | ✅ Full details + admin link | ✅ Request summary |
| RSVP submitted | ✅ Name + event details | ✅ Event card (title, date, time, location) |
| Newsletter signup | ✅ Name + city | ✅ Welcome email |
| Praise report submitted | ✅ Quote + review link | ❌ (no email captured on form) |

### Email design

Emails use inline HTML/CSS for compatibility across all email clients. Brand colors: gold (`#c8a44e`), deep black (`#111111`), warm white (`#faf8f5`). All emails share a consistent header (dark with cross logo) and footer (tagline + website link).

### Environment variables

```
RESEND_API_KEY     — API key from resend.com
RESEND_FROM        — Verified sender, e.g. "Proclaiming Praise <noreply@proclaimingpraise.org>"
ADMIN_EMAIL        — Recipient for admin notifications (any email address)
```

**Testing without a verified domain:** Set `RESEND_FROM=onboarding@resend.dev` — Resend's pre-verified test sender. Works immediately, no DNS setup needed.

---

## 9. Spam Protection

All public-facing forms use a **honeypot field** strategy. A hidden text input with `name="website"` is included in every form. The field is visually hidden (`className="hidden"`) and has `tabIndex={-1}` and `autoComplete="off"` so real users never interact with it. Automated bots that crawl and auto-fill forms will populate it — the server action detects this and silently discards the request (returns success to avoid signalling the bot).

### Implementation per form

| Form | Component / Page | Honeypot in DOM | Server check |
|---|---|---|---|
| RSVP | `EventRegistrationButton.tsx` | `<input type="text" name="website" className="hidden" />` | `if (honeypot) return {}` |
| Worship request | `contact/page.tsx` | same | `if (formData.get("website")) return { success: true }` |
| Praise report submit | `praise-reports/submit/page.tsx` | same | same pattern |
| Stay Connected | `StayConnectedForm.tsx` | managed via React state (`website: ""`) | same pattern |
| Newsletter | `NewsletterForm.tsx` | same DOM pattern | same pattern |

---

## 10. SEO & Metadata

### Global metadata (`src/app/layout.tsx`)

```ts
title: "Proclaiming Praise | Advancing the Kingdom of Heaven"
description: "..."
keywords: ["worship", "praise", "non-profit", "faith", "community", "events"]
metadataBase: "https://www.proclaimingpraise.org"
openGraph: { title, description, type: "website", url, siteName, locale }
twitter: { card: "summary_large_image", title, description }
```

### OpenGraph image (`src/app/opengraph-image.tsx`)

Generated at runtime using Next.js `ImageResponse` (Edge runtime). Renders a 1200×630 branded card:
- Dark background (`#111111`)
- Gold circular cross badge
- "Proclaiming Praise" in large serif text
- "Advancing the Kingdom of Heaven" in gold uppercase tracking
- Domain watermark at bottom

Per-event pages (`events/[id]/page.tsx`) override the OG image with the event's own photo via `generateMetadata`.

### Sitemap (`src/app/sitemap.ts`)

Dynamically generated at request time. Includes:
- All static routes (home, events, videos, praise reports, about, contact, giving, privacy) with defined priorities and change frequencies
- Every event at `/events/[id]` — pulled live from Supabase
- Published praise reports

### Robots (`src/app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://www.proclaimingpraise.org/sitemap.xml
```

---

## 11. Public Pages

### Homepage (`/`)
Server component. Fetches featured event, published videos, published Instagram posts, and published praise reports in a single Supabase query set. Renders: hero, video carousel, Instagram grid, praise report strip, Stay Connected form, footer.

### Events listing (`/events`)
Fetches all events ordered by `featured DESC, created_at ASC`. Renders horizontal card layout with image, title, description, meta pills (location, date, time), and registration CTA per event.

### Event detail (`/events/[id]`)
Full-bleed hero design (85vh minimum height):
- Background image fills entire hero section
- Layered gradient overlays (top → dark for nav; bottom → dark for title legibility)
- Frosted-glass back button (top-left) + Featured badge (top-right) absolutely positioned
- Event title (large serif, up to 8xl) pinned to hero bottom
- Meta pills (location, date, time) with `backdrop-blur` glass effect
- Floating white card (`-mt-16`) with gold accent bar, description, and registration CTA
- Walk-in note rendered as gold-tinted callout card if `registration_type === "none"`
- Register / RSVP button has continuous bouncing animation (`buttonBounce` keyframe)
- `generateMetadata` sets per-event OG title, description, and image

### Contact — Worship Request (`/contact`)
Client component using `useActionState`. Multi-field form: name, email, phone, city, purpose (radio), description (textarea), optional event date. Honeypot field included.

### Praise Reports (`/praise-reports`)
Lists all published reports. Shared grid component `PraiseReportsGrid.tsx`.

### Submit Praise Report (`/praise-reports/submit`)
Public form. Saves as `published: false` for admin review. Sends admin notification email.

### Videos (`/videos`)
Grid of published video testimonies. Each card opens YouTube on click.

### Giving (`/giving`)
Static page with Zeffy donation iframe embedded.

### Privacy (`/privacy`)
Static legal page covering data collection, storage, user rights, and cookies.

---

## 12. Admin Portal

Base path: `/admin`. Protected by Supabase session — unauthenticated requests redirect to `/admin/login`.

### Layout

`src/app/admin/(protected)/layout.tsx` wraps all admin pages with:
- Session check (redirects if unauthenticated)
- `AdminSidebar` — collapsible on mobile (hamburger), sticky on desktop
- Responsive main content padding to account for sidebar

### Pages

#### Dashboard (`/admin`)
Stats cards: total events, RSVPs, worship requests, subscribers. Table of 5 most recent worship requests.

#### Events (`/admin/events`)
`EventsClient.tsx` — client component.
- Table with all events
- Create form: title, date, time, location, description, image upload or URL, featured toggle, registration type selector
- Inline edit with same fields
- Delete with confirmation
- Share panel: shows public URL + QR code PNG (download button)

#### Event RSVPs (`/admin/event-rsvps`)
- RSVPs grouped by event with attendee count
- Delete individual RSVPs (with `revalidatePath` on event pages)
- CSV download via `/api/admin/export-rsvps`

#### Worship Requests (`/admin/worship-requests`)
- All requests sorted newest first
- Status badge (New / Contacted / Completed) with inline updater
- Completed By field when marking as completed
- Delete

#### Stay Connected (`/admin/newsletter`)
`CommunityClient.tsx` — client component.
- Live search filtering (client-side)
- Subscriber table: name, email, city, phone, join date
- Delete subscriber
- CSV download via `/api/admin/export-community`

#### Praise Reports (`/admin/praise-reports`)
- Table of all reports (published + drafts)
- Create, edit, delete, publish/unpublish toggle

#### Videos (`/admin/videos`)
- Add via YouTube URL (any format supported)
- Set sort order (0 = default newest first)
- Publish/unpublish toggle
- Delete

#### Instagram (`/admin/instagram`)
- Table of all posts (synced + manual)
- "Sync from Instagram" button (calls `syncInstagramNow` server action)
- Add post manually (URL + caption + permalink)
- Edit, delete, publish/unpublish per post

---

## 13. Key Components

### `EventRegistrationButton.tsx`
Client component. Handles all three registration types:
- `none` — returns `null` (no button rendered)
- `paid` — renders a gold link button pointing to `registrationUrl`
- `free_rsvp` — renders "I'll Be There" button that opens an inline RSVP modal

RSVP modal flow: name + email form → calls `submitRsvp` server action → success state with "You're on the list!" message. Includes honeypot field.

Both buttons share the `animate-button-bounce` CSS animation (continuous gentle bounce with double-dip keyframe).

### `StayConnectedForm.tsx`
Client component. Multi-step animated carousel:
- 4 steps: email → name → city → phone (optional)
- Only the input animates (slide left/right); the Next/Join button stays fixed
- `website` honeypot field managed in React state (always `""`)
- On final step, builds a `FormData` and calls `subscribeNewsletter`

### `AdminSidebar.tsx`
- Desktop: fixed left sidebar, always visible
- Mobile: hidden by default, slides in via hamburger button in top bar
- Active link highlighted based on current pathname

### `EventSharePanel.tsx`
Modal opened from the events admin table. Uses the `qrcode` library to generate a PNG data URL for the event's public URL. Provides a copy-to-clipboard button and a download PNG button.

### `VideoCarousel.tsx`
Client component. Horizontal scroll carousel of YouTube video thumbnails. Clicking a thumbnail opens the video in an embed player below the carousel.

### `ConditionalShell.tsx`
Wraps all pages. Reads the current pathname — if it starts with `/admin`, renders `children` only (no Navbar/Footer). Otherwise renders Navbar + children + Footer.

---

## 14. Event Registration System

Each event has a `registration_type` field with three possible values:

### `none`
- No registration button shown on the event page
- A gold-tinted callout card displays: "Free, walk-in event — No registration needed"

### `free_rsvp`
- "I'll Be There" button opens a modal with name + email fields
- On submit: inserts into `event_rsvps` table
- Revalidates `/events` and `/events/[id]`
- Sends confirmation email to attendee and notification to admin
- Admin views RSVPs at `/admin/event-rsvps`, grouped by event
- CSV export available

### `paid`
- "Register" button links to external `registration_url` (e.g. Zeffy, Eventbrite)
- Opens in a new tab
- No data stored locally (Zeffy webhook integration is a future backlog item)

### QR Code / Shareable URL

Every event's public page at `/events/[id]` is the canonical link used for sharing. The admin can generate a QR code from the Events admin page (share icon → `EventSharePanel` modal). QR codes are used on printed flyers.

---

## 15. Instagram Auto-Sync

### Trigger

- **Automatic:** Vercel Cron calls `GET /api/sync-instagram` every day at 6 AM UTC (configured in `vercel.json`)
- **Manual:** "Sync from Instagram" button in `/admin/instagram` calls the `syncInstagramNow` server action

Both paths run the same logic in `src/lib/sync-instagram.ts`.

### Cron security

The `/api/sync-instagram` endpoint checks the `Authorization: Bearer <CRON_SECRET>` header before running. Vercel injects this automatically when invoking cron jobs.

### Sync logic

1. Fetch recent media from Instagram Graph API using `INSTAGRAM_ACCESS_TOKEN`
2. For each post: upsert into `instagram_posts` using `instagram_id` as the conflict key
3. On insert (new post): set `published: true`
4. On update (existing post): only update `image_url` and `caption` — never touch `published`
5. Posts added manually (no `instagram_id`) are never affected by syncs

### Token management

Instagram Long-Lived tokens are valid for 60 days. Instagram sends an email reminder before expiry. You must manually generate a new token and update `INSTAGRAM_ACCESS_TOKEN` in Vercel before the old one expires.

---

## 16. File Upload (Event Images)

Event images can be set two ways in the admin:
1. **Upload:** File picker → uploads to Supabase Storage bucket `event-images` → stores the public CDN URL in `events.image_url`
2. **URL:** Paste any external image URL directly into `events.image_url`

The Supabase Storage bucket is public — no signed URLs needed. Authenticated users (admin) can upload and delete; anyone can read.

---

## 17. CSV Exports

Two auth-protected CSV download endpoints:

### `/api/admin/export-rsvps`
- Checks Supabase session — returns 401 if unauthenticated
- Uses service role client (bypasses RLS)
- Fetches all RSVPs joined with event titles
- Returns a CSV with columns: Event, Name, Email, Date Registered

### `/api/admin/export-community`
- Same auth check pattern
- Fetches all active newsletter subscribers
- Returns a CSV with columns: Name, Email, City, Phone, Joined

Both endpoints set `Content-Disposition: attachment` so the browser triggers a file download.

---

## 18. Deployment

### Platform

[Vercel](https://vercel.com) — connected to the GitHub repository. Every push to `main` triggers an automatic production deployment.

### Build

Standard Next.js build (`next build`). No custom build scripts. The output is a hybrid of static, server-rendered, and edge-rendered routes handled automatically by Vercel.

### Environment variables

Set all of the following in Vercel → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
INSTAGRAM_ACCESS_TOKEN
CRON_SECRET
RESEND_API_KEY
RESEND_FROM
ADMIN_EMAIL
```

### Cron jobs

`vercel.json` schedules the Instagram sync:

```json
{
  "crons": [
    {
      "path": "/api/sync-instagram",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Vercel calls this endpoint daily at 6 AM UTC, injecting `Authorization: Bearer <CRON_SECRET>` automatically.

### Domain

Custom domain `proclaimingpraise.org` (and `www.proclaimingpraise.org`) configured in Vercel. SSL handled automatically.

---

## 19. Known Limitations & Backlog

| # | Item | Priority | Notes |
|---|---|---|---|
| 1 | **Supabase free tier pause** | High | Free tier pauses after 7 days of inactivity. Set up a cron on [cron-job.org](https://cron-job.org) to ping the site every 3 days, or upgrade to Supabase Pro ($25/mo). |
| 2 | **Resend domain verification** | High | Until `proclaimingpraise.org` is verified in Resend, set `RESEND_FROM=onboarding@resend.dev`. Verify the domain before going live for production-quality sender addresses. |
| 3 | **Zeffy webhook integration** | Medium | The `/giving` page embeds a Zeffy donation form. There is currently no webhook — paid event ticket purchases don't land in `event_rsvps`. To fix: set up a Zeffy webhook that posts to a new `/api/zeffy-webhook` route, validate the payload, and insert into `event_rsvps`. |
| 4 | **Instagram token auto-refresh** | Medium | Long-lived tokens expire after 60 days. Future improvement: a cron job calls the Instagram token refresh endpoint 7 days before expiry and updates the stored token (would require storing the token in Supabase or Vercel env mutation API). |
| 5 | **Praise report email capture** | Low | The public praise report form does not collect an email address. If a user confirmation email is ever wanted, add an optional email field to the form and update the DB schema. |
| 6 | **Analytics** | Low | Vercel Analytics can be enabled from the Vercel dashboard — no code changes required. |
| 7 | **Unsubscribe link in emails** | Low | Currently no one-click unsubscribe in outgoing emails. For CAN-SPAM compliance on marketing emails, add a signed unsubscribe token link that calls a public action to set `status = "unsubscribed"`. (Transactional confirmation emails are exempt.) |
