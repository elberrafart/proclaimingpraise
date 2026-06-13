"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendWorshipRequestEmails } from "@/lib/email";

export async function submitWorshipRequest(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  if (formData.get("website")) return { success: true };

  const name        = formData.get("name") as string;
  const email       = formData.get("email") as string;
  const phone       = formData.get("phone") as string;
  const city        = formData.get("city") as string;
  const purpose     = formData.get("purpose") as "high" | "low";
  const description = formData.get("description") as string;
  const month       = formData.get("event_month") ? Number(formData.get("event_month")) : null;
  const day         = formData.get("event_day")   ? Number(formData.get("event_day"))   : null;
  const year        = formData.get("event_year")  ? Number(formData.get("event_year"))  : null;
  const time        = (formData.get("event_time") as string) || null;
  const dateTbd     = formData.get("date_tbd") === "on";

  const supabase = await createClient();
  const { error } = await supabase.from("worship_requests").insert({
    name, email, phone, city, purpose, description,
    event_month: month, event_day: day, event_year: year,
    event_time: time, date_tbd: dateTbd,
  });

  if (error) return { error: "Something went wrong. Please try again." };

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const eventDate = dateTbd
    ? "TBD"
    : month && day && year
      ? `${MONTHS[month - 1]} ${day}, ${year}`
      : undefined;

  void sendWorshipRequestEmails({ name, email, phone, city, purpose, description, eventDate });

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
