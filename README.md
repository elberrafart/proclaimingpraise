# Proclaiming Praise

Website and admin portal for [Proclaiming Praise](https://proclaimingpraise.org), a 501(c)(3) worship ministry based in Southern California.

**Stack:** Next.js 16 · React 19 · Supabase (PostgreSQL + Auth + Storage) · Tailwind CSS v4

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase — from your project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Instagram auto-sync (see "Instagram Setup" section below)
INSTAGRAM_ACCESS_TOKEN=your-long-lived-token-here

# Cron job auth — any random secret string (Vercel sets this automatically)
CRON_SECRET=your-random-secret-here
```

> **Never expose `SUPABASE_SERVICE_ROLE_KEY` or `CRON_SECRET` to the browser.** They are only referenced in server-side code.

### 3. Run the database schema

Open the **SQL Editor** in your Supabase project and run the full contents of [`supabase/schema.sql`](./supabase/schema.sql).

This is safe to run multiple times — it uses `DROP POLICY IF EXISTS` before recreating policies and guards seed inserts with `WHERE NOT EXISTS`. It creates:

- **6 tables** with Row Level Security: `events`, `worship_requests`, `newsletter_subscribers`, `praise_reports`, `video_testimonies`, `instagram_posts`
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
│   │   ├── worship-requests.ts    # submit request / update status
│   │   ├── praise-reports.ts      # CRUD + public submit + toggle published
│   │   ├── newsletter.ts          # subscribe / delete subscriber
│   │   ├── videos.ts              # create / update / delete / toggle video testimonies
│   │   └── instagram.ts           # CRUD + syncInstagramNow server action
│   ├── admin/
│   │   ├── (protected)/           # Auth-gated layout — all pages here require login
│   │   │   ├── layout.tsx         # Checks Supabase session, renders AdminSidebar
│   │   │   ├── page.tsx           # Dashboard (stats + recent requests)
│   │   │   ├── events/            # Event CRUD with image upload
│   │   │   ├── worship-requests/  # View + update request status
│   │   │   ├── praise-reports/    # Publish/unpublish testimonials
│   │   │   ├── newsletter/        # Subscriber list
│   │   │   ├── videos/            # Video testimony CRUD + publish toggle
│   │   │   └── instagram/         # Instagram post CRUD + manual sync trigger
│   │   └── login/                 # Sign-in page (outside protected layout)
│   ├── api/
│   │   └── sync-instagram/        # GET endpoint called by Vercel Cron daily
│   ├── praise-reports/
│   │   ├── page.tsx               # All published praise reports
│   │   └── submit/page.tsx        # Public praise report submission form
│   ├── videos/page.tsx            # All published video testimonies
│   ├── about/
│   ├── contact/                   # Worship request form
│   ├── events/                    # Public events listing
│   └── giving/                    # Online giving (Zeffy embed)
├── components/
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   ├── icons/
│   │   └── InstagramIcon.tsx      # Custom SVG (not in lucide-react)
│   ├── VideoCarousel.tsx          # Client-side YouTube carousel with thumbnail strip
│   ├── PraiseReportsGrid.tsx      # Shared praise report card grid
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── NewsletterForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client (typed)
│   │   ├── server.ts              # Server/SSR Supabase client (typed)
│   │   └── service.ts             # Service role client — bypasses RLS (server only)
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
| Events | `/admin/events` | Create, edit, delete events; upload image or paste URL; mark as featured |
| Worship Requests | `/admin/worship-requests` | View all submissions, update status (New → Contacted → Completed) |
| Praise Reports | `/admin/praise-reports` | Create, edit, delete, publish/unpublish testimonials |
| Newsletter | `/admin/newsletter` | View subscribers, remove them |
| Videos | `/admin/videos` | Add YouTube URLs, set sort order, publish/unpublish |
| Instagram | `/admin/instagram` | Sync from Instagram, add posts manually, publish/unpublish |

---

## Public Pages & Forms

| Route | Description |
|---|---|
| `/` | Homepage — featured event, video carousel, Instagram grid, praise reports |
| `/events` | All events from DB, featured first |
| `/videos` | All published video testimonies (YouTube grid) |
| `/praise-reports` | All published praise reports |
| `/praise-reports/submit` | Shareable form — anyone can submit a testimony (saved as unpublished draft) |
| `/contact` | Worship request form — lands in admin worship requests queue |
| `/giving` | Online giving via Zeffy embed |

---

## Database

Six tables in Supabase with Row Level Security:

| Table | Public access | Admin access |
|---|---|---|
| `events` | Read all | Full CRUD |
| `worship_requests` | Insert only | Read + update status |
| `newsletter_subscribers` | Insert only | Read + delete |
| `praise_reports` | Read published; insert as unpublished | Full CRUD |
| `video_testimonies` | Read published | Full CRUD |
| `instagram_posts` | Read published | Full CRUD |

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

### Environment variables for Instagram

| Variable | Where to get it |
|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | Meta Developer Console → Instagram Basic Display |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project Settings → API → service_role key |
| `CRON_SECRET` | Any random string — set the same value in Vercel project settings |

---

## Video Testimonies

Videos are managed in `/admin/videos`. Each video needs a YouTube URL — supported formats:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

**Sort order:** Lower numbers appear first in the carousel. Set to `0` for the default order (newest first).

The homepage carousel shows all published videos. The `/videos` page shows them in a clickable grid that opens YouTube.

---

## Deployment

Connect the GitHub repo to [Vercel](https://vercel.com) and set these environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
INSTAGRAM_ACCESS_TOKEN
CRON_SECRET
```

Vercel automatically uses `CRON_SECRET` when invoking cron jobs — no extra configuration needed beyond setting the variable.

No separate backend deployment needed — Next.js handles everything in one deployment.
