# Proclaiming Praise

Website and admin portal for [Proclaiming Praise](https://proclaimingpraise.org), a 501(c)(3) worship ministry based in Southern California.

**Stack:** Next.js 16 · React 19 · Supabase (PostgreSQL + Auth) · Tailwind CSS v4

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Get the values from your Supabase project → **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up the database

In your Supabase project, open the **SQL Editor** and run the full contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates all tables, enables Row Level Security, and seeds the initial event and praise reports.

### 4. Create an admin user

In your Supabase dashboard go to **Authentication → Users → Add user** and create an email/password account. This account is used to log in to the admin portal at `/admin/login`.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

---

## Project Structure

```
src/
├── app/
│   ├── actions/          # Server actions (auth, events, requests, newsletter, reports)
│   ├── admin/            # Protected admin portal
│   │   ├── login/        # Admin sign-in page
│   │   ├── events/       # Event management (CRUD)
│   │   ├── worship-requests/  # Incoming praise requests
│   │   ├── praise-reports/    # Testimonials (publish/unpublish)
│   │   └── newsletter/   # Subscriber list
│   ├── about/            # Ministry story & founders
│   ├── contact/          # Worship request submission form
│   ├── events/           # Public events listing
│   └── giving/           # Online giving (Zeffy embed)
├── components/
│   ├── admin/            # AdminSidebar
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── NewsletterForm.tsx
├── lib/
│   └── supabase/
│       ├── client.ts     # Browser client
│       └── server.ts     # Server/SSR client
└── proxy.ts              # Auth middleware — protects /admin/* routes
supabase/
└── schema.sql            # Full database schema + seed data
```

---

## Admin Portal

The admin portal lives at `/admin` and is protected by Supabase Auth. Unauthenticated requests are redirected to `/admin/login` by the proxy middleware (`src/proxy.ts`).

| Section | Path | What you can do |
|---|---|---|
| Dashboard | `/admin` | Overview stats + recent worship requests |
| Events | `/admin/events` | Create, edit, delete, feature events |
| Worship Requests | `/admin/worship-requests` | View submissions, update status (New → Contacted → Completed) |
| Praise Reports | `/admin/praise-reports` | Create, edit, delete, publish/unpublish testimonials |
| Newsletter | `/admin/newsletter` | View and remove subscribers |

---

## Database

Four tables in Supabase with Row Level Security:

| Table | Public access | Admin access |
|---|---|---|
| `events` | Read all | Full CRUD |
| `worship_requests` | Insert only | Read + update status |
| `newsletter_subscribers` | Insert only | Read + delete |
| `praise_reports` | Read published only | Full CRUD |

---

## Public Forms

- **Worship Request** (`/contact`) — anyone can submit a praise request; lands in the admin worship requests queue
- **Newsletter** (footer on every page) — email subscription with upsert to avoid duplicates

---

## Deployment

Deploy to [Vercel](https://vercel.com) in one step — connect your GitHub repo and add the two Supabase environment variables in the Vercel project settings.

Make sure the same env vars are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
