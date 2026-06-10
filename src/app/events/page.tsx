import { createClient } from "@/lib/supabase/server";
import { Calendar, MapPin, Clock } from "lucide-react";
import { EventRegistrationButton } from "@/components/EventRegistrationButton";

export const metadata = {
  title: "Events | Proclaiming Praise",
  description:
    "Join us at our upcoming worship events and praise gatherings across Southern California.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true });

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Gather With Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            Upcoming Events
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Experience worship in beautiful, unexpected places. All events are
            free and open to everyone.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="bg-warm-white py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-8">
          {!events?.length ? (
            <p className="text-center text-charcoal/50 py-20">
              No upcoming events right now — check back soon!
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden"
              >
                <div className="grid md:grid-cols-5">
                  <div
                    className="md:col-span-2 h-64 md:h-auto min-h-[250px] relative"
                    style={{
                      backgroundImage: event.image_url
                        ? `url('${event.image_url}')`
                        : "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {event.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-gold rounded-full text-xs font-bold text-deep-black uppercase tracking-wider">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-charcoal mb-4">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="text-charcoal/60 mb-6 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-charcoal/70">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold" />
                        {event.time}
                      </span>
                    </div>
                    <EventRegistrationButton
                      eventId={event.id}
                      eventTitle={event.title}
                      registrationType={event.registration_type ?? "none"}
                      registrationUrl={event.registration_url ?? null}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
