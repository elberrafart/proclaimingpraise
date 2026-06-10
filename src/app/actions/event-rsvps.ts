"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitRsvp(
  eventId: string,
  name: string,
  email: string
): Promise<{ error?: string }> {
  if (!name.trim() || !email.trim()) return { error: "Name and email are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("event_rsvps").insert({
    event_id: eventId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
  });

  if (error) return { error: error.message };
  return {};
}
