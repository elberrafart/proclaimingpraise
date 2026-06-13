import { createClient } from "@/lib/supabase/server";
import { deleteRsvp } from "@/app/actions/event-rsvps";
import { formatDate } from "@/lib/utils";
import { Users, Trash2, CalendarDays, Download } from "lucide-react";
import type { EventRsvpRow, EventRow } from "@/types/database";

export const metadata = { title: "Event RSVPs | Admin" };

export default async function EventRsvpsPage() {
  const supabase = await createClient();

  const [{ data: rsvps }, { data: events }] = await Promise.all([
    supabase.from("event_rsvps").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("id, title, date"),
  ]);

  const eventMap = Object.fromEntries(
    (events ?? []).map((e: Pick<EventRow, "id" | "title" | "date">) => [e.id, e])
  );

  // Group RSVPs by event id
  const grouped = (rsvps ?? []).reduce<Record<string, EventRsvpRow[]>>(
    (acc, rsvp) => {
      (acc[rsvp.event_id] ??= []).push(rsvp);
      return acc;
    },
    {}
  );

  const totalCount = rsvps?.length ?? 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
            Event RSVPs
          </h1>
          <p className="text-charcoal/50 text-sm">
            Attendees who registered for free events.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-xl">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-charcoal">
              {totalCount} total
            </span>
          </div>
          {totalCount > 0 && (
            <a
              href="/api/admin/export-rsvps"
              download
              className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm font-medium rounded-xl hover:bg-charcoal/80 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </a>
          )}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-gray p-16 text-center">
          <Users className="w-10 h-10 text-charcoal/20 mx-auto mb-3" />
          <p className="text-charcoal/40 text-sm">No RSVPs yet.</p>
          <p className="text-charcoal/30 text-xs mt-1">
            They&apos;ll appear here once attendees register for a free event.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([eventId, eventRsvps]) => {
            const event = eventMap[eventId];
            return (
              <div key={eventId} className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
                {/* Event header */}
                <div className="px-6 py-4 bg-warm-white border-b border-warm-gray flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-charcoal text-sm">
                      {event?.title ?? "Deleted Event"}
                    </h2>
                    {event?.date && (
                      <p className="text-charcoal/40 text-xs flex items-center gap-1 mt-0.5">
                        <CalendarDays className="w-3 h-3" /> {event.date}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                    {eventRsvps.length} {eventRsvps.length === 1 ? "person" : "people"}
                  </span>
                </div>

                {/* RSVPs table */}
                <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead className="text-charcoal/40 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Registered</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray">
                    {eventRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-warm-white/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-charcoal">{rsvp.name}</td>
                        <td className="px-6 py-3 text-charcoal/60">
                          <a
                            href={`mailto:${rsvp.email}`}
                            className="hover:text-gold transition-colors"
                          >
                            {rsvp.email}
                          </a>
                        </td>
                        <td className="px-6 py-3 text-charcoal/40 text-xs">
                          {formatDate(rsvp.created_at)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <form
                            action={async () => {
                              "use server";
                              await deleteRsvp(rsvp.id, rsvp.event_id);
                            }}
                          >
                            <button
                              type="submit"
                              className="p-1.5 text-charcoal/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove RSVP"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
