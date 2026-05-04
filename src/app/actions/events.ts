"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    title: formData.get("title") as string,
    location: formData.get("location") as string,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    description: formData.get("description") as string,
    image_url: (formData.get("image_url") as string) || null,
    featured: formData.get("featured") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient();
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
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
