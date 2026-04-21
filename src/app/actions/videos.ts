"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createVideo(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("video_testimonies").insert({
    title: formData.get("title") as string,
    video_url: formData.get("video_url") as string,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    description: (formData.get("description") as string) || null,
    autoplay: formData.get("autoplay") === "on",
    muted: formData.get("muted") === "on",
    loop: formData.get("loop") === "on",
    overlay_opacity: Number(formData.get("overlay_opacity") ?? 0),
    published: formData.get("published") === "on",
    show_on_home: formData.get("show_on_home") === "on",
    show_on_videos: formData.get("show_on_videos") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

export async function updateVideo(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("video_testimonies")
    .update({
      title: formData.get("title") as string,
      video_url: formData.get("video_url") as string,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      description: (formData.get("description") as string) || null,
      autoplay: formData.get("autoplay") === "on",
      muted: formData.get("muted") === "on",
      loop: formData.get("loop") === "on",
      overlay_opacity: Number(formData.get("overlay_opacity") ?? 0),
      published: formData.get("published") === "on",
      show_on_home: formData.get("show_on_home") === "on",
      show_on_videos: formData.get("show_on_videos") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

export async function deleteVideo(id: string) {
  const supabase = await createClient();
  await supabase.from("video_testimonies").delete().eq("id", id);
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

export async function toggleVideoPublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("video_testimonies").update({ published }).eq("id", id);
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}
