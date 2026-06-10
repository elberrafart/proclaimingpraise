"use client";

import { useState, useEffect, useTransition } from "react";
import { deleteSubscriber } from "@/app/actions/newsletter";
import { createClient } from "@/lib/supabase/client";
import type { NewsletterSubscriber } from "@/types/database";
import { Trash2, Search, Download, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function CommunityClient() {
  const [all, setAll] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAll(data ?? []));
  }, []);

  const filtered = all.filter((s) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    );
  });

  function handleDelete(id: string) {
    if (!confirm("Remove this person from the community list?")) return;
    startTransition(async () => {
      await deleteSubscriber(id);
      setAll((prev) => prev.filter((s) => s.id !== id));
    });
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-xl">
          <Users className="w-4 h-4 text-gold" />
          <span className="text-sm font-semibold text-charcoal">
            {all.length} {all.length === 1 ? "person" : "people"}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, city…"
              className="w-full pl-9 pr-4 py-2 bg-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* CSV Download */}
          {all.length > 0 && (
            <a
              href="/api/admin/export-community"
              download
              className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm font-medium rounded-xl hover:bg-charcoal/80 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </a>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-6 py-16 text-center text-charcoal/40 text-sm">
            {all.length === 0 ? "No subscribers yet." : "No results match your search."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-warm-white text-charcoal/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">City</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-warm-white/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {s.name ?? <span className="text-charcoal/30 italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-charcoal/70">
                      <a href={`mailto:${s.email}`} className="hover:text-gold transition-colors">
                        {s.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">
                      {s.city ?? <span className="text-charcoal/30 italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">
                      {s.phone ? (
                        <a href={`tel:${s.phone}`} className="hover:text-gold transition-colors">
                          {s.phone}
                        </a>
                      ) : (
                        <span className="text-charcoal/30 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-charcoal/40 text-xs">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={isPending}
                          className="p-1.5 text-charcoal/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {query && filtered.length !== all.length && (
        <p className="text-xs text-charcoal/40 text-center">
          Showing {filtered.length} of {all.length} people
        </p>
      )}
    </div>
  );
}
