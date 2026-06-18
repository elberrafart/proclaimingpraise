"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const registrationType = (formData.get("registration_type") as string) || "none";
  const { error } = await supabase.from("events").insert({
    title: formData.get("title") as string,
    location: formData.get("location") as string,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    description: formData.get("description") as string,
    image_url: (formData.get("image_url") as string) || null,
    featured: formData.get("featured") === "on",
    registration_type: registrationType as "none" | "free_rsvp" | "paid",
    registration_url: registrationType === "paid" ? (formData.get("registration_url") as string) || null : null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient();
  const registrationType = (formData.get("registration_type") as string) || "none";
  const { error } = await supabase
    .from("events")
    .update({
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      description: formData.get("description") as string,
      image_url: (formData.get("image_url") as string) || null,
      featured: formData.get("featured") === "on",
      registration_type: registrationType as "none" | "free_rsvp" | "paid",
      registration_url: registrationType === "paid" ? (formData.get("registration_url") as string) || null : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  revalidatePath("/");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}
