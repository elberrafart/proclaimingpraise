"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { syncInstagramFeed, type SyncResult } from "@/lib/sync-instagram";

export async function createInstagramPost(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("instagram_posts").insert({
    image_url: formData.get("image_url") as string,
    post_url: formData.get("post_url") as string,
    caption: (formData.get("caption") as string) || null,
    published: formData.get("published") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function updateInstagramPost(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("instagram_posts")
    .update({
      image_url: formData.get("image_url") as string,
      post_url: formData.get("post_url") as string,
      caption: (formData.get("caption") as string) || null,
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function deleteInstagramPost(id: string) {
  const supabase = await createClient();
  await supabase.from("instagram_posts").delete().eq("id", id);
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function toggleInstagramPostPublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("instagram_posts").update({ published }).eq("id", id);
  revalidatePath("/admin/instagram");
  revalidatePath("/");
}

export async function syncInstagramNow(): Promise<SyncResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return { synced: 0, added: 0, updated: 0, error: "INSTAGRAM_ACCESS_TOKEN is not configured." };
  }
  const result = await syncInstagramFeed(accessToken);
  if (!result.error) {
    revalidatePath("/admin/instagram");
    revalidatePath("/");
  }
  return result;
}
