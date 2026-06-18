"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendRsvpEmails } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitRsvp(
  eventId: string,
  name: string,
  email: string,
  honeypot = ""
): Promise<{ error?: string }> {
  if (honeypot) return {};
  if (!name.trim() || !email.trim()) return { error: "Name and email are required." };
  if (!EMAIL_RE.test(email.trim())) return { error: "Please enter a valid email address." };

  const supabase = await createClient();

  const [{ error }, { data: event }] = await Promise.all([
    supabase.from("event_rsvps").insert({
      event_id: eventId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    }),
    supabase
      .from("events")
      .select("title, date, time, location")
      .eq("id", eventId)
      .single(),
  ]);

  if (error) {
    if (error.code === "23505") return { error: "You're already registered for this event!" };
    return { error: error.message };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/admin/event-rsvps");

  void sendRsvpEmails({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    eventId,
    eventTitle:    event?.title    ?? "Upcoming Event",
    eventDate:     event?.date     ?? undefined,
    eventTime:     event?.time     ?? undefined,
    eventLocation: event?.location ?? undefined,
  });

  return {};
}

export async function deleteRsvp(id: string, eventId: string) {
  const supabase = await createClient();
  await supabase.from("event_rsvps").delete().eq("id", id);
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/admin/event-rsvps");
}
