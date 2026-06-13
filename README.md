# Proclaiming Praise

Website and admin portal for [Proclaiming Praise](https://proclaimingpraise.org), a 501(c)(3) worship ministry based in Southern California.

**Stack:** Next.js 16 · React 19 · Supabase (PostgreSQL + Auth + Storage) · Tailwind CSS v4 · Resend (email)

**Features:** Event registration (free RSVP / paid redirect) · Transactional email notifications via Resend · Shareable event URLs with QR codes · Stay Connected community list with CSV export · Spam protection (honeypot) on all public forms · Dynamic OG image · Sitemap + robots.txt · Admin mobile-responsive with slide-in sidebar

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root. See `.env.local.example` for a template.

```env
# Supabase — from your project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Instagram auto-sync (see "Instagram Setup" section below)
INSTAGRAM_ACCESS_TOKEN=your-long-lived-token-here

# Cron job auth — any random secret string (Vercel sets this automatically)
CRON_SECRET=your-random-secret-here

# Resend — transactional email (see "Email Notifications" section below)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=Proclaiming Praise <noreply@proclaimingpraise.org>
ADMIN_EMAIL=info@proclaimingpraise.org
```

> **Never expose `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, or `RESEND_API_KEY` to the browser.** They are only referenced in server-side code.

### 3. Run the database schema

Open the **SQL Editor** in your Supabase project and run the full contents of [`supabase/schema.sql`](./supabase/schema.sql).

This is safe to run multiple times — it uses `DROP POLICY IF EXISTS` before recreating policies and guards seed inserts with `WHERE NOT EXISTS`. It creates:

- **7 tables** with Row Level Security: `events`, `worship_requests`, `newsletter_subscribers`, `praise_reports`, `video_testimonies`, `instagram_posts`, `event_rsvps`
- RLS policies for public and authenticated access on all tables
- The `event-images` Storage bucket with upload/read/delete policies
- Seed data (1 event + 3 praise reports) if the tables are empty

### 4. Create an admin user

**Supabase dashboard → Authentication → Users → Add user** — create an email/password account. This is used to sign in at `/admin/login`.

### 5. Run the dev server

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin portal: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Available Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts the Next.js dev server (frontend + backend in one process) |
| `npm run build` | Production build |
| `npm run start` | Runs the production build locally |
| `npm run lint` | ESLint across `src/` |
| `npm run type-check` | TypeScript check without emitting files |

> `npm run dev` runs everything — Next.js is full-stack. The frontend, server actions (backend logic), and auth middleware all run in one process. Supabase is the external database, always live on their servers.

---

## Project Structure

```
src/
├── app/
│   ├── actions/                   # Server actions — all database mutations
│   │   ├── auth.ts                # login / logout
│   │   ├── events.ts              # create / update / delete events
│   │   ├── event-rsvps.ts         # submitRsvp / deleteRsvp (+ email notifications)
│   │   ├── worship-requests.ts    # submit request / update status / delete (+ email)
│   │   ├── praise-reports.ts      # CRUD + public submit + toggle published (+ email)
│   │   ├── newsletter.ts          # subscribe / delete subscriber (+ email)
│   │   ├── videos.ts              # create / update / delete / toggle video testimonies
│   │   └── instagram.ts           # CRUD + syncInstagramNow server action
│   ├── admin/
│   │   ├── (protected)/           # Auth-gated layout — all pages here require login
│   │   │   ├── layout.tsx         # Checks Supabase session, renders AdminSidebar; mobile-aware padding
│   │   │   ├── page.tsx           # Dashboard (stats + recent requests)
│   │   │   ├── events/            # Event CRUD with image upload + registration type + share/QR
│   │   │   ├── event-rsvps/       # RSVPs grouped by event + CSV download
│   │   │   ├── worship-requests/  # View + update request status + delete
│   │   │   ├── praise-reports/    # Publish/unpublish testimonials
│   │   │   ├── newsletter/        # Stay Connected community list with search + CSV export
│   │   │   ├── videos/            # Video testimony CRUD + publish toggle
│   │   │   └── instagram/         # Instagram post CRUD + manual sync trigger
│   │   └── login/                 # Sign-in page (outside protected layout)
│   ├── api/
│   │   ├── sync-instagram/        # GET endpoint called by Vercel Cron daily
│   │   ├── admin/export-rsvps/    # Auth-checked CSV export for event RSVPs
│   │   └── admin/export-community/# Auth-checked CSV export for Stay Connected list
│   ├── praise-reports/
│   │   ├── page.tsx               # All published praise reports
│   │   └── submit/page.tsx        # Public praise report submission form
│   ├── videos/page.tsx            # All published video testimonies
│   ├── about/
│   ├── contact/                   # Worship request form
│   ├── events/
│   │   ├── page.tsx               # Public events listing
│   │   └── [id]/page.tsx          # Full-bleed hero event detail page (QR links land here)
│   ├── giving/                    # Online giving (Zeffy embed)
│   ├── privacy/page.tsx           # Privacy policy
│   ├── opengraph-image.tsx        # Dynamic OG image (1200×630) via Next.js ImageResponse
│   ├── sitemap.ts                 # Dynamic sitemap — pulls events + praise reports from DB
│   ├── robots.ts                  # robots.txt — blocks /admin and /api from crawlers
│   ├── not-found.tsx              # Branded 404 page
│   ├── error.tsx                  # Branded error boundary page
│   ├── globals.css                # Tailwind v4 theme tokens + animation utilities
│   └── layout.tsx                 # Root layout — fonts, global metadata, ConditionalShell
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx       # Collapsible mobile sidebar (hamburger) + desktop sticky
│   │   └── EventSharePanel.tsx    # QR code generator modal with copy URL + download PNG
│   ├── icons/
│   │   └── InstagramIcon.tsx      # Custom SVG (not in lucide-react)
│   ├── ConditionalShell.tsx       # Hides Navbar/Footer on all /admin/* routes
│   ├── EventRegistrationButton.tsx# Handles none / free_rsvp / paid CTAs; bouncing animation
│   ├── StayConnectedForm.tsx      # Multi-step carousel form (email → name → city → phone)
│   ├── VideoCarousel.tsx          # Client-side YouTube carousel with thumbnail strip
│   ├── PraiseReportsGrid.tsx      # Shared praise report card grid
│   ├── NewsletterForm.tsx         # Simple email-only newsletter subscribe form
│   ├── Footer.tsx
│   └── Navbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client (typed)
│   │   ├── server.ts              # Server/SSR Supabase client (typed)
│   │   └── service.ts             # Service role client — bypasses RLS (server only)
│   ├── email.ts                   # Resend client + branded HTML email templates
│   ├── sync-instagram.ts          # Shared Instagram Graph API sync logic
│   └── utils.ts                   # formatDate, formatEventDate, MONTHS
├── types/
│   └── database.ts                # Full Database generic + row type aliases
└── proxy.ts                       # Auth middleware — redirects /admin/* to login
supabase/
└── schema.sql                     # Idempotent schema: tables, RLS, storage, seeds
vercel.json                        # Vercel Cron config — runs Instagram sync daily at 6 AM UTC
```

---

## Admin Portal

Protected by Supabase Auth. The `(protected)` route group applies an auth-checking layout to all admin pages except `/admin/login`.

| Section | Path | What you can do |
|---|---|---|
| Dashboard | `/admin` | Stats overview + 5 most recent worship requests |
| Events | `/admin/events` | Create, edit, delete events; upload image or paste URL; mark as featured; set registration type (none / free RSVP / paid); generate shareable URL + QR code |
| Event RSVPs | `/admin/event-rsvps` | View attendees grouped by event; delete individual RSVPs; download all RSVPs as CSV |
| Worship Requests | `/admin/worship-requests` | View all submissions, update status (New → Contacted → Completed), delete requests |
| Stay Connected | `/admin/newsletter` | View community list (name, email, city, phone); live search; download CSV; remove people |
| Praise Reports | `/admin/praise-reports` | Create, edit, delete, publish/unpublish testimonials |
| Videos | `/admin/videos` | Add video files or URLs, set sort order, choose homepage/videos page placement, publish/unpublish |
| Instagram | `/admin/instagram` | Sync from Instagram, add posts manually, publish/unpublish |

> The admin sidebar collapses on mobile — tap the hamburger icon in the top bar to open it.

---

## Public Pages & Forms

| Route | Description |
|---|---|
| `/` | Homepage — featured event, video carousel, Instagram grid, praise reports |
| `/events` | All events from DB, featured first |
| `/events/[id]` | Full-bleed hero event detail — image fills viewport, floating info card, bouncing register button |
| `/videos` | All published video testimonies (YouTube grid) |
| `/praise-reports` | All published praise reports |
| `/praise-reports/submit` | Public testimony submission form (saved as unpublished draft) |
| `/contact` | Worship request form — lands in admin worship requests queue |
| `/giving` | Online giving via Zeffy embed |
| `/privacy` | Privacy policy |
| `/sitemap.xml` | Auto-generated sitemap — static routes + dynamic event/praise report URLs |
| `/robots.txt` | Allows all crawlers on `/`; blocks `/admin/` and `/api/` |

---

## Email Notifications

All transactional email is handled by [Resend](https://resend.com) via `src/lib/email.ts`. Emails are sent **fire-and-forget** (`void`) — a slow or failed send never blocks the user's form response.

### Emails sent

| Trigger | Admin gets | User gets |
|---|---|---|
| Worship request submitted | New request with all details + link to admin | Confirmation with their request summary |
| RSVP submitted | New RSVP with attendee name + event details | Confirmation with event card (title, date, time, location) |
| Newsletter / Stay Connected signup | New subscriber with name + city | Welcome email with what to expect |
| Praise report submitted | New report with quote for review | — *(no email captured on that form)* |

### Setup

1. Sign up at [resend.com](https://resend.com)
2. Add `proclaimingpraise.org` under **Domains** and follow the DNS verification steps (~5 min)
3. Create an API key under **API Keys**
4. Set these environment variables:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=Proclaiming Praise <noreply@proclaimingpraise.org>
ADMIN_EMAIL=info@proclaimingpraise.org   # or any Gmail
```

> **Testing without domain verification:** Use `RESEND_FROM=onboarding@resend.dev` — Resend's built-in sender that works immediately without DNS setup. Switch to your own domain before going to production.

> If `RESEND_API_KEY` is not set, email sends are silently skipped — the site continues to function normally.

---

## Spam Protection

All public-facing forms use a **honeypot field** (`name="website"`, visually hidden). Bots that auto-fill forms will populate it; humans never see it. The server action checks the field on every submission and silently discards the request if it has a value.

| Form | Honeypot in DOM | Server check |
|---|---|---|
| RSVP (EventRegistrationButton) | ✅ | ✅ |
| Worship request (Contact page) | ✅ | ✅ |
| Praise report submit | ✅ | ✅ |
| Stay Connected (StayConnectedForm) | ✅ via React state | ✅ |
| Newsletter (NewsletterForm) | ✅ | ✅ |

---

## SEO & Metadata

| Feature | Implementation |
|---|---|
| Global metadata | `src/app/layout.tsx` — title, description, keywords, OpenGraph, Twitter card |
| Dynamic OG image | `src/app/opengraph-image.tsx` — 1200×630 branded card generated at runtime via `ImageResponse` |
| Per-event OG image | `src/app/events/[id]/page.tsx` `generateMetadata` — uses the event's own image |
| Sitemap | `src/app/sitemap.ts` — static routes + live event and praise report URLs from Supabase |
| Robots | `src/app/robots.ts` — crawl all public routes; block `/admin/` and `/api/` |

---

## Database

Seven tables in Supabase with Row Level Security:

| Table | Public access | Admin access |
|---|---|---|
| `events` | Read all | Full CRUD |
| `event_rsvps` | Insert only (via RSVP form) | Read + delete |
| `worship_requests` | Insert only | Read + update status + delete |
| `newsletter_subscribers` | Insert only | Read + delete |
| `praise_reports` | Read published; insert as unpublished | Full CRUD |
| `video_testimonies` | Read published | Full CRUD |
| `instagram_posts` | Read published | Full CRUD |

### Key columns

- `events.registration_type` — `none | free_rsvp | paid` — controls the CTA shown on the public event page
- `events.registration_url` — external URL (e.g. Zeffy) used when `registration_type = paid`
- `newsletter_subscribers.name`, `.city`, `.phone` — extended community profile collected via the multi-step Stay Connected form

### Storage

One bucket: **`event-images`** (public). Used for event image uploads from the admin. Authenticated users can upload and delete; anyone can read.

---

## Instagram Auto-Sync

The homepage Instagram feed pulls from the `instagram_posts` table. Posts can be added manually via the admin, or synced automatically from your Instagram account daily.

### How the sync works

1. **Daily cron** — Vercel calls `GET /api/sync-instagram` every day at 6 AM UTC (configured in `vercel.json`).
2. **Manual sync** — Click "Sync from Instagram" in `/admin/instagram` at any time.
3. **Merge logic** — New posts are inserted with `published: true`. Existing posts only have their image and caption updated — the `published` flag is never overwritten, so you can hide individual posts from the admin without them reappearing on the next sync.
4. **Manual posts** — Posts added by hand (no `instagram_id`) are never touched by the sync.

### Getting your Instagram access token

1. Go to [developers.facebook.com](https://developers.facebook.com) and create an app (Consumer type).
2. Add the **Instagram Basic Display** product.
3. Under Instagram Basic Display → Basic Display, add your Instagram account as a test user.
4. Generate a **User Token** for that account, then exchange it for a **Long-Lived Token** (valid 60 days).
5. Paste the long-lived token into `INSTAGRAM_ACCESS_TOKEN` in your environment variables.

> **Token refresh:** Long-lived tokens expire after 60 days. You must generate a new one before expiry and update the env var in Vercel. Instagram will email you a reminder before expiry.

---

## Video Testimonies

Videos are managed in `/admin/videos`. Each video needs a YouTube URL — supported formats:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

**Sort order:** Lower numbers appear first in the carousel. Set to `0` for the default order (newest first).

The homepage carousel shows all published videos. The `/videos` page shows them in a clickable grid that opens YouTube.

---

## Event Registration Types

Each event can have one of three registration types, set in the admin:

| Type | CTA shown on public event page | Where data goes |
|---|---|---|
| `none` | No button — walk-in note shown instead | — |
| `free_rsvp` | "I'll Be There" → RSVP modal (name + email) | `event_rsvps` table; admin + attendee get confirmation emails |
| `paid` | "Register" → opens `registration_url` in new tab | External (Zeffy, Eventbrite, etc.) |

### Shareable event URLs & QR codes

Every event has a public detail page at `/events/[id]`. From the Events admin table, click the share icon to open a panel that shows:
- The full URL (click to copy)
- A QR code image (click Download to save as PNG)

Use the QR code on printed flyers — it takes people directly to the event page where they can RSVP or get tickets.

---

## Stay Connected Form

The public homepage form captures community members in a 4-step carousel:
1. Email address
2. Full name
3. City
4. Phone number (optional)

Each step animates only the input — the button stays fixed. Submissions land in `newsletter_subscribers`. The admin view at `/admin/newsletter` includes live search and a CSV download. A welcome email is sent to the subscriber and an admin notification is sent to `ADMIN_EMAIL`.

---

## Deployment

Connect the GitHub repo to [Vercel](https://vercel.com) and set these environment variables in the Vercel project settings:

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

Vercel automatically uses `CRON_SECRET` when invoking cron jobs — no extra configuration needed beyond setting the variable.

No separate backend deployment needed — Next.js handles everything in one deployment.

---

## To-Do

| # | Task | Priority | Notes |
|---|---|---|---|
| 1 | **Supabase keep-alive** | High | Free tier pauses after 7 days of inactivity. Set up a cron job on [cron-job.org](https://cron-job.org) (free) to ping the live site URL every 3 days. Or upgrade to Supabase Pro ($25/mo). |
| 2 | **Fill all Vercel env vars** | High | `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_EMAIL`, `CRON_SECRET`. |
| 3 | **Verify sending domain in Resend** | High | Add DNS records for `proclaimingpraise.org` in the Resend dashboard before going live so emails come from `noreply@proclaimingpraise.org` instead of `onboarding@resend.dev`. |
| 4 | **Zeffy webhook integration** | Medium | Donation form iframe is live at `/giving`. Next step: set up Zeffy webhooks to push donation events into Supabase so records are stored locally. Also connect paid event registration: when a Zeffy order completes for an event, write to `event_rsvps` so the admin sees a unified attendee list. |
| 5 | **Instagram token auto-refresh** | Low | Long-lived tokens expire after 60 days. Add a cron job to refresh automatically. |
| 6 | **Analytics** | Low | Enable Vercel Analytics in the Vercel dashboard — no code changes needed. |
