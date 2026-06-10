import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
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
      {/* Hero image / dark header */}
      <section
        className="relative pt-32 pb-24 bg-deep-black overflow-hidden"
        style={
          event.image_url
            ? {
                backgroundImage: `url('${event.image_url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {event.image_url && (
          <div className="absolute inset-0 bg-deep-black/70" />
        )}
        {!event.image_url && (
          <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Events
          </Link>

          {event.featured && (
            <div className="inline-block mb-4 px-3 py-1.5 bg-gold rounded-full text-xs font-bold text-deep-black uppercase tracking-wider">
              Featured
            </div>
          )}

          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-white mb-6 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-5 text-white/70 text-sm">
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
        </div>
      </section>

      {/* Body */}
      <section className="bg-warm-white py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {event.description && (
            <p className="text-charcoal/70 text-lg leading-relaxed mb-10">
              {event.description}
            </p>
          )}

          <EventRegistrationButton
            eventId={event.id}
            eventTitle={event.title}
            registrationType={event.registration_type ?? "none"}
            registrationUrl={event.registration_url ?? null}
          />

          {event.registration_type === "none" && (
            <p className="text-charcoal/40 text-sm mt-4">
              This is a free, walk-in event — no registration needed. Just show up!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
