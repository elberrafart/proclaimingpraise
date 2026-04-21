"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import type { VideoTestimony } from "@/types/database";

// ---------------------------------------------------------------------------
// YouTube helpers
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

function youTubeEmbedUrl(
  id: string,
  { autoplay = false, muted = false, loop = false } = {}
): string {
  const p = new URLSearchParams({ rel: "0" });
  if (autoplay) p.set("autoplay", "1");
  if (muted || autoplay) p.set("mute", "1");
  if (loop) { p.set("loop", "1"); p.set("playlist", id); }
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}

function youTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ---------------------------------------------------------------------------
// VideoCarousel
// ---------------------------------------------------------------------------
export function VideoCarousel({ videos }: { videos: VideoTestimony[] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(videos.find((v) => v.video_url)?.muted ?? false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const validVideos = videos.filter((v) => v.video_url);
  if (!validVideos.length) return null;

  const video = validVideos[current] ?? validVideos[0];
  const youTubeId = getYouTubeId(video.video_url);
  const isYouTube = !!youTubeId;
  const isAutoplay = video.autoplay;
  const shouldPlay = playing || isAutoplay;
  const hasOverlay = video.overlay_opacity > 0;
  const overlayBg = `rgba(0,0,0,${video.overlay_opacity / 100})`;
  const thumbnailSrc =
    video.thumbnail_url ?? (youTubeId ? youTubeThumbnail(youTubeId) : null);

  function goTo(i: number) {
    setCurrent(i);
    setPlaying(false);
    setMuted(validVideos[i]?.muted ?? false);
  }
  function prev() { goTo((current - 1 + validVideos.length) % validVideos.length); }
  function next() { goTo((current + 1) % validVideos.length); }
  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  }

  return (
    // `group` here lets child elements react to hovering anywhere on the carousel
    <div className="w-full group">

      {/* ── Player ── */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black max-w-3xl mx-auto shadow-2xl">
        {shouldPlay ? (
          <>
            {isYouTube ? (
              <iframe
                key={video.id}
                src={youTubeEmbedUrl(youTubeId!, {
                  autoplay: true,
                  muted: isAutoplay,
                  loop: video.loop,
                })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title={video.title}
              />
            ) : (
              <video
                ref={videoRef}
                key={video.id}
                src={video.video_url}
                poster={video.thumbnail_url ?? undefined}
                controls={!isAutoplay}
                autoPlay
                muted={muted}
                loop={video.loop}
                playsInline
                className={`w-full h-full bg-black ${isAutoplay ? "object-cover" : "object-contain"}`}
              />
            )}

            {/* Overlay */}
            {hasOverlay && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: overlayBg }}
              />
            )}

            {/* Title / description overlaid — fades on hover */}
            {isAutoplay && hasOverlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8 z-10 text-center pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-white drop-shadow-lg mb-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-white/80 text-sm max-w-lg leading-relaxed drop-shadow">
                    {video.description}
                  </p>
                )}
              </div>
            )}

            {/* Mute toggle — native video only */}
            {isAutoplay && !isYouTube && (
              <button
                onClick={toggleMute}
                className="absolute bottom-3 right-3 z-20 w-9 h-9 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </>
        ) : (
          <>
            {thumbnailSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailSrc} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-charcoal to-deep-black" />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group/btn"
              aria-label={`Play ${video.title}`}
            >
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-xl">
                <Play className="w-8 h-8 text-deep-black fill-deep-black ml-1" />
              </div>
            </button>
          </>
        )}

        {/* Navigation arrows */}
        {validVideos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* ── Title below player — fades on hover ── */}
      {!(isAutoplay && hasOverlay) && (
        <div className="text-center mt-6 max-w-2xl mx-auto px-4 transition-opacity duration-500 group-hover:opacity-0">
          <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-white mb-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-white/50 text-sm leading-relaxed">{video.description}</p>
          )}
        </div>
      )}

      {/* ── Dot indicators ── */}
      {validVideos.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {validVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to video ${i + 1}`}
              className={`transition-all rounded-full ${
                i === current
                  ? "w-6 h-2 bg-gold"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnail strip for 3+ videos ── */}
      {validVideos.length > 2 && (
        <div className="flex justify-center gap-3 mt-6 px-4 overflow-x-auto pb-2">
          {validVideos.map((v, i) => {
            const ytId = getYouTubeId(v.video_url);
            const thumb = v.thumbnail_url ?? (ytId ? youTubeThumbnail(ytId) : null);
            return (
              <button
                key={v.id}
                onClick={() => goTo(i)}
                className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden transition-all ${
                  i === current ? "ring-2 ring-gold opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={v.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-charcoal flex items-center justify-center">
                    <Play className="w-4 h-4 text-white/40" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
