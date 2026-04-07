import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Events | Proclaiming Praise",
  description: "Join us at our upcoming worship events and praise gatherings across Southern California.",
};

const events = [
  {
    title: "Public Praise Salt Creek Sunset",
    location: "Salt Creek Bluff Park, CA",
    date: "April 18, 2026",
    time: "6:00 PM",
    description:
      "Join us for a powerful evening of worship overlooking the Pacific Ocean as the sun sets. Bring a blanket, invite a friend, and come ready to praise.",
    featured: true,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    title: "Community Worship Night",
    location: "Southern California",
    date: "Coming Soon",
    time: "TBA",
    description:
      "An evening of intimate worship, prayer, and fellowship. Stay tuned for location details.",
    featured: false,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  },
];

export default function EventsPage() {
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
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="grid md:grid-cols-5">
                <div
                  className="md:col-span-2 h-64 md:h-auto min-h-[250px] relative"
                  style={{
                    backgroundImage: `url('${event.image}')`,
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
                  <p className="text-charcoal/60 mb-6 leading-relaxed">
                    {event.description}
                  </p>
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
                  {event.featured && (
                    <Link
                      href="#"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:gap-3 self-start"
                    >
                      Register Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
