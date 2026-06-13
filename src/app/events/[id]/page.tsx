import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { EventRegistrationButton } from "@/components/EventRegistrationButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description, image_url")
    .eq("id", id)
    .single();

  if (!event) return { title: "Event Not Found | Proclaiming Praise" };

  return {
    title: `${event.title} | Proclaiming Praise`,
    description: event.description ?? "Join us for worship and praise.",
    openGraph: {
      title: event.title,
      description: event.description ?? "Join us for worship and praise.",
      images: event.image_url ? [event.image_url] : [],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

  return (
    <>
      {/* Full-bleed hero */}
      <section className="relative min-h-[85vh] flex flex-col">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={
            event.image_url
              ? {
                  backgroundImage: `url('${event.image_url}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: "linear-gradient(135deg, #111111 0%, #2a2020 50%, #1a1a1a 100%)" }
          }
        />

        {/* Layered gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/10 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        {/* Top navigation bar */}
        <div className="relative z-10 pt-28 px-6 max-w-6xl mx-auto w-full animate-fade-in">
          <div className="flex items-center justify-between">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/80 hover:text-white text-sm rounded-full transition-all border border-white/10 hover:border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              All Events
            </Link>

            {event.featured && (
              <div className="px-4 py-1.5 bg-gold text-deep-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-gold/20">
                Featured
              </div>
            )}
          </div>
        </div>

        {/* Hero title + meta — pinned to bottom */}
        <div className="relative z-10 mt-auto px-6 pb-20 max-w-6xl mx-auto w-full">
          <div className="animate-fade-in-up">
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.05] max-w-4xl">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                {event.date}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                {event.time}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating content card */}
      <section className="bg-warm-white pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 -mt-16 relative z-10 overflow-hidden animate-scale-in">
            {/* Gold accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

            <div className="p-8 md:p-12">
              {event.description ? (
                <p className="text-charcoal/70 text-lg leading-relaxed mb-10">
                  {event.description}
                </p>
              ) : (
                <p className="text-charcoal/40 text-base italic mb-10">
                  Join us for a time of worship and praise.
                </p>
              )}

              <div className="border-t border-warm-gray pt-8 flex flex-col gap-6">
                <EventRegistrationButton
                  eventId={event.id}
                  eventTitle={event.title}
                  registrationType={event.registration_type ?? "none"}
                  registrationUrl={event.registration_url ?? null}
                />

                {event.registration_type === "none" && (
                  <div className="flex items-start gap-4 p-5 bg-gold/5 border border-gold/15 rounded-2xl">
                    <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-charcoal font-semibold text-sm">
                        Free, walk-in event
                      </p>
                      <p className="text-charcoal/50 text-sm mt-0.5">
                        No registration needed — just show up and worship with us.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
