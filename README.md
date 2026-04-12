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

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials from **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the database schema

Open the **SQL Editor** in your Supabase project and run the full contents of [`supabase/schema.sql`](./supabase/schema.sql).

This is safe to run multiple times — it uses `DROP POLICY IF EXISTS` before recreating policies and guards seed inserts with `WHERE NOT EXISTS`. It sets up:

- All 4 tables with Row Level Security
- RLS policies for public and authenticated access
- The `event-images` Storage bucket with upload/read policies
- Seed data (1 event + 3 praise reports) if the tables are empty

### 4. Create an admin user

**Supabase dashboard → Authentication → Users → Add user** — create an email/password account. This is used to sign in to `/admin/login`.

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

> **Note:** `npm run dev` runs everything — Next.js is a full-stack framework. The frontend, server actions (backend logic), and auth middleware all run in the same process. Supabase is the external database and is always live on their servers.

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
│   │   └── newsletter.ts          # subscribe / delete subscriber
│   ├── admin/
│   │   ├── (protected)/           # Auth-gated layout — all pages here require login
│   │   │   ├── layout.tsx         # Checks Supabase session, renders AdminSidebar
│   │   │   ├── page.tsx           # Dashboard (stats + recent requests)
│   │   │   ├── events/            # Event CRUD with image upload
│   │   │   ├── worship-requests/  # View + update request status
│   │   │   ├── praise-reports/    # Publish/unpublish testimonials
│   │   │   └── newsletter/        # Subscriber list
│   │   └── login/                 # Sign-in page (outside protected layout)
│   ├── praise-reports/
│   │   ├── page.tsx               # All published praise reports
│   │   └── submit/page.tsx        # Public praise report submission form
│   ├── about/
│   ├── contact/                   # Worship request form
│   ├── events/                    # Public events listing
│   └── giving/                    # Online giving (Zeffy embed)
├── components/
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   ├── PraiseReportsGrid.tsx      # Shared praise report card grid
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── NewsletterForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client (typed)
│   │   └── server.ts              # Server/SSR Supabase client (typed)
│   └── utils.ts                   # formatDate, formatEventDate, MONTHS
├── types/
│   └── database.ts                # Full Database generic + row type aliases
└── proxy.ts                       # Auth middleware — redirects /admin/* to login
supabase/
└── schema.sql                     # Idempotent schema: tables, RLS, storage, seeds
```

---

## Admin Portal

Protected by Supabase Auth. The `(protected)` route group applies an auth-checking layout to all admin pages except `/admin/login` — avoiding the redirect loop that would occur if the login page were inside the protected layout.

| Section | Path | What you can do |
|---|---|---|
| Dashboard | `/admin` | Stats overview + 5 most recent worship requests |
| Events | `/admin/events` | Create, edit, delete events; upload image or paste URL; mark as featured |
| Worship Requests | `/admin/worship-requests` | View all submissions, update status (New → Contacted → Completed) |
| Praise Reports | `/admin/praise-reports` | Create, edit, delete, publish/unpublish testimonials |
| Newsletter | `/admin/newsletter` | View subscribers, remove them |

---

## Public Pages & Forms

| Route | Description |
|---|---|
| `/` | Homepage — live featured event + up to 3 published praise reports from DB |
| `/events` | All events from DB, featured first |
| `/praise-reports` | All published praise reports |
| `/praise-reports/submit` | Shareable form — anyone can submit a testimony (saved as unpublished, admin reviews before publishing) |
| `/contact` | Worship request form — lands in admin worship requests queue |
| `/giving` | Online giving via Zeffy embed |

---

## Database

Four tables in Supabase with Row Level Security:

| Table | Public access | Admin access |
|---|---|---|
| `events` | Read all | Full CRUD |
| `worship_requests` | Insert only | Read + update status |
| `newsletter_subscribers` | Insert only | Read + delete |
| `praise_reports` | Read published; insert as unpublished | Full CRUD |

### Storage

One bucket: **`event-images`** (public). Used for event image uploads from the admin. Authenticated users can upload and delete; anyone can read.

---

## Deployment

Connect the GitHub repo to [Vercel](https://vercel.com) and set these environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

No separate backend deployment needed — Next.js handles everything in one deployment.
