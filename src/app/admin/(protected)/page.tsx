import { createClient } from "@/lib/supabase/server";
import { CalendarDays, HeartHandshake, Mail, Star } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: eventsCount },
    { count: requestsCount },
    { count: subscribersCount },
    { count: reportsCount },
    { data: recentRequests },
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase
      .from("worship_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("praise_reports")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("worship_requests")
      .select("id, name, city, purpose, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Total Events", value: eventsCount ?? 0, icon: CalendarDays, href: "/admin/events" },
    { label: "New Requests", value: requestsCount ?? 0, icon: HeartHandshake, href: "/admin/worship-requests" },
    { label: "Subscribers", value: subscribersCount ?? 0, icon: Mail, href: "/admin/newsletter" },
    { label: "Published Reports", value: reportsCount ?? 0, icon: Star, href: "/admin/praise-reports" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Dashboard
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        Welcome back. Here&apos;s what&apos;s happening.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="bg-white rounded-2xl p-6 border border-warm-gray hover:border-gold/40 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Icon className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="text-3xl font-bold text-charcoal">{value}</p>
            <p className="text-sm text-charcoal/50 mt-1">{label}</p>
          </a>
        ))}
      </div>

      {/* Recent worship requests */}
      <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
        <div className="px-6 py-4 border-b border-warm-gray flex items-center justify-between">
          <h2 className="font-semibold text-charcoal">Recent Worship Requests</h2>
          <a
            href="/admin/worship-requests"
            className="text-sm text-gold hover:underline"
          >
            View all
          </a>
        </div>

        {!recentRequests?.length ? (
          <p className="px-6 py-8 text-charcoal/40 text-sm text-center">
            No requests yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-warm-white text-charcoal/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">City</th>
                <th className="px-6 py-3 text-left">Season</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray">
              {recentRequests.map((r) => (
                <tr key={r.id} className="hover:bg-warm-white/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-charcoal">{r.name}</td>
                  <td className="px-6 py-4 text-charcoal/60">{r.city}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.purpose === "high"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {r.purpose === "high" ? "Celebration" : "Support"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.status === "new"
                          ? "bg-amber-50 text-amber-700"
                          : r.status === "contacted"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-charcoal/40">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
