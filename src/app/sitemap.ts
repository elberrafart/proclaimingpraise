import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const BASE = "https://www.proclaimingpraise.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: events }, { data: reports }] = await Promise.all([
    supabase.from("events").select("id, created_at").order("created_at", { ascending: false }),
    supabase
      .from("praise_reports")
      .select("id, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE}/events`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/videos`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/praise-reports`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/praise-reports/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/giving`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: new Date(e.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const reportRoutes: MetadataRoute.Sitemap = (reports ?? []).map((r) => ({
    url: `${BASE}/praise-reports`,
    lastModified: new Date(r.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes, ...reportRoutes];
}
