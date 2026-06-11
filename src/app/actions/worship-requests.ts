"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitWorshipRequest(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  if (formData.get("website")) return { success: true };
  const supabase = await createClient();
  const { error } = await supabase.from("worship_requests").insert({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    city: formData.get("city") as string,
    purpose: formData.get("purpose") as "high" | "low",
    description: formData.get("description") as string,
    event_month: formData.get("event_month")
      ? Number(formData.get("event_month"))
      : null,
    event_day: formData.get("event_day")
      ? Number(formData.get("event_day"))
      : null,
    event_year: formData.get("event_year")
      ? Number(formData.get("event_year"))
      : null,
    event_time: (formData.get("event_time") as string) || null,
    date_tbd: formData.get("date_tbd") === "on",
  });

  if (error) return { error: "Something went wrong. Please try again." };
  return { success: true };
}

export async function updateRequestStatus(
  id: string,
  status: string,
  completedBy?: string | null
) {
  const supabase = await createClient();
  await supabase
    .from("worship_requests")
    .update({
      status: status as "new" | "contacted" | "completed",
      completed_by: status === "completed" ? (completedBy || null) : null,
    })
    .eq("id", id);
  revalidatePath("/admin/worship-requests");
}

export async function deleteWorshipRequest(id: string) {
  const supabase = await createClient();
  await supabase.from("worship_requests").delete().eq("id", id);
  revalidatePath("/admin/worship-requests");
}
