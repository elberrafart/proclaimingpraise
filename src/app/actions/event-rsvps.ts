"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitRsvp(
  eventId: string,
  name: string,
  email: string,
  honeypot = ""
): Promise<{ error?: string }> {
  if (honeypot) return {};
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

export async function deleteRsvp(id: string) {
  "use server";
  const supabase = await createClient();
  await supabase.from("event_rsvps").delete().eq("id", id);
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/event-rsvps");
}
