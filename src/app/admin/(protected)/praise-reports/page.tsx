import { createClient } from "@/lib/supabase/server";
import { PraiseClient } from "./PraiseClient";

export const metadata = { title: "Praise Reports | Admin" };

export default async function PraiseReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("praise_reports")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Praise Reports
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        Manage testimonies shown on the public site.
      </p>
      <PraiseClient reports={reports ?? []} />
    </div>
  );
}
