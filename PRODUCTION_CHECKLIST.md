# Production Launch Checklist

## 🔴 Blockers

| # | Item | Effort | Status | Notes |
|---|---|---|---|---|
| 1 | Fill `SUPABASE_SERVICE_ROLE_KEY` in Vercel | 5 min | ⬜ Needs you | Supabase project → Settings → API → service_role key. Set in Vercel env vars. |
| 2 | Supabase keep-alive or upgrade to Pro | 15 min | ⬜ Needs you | cron-job.org free ping every 3 days, or upgrade to Supabase Pro ($25/mo) before launch. |
| 3 | Add `not-found.tsx` + `error.tsx` | 1 hr | ✅ Done | Branded 404 and error pages with Try Again + Go Home actions. |
| 4 | Spam protection on all public forms | 2 hrs | ✅ Done | Hidden `website` honeypot on all 5 public forms (RSVP, worship request, praise report, Stay Connected, Newsletter). |
| 5 | `/terms` page missing | 1 hr | ✅ Done | Full Terms & Conditions page at `/terms` covering RSVPs, donations, user content, IP, liability. Linked in footer. |
| 6 | Apple touch icon missing | 30 min | ✅ Done | `apple-icon.tsx` generates branded 180×180 icon via ImageResponse. Auto-wired by Next.js — no manual metadata needed. |

## 🟡 Important

| # | Item | Effort | Status | Notes |
|---|---|---|---|---|
| 7 | OG image + favicon | 1 hr | ✅ Done | `opengraph-image.tsx` generates branded OG card dynamically via Next.js ImageResponse. Per-event OG image via `generateMetadata`. Twitter card added. |
| 8 | `sitemap.ts` + `robots.txt` | 1 hr | ✅ Done | Sitemap pulls events + praise reports from DB dynamically. Admin + API routes blocked from crawlers. |
| 9 | Email notifications via Resend | 3 hrs | ✅ Done | Admin notified on worship request, RSVP, newsletter signup, and praise report. User confirmation sent on worship request, RSVP, and newsletter signup. Set `RESEND_API_KEY`, `RESEND_FROM`, and `ADMIN_EMAIL` in Vercel. |
| 10 | Verify sending domain in Resend | 15 min | ⬜ Needs you | Add DNS records for `proclaimingpraise.org` in Resend dashboard so emails send from `noreply@proclaimingpraise.org`. Until then, set `RESEND_FROM=onboarding@resend.dev` for testing. |
| 11 | `revalidatePath` on all mutations | 1 hr | ✅ Done | Events, RSVP submit/delete, praise reports all revalidate public-facing pages including `/events/[id]`. |
| 12 | Duplicate RSVP prevention | 30 min | ✅ Done | `UNIQUE (event_id, email)` constraint added to `event_rsvps` table. Server action returns a friendly "You're already registered" message on duplicate. Run `supabase/schema.sql` to apply. |
| 13 | Security headers | 30 min | ✅ Done | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` added to `next.config.ts` — applied to all routes. |
| 14 | Footer placeholder links | 15 min | ✅ Done | YouTube linked to `@Sabrina.Oakson`. Facebook icon removed (no URL). |
| 15 | Set all env vars in Vercel | 15 min | ⬜ Needs you | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `CRON_SECRET`, `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_EMAIL` |

## 🟢 Nice to Have

| # | Item | Effort | Status | Notes |
|---|---|---|---|---|
| 16 | Event detail page redesign | 2 hrs | ✅ Done | Full-bleed hero image (85vh), floating white card with gold accent bar, bouncing register CTA button, frosted glass meta pills. |
| 17 | Instagram token auto-refresh | 2 hrs | ⬜ Backlog | Long-lived tokens expire after 60 days. Add a cron to refresh automatically. |
| 18 | Privacy policy page | 1 hr | ✅ Done | `/privacy` covers data collected, usage, storage, rights, cookies. Linked in footer. |
| 19 | Clean up boilerplate public assets | 5 min | ✅ Done | Removed unused Next.js starter SVGs (next.svg, vercel.svg, globe.svg, etc.) from `/public/`. |
| 20 | Analytics (Vercel Analytics) | 30 min | ⬜ Backlog | Enable in Vercel dashboard — no code needed. |
| 21 | Zeffy webhook integration | 3 hrs | ⬜ Backlog | Push Zeffy donation/ticket events into Supabase for a unified attendee view. |
