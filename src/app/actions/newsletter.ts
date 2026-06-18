"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNewsletterEmails } from "@/lib/email";

export async function subscribeNewsletter(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  if (formData.get("website")) return { success: true };

  const name  = (formData.get("name")  as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const city  = (formData.get("city")  as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name)               return { error: "Please enter your name." };
  if (!email)              return { error: "Please enter a valid email." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email." };
  if (!city)               return { error: "Please enter your city." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ name, email, city, phone, status: "active" });

  if (error) {
    // 23505 = unique_violation — email already subscribed, treat as success
    if (error.code === "23505") return { success: true };
    return { error: "Something went wrong. Please try again." };
  }

  void sendNewsletterEmails({ name, email, city });

  return { success: true };
}

export async function deleteSubscriber(id: string) {
  const supabase = await createClient();
  await supabase.from("newsletter_subscribers").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
}
