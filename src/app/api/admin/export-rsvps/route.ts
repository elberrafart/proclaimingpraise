import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EventRsvpRow, EventRow } from "@/types/database";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: rsvps }, { data: events }] = await Promise.all([
    supabase.from("event_rsvps").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("id, title, date"),
  ]);

  const eventMap = Object.fromEntries(
    (events ?? []).map((e: Pick<EventRow, "id" | "title" | "date">) => [e.id, e])
  );

  const rows: string[][] = [
    ["Event Title", "Event Date", "Name", "Email", "Registered Date"],
  ];

  for (const rsvp of (rsvps ?? []) as EventRsvpRow[]) {
    const event = eventMap[rsvp.event_id];
    rows.push([
      event?.title ?? "Unknown Event",
      event?.date ?? "",
      rsvp.name,
      rsvp.email,
      new Date(rsvp.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }),
    ]);
  }

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const filename = `event-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
