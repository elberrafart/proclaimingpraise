import { createClient } from "@/lib/supabase/server";
import { deleteSubscriber } from "@/app/actions/newsletter";
import { Trash2 } from "lucide-react";

export const metadata = { title: "Newsletter | Admin" };

export default async function NewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Newsletter
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        {count ?? 0} active subscriber{count !== 1 ? "s" : ""}.
      </p>

      <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
        {!subscribers?.length ? (
          <p className="px-6 py-16 text-center text-charcoal/40 text-sm">
            No subscribers yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-warm-white text-charcoal/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Subscribed</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-warm-white/50 transition-colors">
                  <td className="px-6 py-4 text-charcoal font-medium">
                    {s.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-warm-gray text-charcoal/50"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-charcoal/40">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <form
                        action={async () => {
                          "use server";
                          await deleteSubscriber(s.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
