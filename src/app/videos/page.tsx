import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Video Testimonies | Proclaiming Praise",
  description: "Watch video testimonies and worship moments from Proclaiming Praise.",
};

// ---------------------------------------------------------------------------
// YouTube helpers (server-side — no client needed for iframe rendering)
// ---------------------------------------------------------------------------
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("?")[0];
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1].split("?")[0];
    }
  } catch {}
  return null;
}

function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}?rel=0`;
}

export default async function VideosPage() {
  const supabase = await createClient();

  // Filter by show_on_videos when the column exists;
  // fall back to all published videos if the DB migration hasn't been run yet.
  let { data: videos, error } = await supabase
    .from("video_testimonies")
    .select("*")
    .eq("published", true)
    .eq("show_on_videos", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    ({ data: videos } = await supabase
      .from("video_testimonies")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }));
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Watch &amp; Be Inspired
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            Video Testimonies
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Moments of worship, praise, and transformation — straight from our community.
          </p>
        </div>
      </section>

      {/* Videos grid */}
      <section className="bg-warm-white py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {!videos?.length ? (
            <div className="text-center py-20">
              <p className="text-charcoal/50 mb-6">No videos yet — check back soon!</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => {
                const youTubeId = getYouTubeId(video.video_url);
                return (
                  <div
                    key={video.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Player */}
                    <div className="relative aspect-video bg-black">
                      {youTubeId ? (
                        <iframe
                          src={youTubeEmbedUrl(youTubeId)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          className="w-full h-full"
                          title={video.title}
                        />
                      ) : (
                        <video
                          src={video.video_url}
                          poster={video.thumbnail_url ?? undefined}
                          controls
                          preload="metadata"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h2 className="font-semibold text-charcoal leading-snug mb-1">
                        {video.title}
                      </h2>
                      {video.description && (
                        <p className="text-charcoal/50 text-sm line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
