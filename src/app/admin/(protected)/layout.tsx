import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin | Proclaiming Praise" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-warm-white flex">
      <AdminSidebar email={user.email ?? ""} />
      <main className="flex-1 min-w-0 p-8 lg:p-10">{children}</main>
    </div>
  );
}
