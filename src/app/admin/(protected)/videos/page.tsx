import { createClient } from "@/lib/supabase/server";
import { VideosClient } from "./VideosClient";

export const metadata = { title: "Videos | Admin" };

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("video_testimonies")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Video Testimonies
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        Upload video files (MP4, WebM, MOV) or paste a direct URL. Optionally add a
        thumbnail image shown before the video plays. Lower sort order numbers appear first.
      </p>
      <VideosClient videos={videos ?? []} />
    </div>
  );
}
