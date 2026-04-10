import { createClient } from "@/lib/supabase/server";
import { EventsClient } from "./EventsClient";

export const metadata = { title: "Events | Admin" };

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Events
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        Manage upcoming worship events shown on the public site.
      </p>
      <EventsClient events={events ?? []} />
    </div>
  );
}
