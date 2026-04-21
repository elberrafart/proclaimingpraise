import { createClient } from "@/lib/supabase/server";
import { InstagramClient } from "./InstagramClient";

export const metadata = { title: "Instagram | Admin" };

export default async function AdminInstagramPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("instagram_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Instagram Feed
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        The feed auto-syncs daily from your Instagram account (requires{" "}
        <code className="text-xs bg-warm-gray px-1.5 py-0.5 rounded">INSTAGRAM_ACCESS_TOKEN</code>{" "}
        env var). You can also sync manually, add posts by URL, or toggle
        individual posts on/off. The 6 most recent published posts appear on the homepage.
      </p>
      <InstagramClient posts={posts ?? []} />
    </div>
  );
}
