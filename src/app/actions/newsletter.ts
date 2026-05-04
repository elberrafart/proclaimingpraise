"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function subscribeNewsletter(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Please enter a valid email." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, status: "active" }, { onConflict: "email" });

  if (error) return { error: "Something went wrong. Please try again." };
  return { success: true };
}

export async function deleteSubscriber(id: string) {
  const supabase = await createClient();
  await supabase.from("newsletter_subscribers").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
}
