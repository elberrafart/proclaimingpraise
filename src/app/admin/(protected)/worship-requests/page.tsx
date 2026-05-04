"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRequestStatus } from "@/app/actions/worship-requests";
import { formatEventDate, formatDate } from "@/lib/utils";
import type { WorshipRequest } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

// ---------------------------------------------------------------------------
// Status form — client component so the "Completed by" field can show/hide
// ---------------------------------------------------------------------------
function StatusForm({ request }: { request: WorshipRequest }) {
  const [status, setStatus] = useState(request.status);
  const [completedBy, setCompletedBy] = useState(request.completed_by ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateRequestStatus(request.id, status, completedBy || null);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as WorshipRequest["status"])}
          className="px-3 py-1.5 text-xs border border-warm-gray rounded-lg text-charcoal/70 focus:outline-none focus:border-gold bg-warm-white"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Only shown when Completed is selected */}
      {status === "completed" && (
        <input
          type="text"
          value={completedBy}
          onChange={(e) => setCompletedBy(e.target.value)}
          placeholder="Your name"
          required
          className="px-3 py-1.5 text-xs border border-warm-gray rounded-lg text-charcoal focus:outline-none focus:border-gold bg-warm-white w-40"
        />
      )}

      <button
        type="submit"
        disabled={isPending || (status === "completed" && !completedBy.trim())}
        className="px-3 py-1.5 bg-gold text-deep-black text-xs font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Update"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: WorshipRequest["status"] }) {
  const styles: Record<WorshipRequest["status"], string> = {
    new: "bg-amber-50 text-amber-700",
    contacted: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page — fetches data client-side since we're in a client component
// ---------------------------------------------------------------------------
export default function WorshipRequestsPage() {
  const [requests, setRequests] = useState<WorshipRequest[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("worship_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests(data ?? []));
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Worship Requests
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        Personal praise requests submitted through the contact form.
      </p>

      {!requests.length ? (
        <div className="bg-white rounded-2xl border border-warm-gray px-6 py-16 text-center">
          <p className="text-charcoal/40 text-sm">No requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-warm-gray p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-charcoal">{r.name}</p>
                  <p className="text-sm text-charcoal/50">
                    {r.city} · {r.email} · {r.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.purpose === "high"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {r.purpose === "high" ? "Celebration" : "Support"}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              </div>

              <p className="text-sm text-charcoal/70 leading-relaxed mb-4 bg-warm-white rounded-xl px-4 py-3">
                {r.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-charcoal/40">
                    {formatEventDate(r.event_month, r.event_day, r.event_year, r.event_time, r.date_tbd)}
                    {" · "}Submitted {formatDate(r.created_at)}
                  </p>
                  {r.status === "completed" && r.completed_by && (
                    <p className="text-xs text-emerald-600 font-medium">
                      Completed by {r.completed_by}
                    </p>
                  )}
                </div>

                <StatusForm request={r} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
