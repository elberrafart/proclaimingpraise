"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Public submission — always saved as unpublished until admin reviews. */
export async function submitPraiseReport(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const supabase = await createClient();
  const { error } = await supabase.from("praise_reports").insert({
    quote: formData.get("quote") as string,
    name: formData.get("name") as string,
    role: (formData.get("role") as string) || "Community Member",
    published: false,
  });
  if (error) return { error: "Something went wrong. Please try again." };
  return { success: true };
}

export async function createPraiseReport(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("praise_reports").insert({
    quote: formData.get("quote") as string,
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    published: formData.get("published") === "on",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/praise-reports");
  revalidatePath("/");
}

export async function updatePraiseReport(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("praise_reports")
    .update({
      quote: formData.get("quote") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/praise-reports");
  revalidatePath("/");
}

export async function deletePraiseReport(id: string) {
  const supabase = await createClient();
  await supabase.from("praise_reports").delete().eq("id", id);
  revalidatePath("/admin/praise-reports");
  revalidatePath("/");
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient();
  await supabase.from("praise_reports").update({ published }).eq("id", id);
  revalidatePath("/admin/praise-reports");
  revalidatePath("/");
}
