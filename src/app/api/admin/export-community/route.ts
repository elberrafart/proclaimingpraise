import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NewsletterSubscriberRow } from "@/types/database";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: string[][] = [
    ["Name", "Email", "City", "Phone", "Status", "Joined Date"],
  ];

  for (const s of (subscribers ?? []) as NewsletterSubscriberRow[]) {
    rows.push([
      s.name ?? "",
      s.email,
      s.city ?? "",
      s.phone ?? "",
      s.status,
      new Date(s.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }),
    ]);
  }

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const filename = `community-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
