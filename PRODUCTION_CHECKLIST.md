# Production Launch Checklist

## 🔴 Blockers

| # | Item | Effort | Status | Notes |
|---|---|---|---|---|
| 1 | Fill `SUPABASE_SERVICE_ROLE_KEY` in Vercel | 5 min | ⬜ Needs you | Supabase project → Settings → API → service_role key. Set in Vercel env vars. |
| 2 | Supabase keep-alive or upgrade to Pro | 15 min | ⬜ Needs you | cron-job.org free ping every 3 days, or upgrade to Supabase Pro ($25/mo) before launch. |
| 3 | Add `not-found.tsx` + `error.tsx` | 1 hr | ✅ Done | Branded 404 and error pages with Try Again + Go Home actions. |
| 4 | Spam protection on public forms | 2 hrs | ✅ Done | Hidden `website` honeypot on all 4 public forms. Bots fill it, humans never see it. |

## 🟡 Important

| # | Item | Effort | Status | Notes |
|---|---|---|---|---|
| 5 | OG image + favicon | 1 hr | ✅ Done | `opengraph-image.tsx` generates branded OG card dynamically via Next.js ImageResponse. Twitter card added. |
| 6 | `sitemap.ts` + `robots.txt` | 1 hr | ✅ Done | Sitemap pulls events + praise reports from DB dynamically. Admin + API routes blocked from crawlers. |
| 7 | Email notifications via Resend | 2 hrs | ⬜ Needs Resend API key | Notify admin on worship request + RSVP. Send confirmation to attendee. |
| 8 | `revalidatePath` on event actions | 30 min | ✅ Done | `createEvent`, `updateEvent`, `deleteEvent` now revalidate `/events`, `/events/[id]`, and `/`. |
| 9 | Set all env vars in Vercel | 15 min | ⬜ Needs you | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `CRON_SECRET` |

## 🟢 Nice to Have

| # | Item | Effort | Status | Notes |
|---|---|---|---|---|
| 10 | Instagram token auto-refresh | 2 hrs | ⬜ Skipped for now | Add to backlog |
| 11 | Privacy policy page | 1 hr | ✅ Done | `/privacy` covers data collected, usage, storage, rights, cookies. Linked in footer. |
| 12 | Analytics (Vercel Analytics) | 30 min | ⬜ Skipped for now | Enable in Vercel dashboard — no code needed |
| 13 | RSVP confirmation email to attendee | 1 hr | ⬜ Needs Resend API key | Part of email notifications task |
