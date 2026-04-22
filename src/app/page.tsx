import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Users,
  Music,
  HandHeart,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { createClient } from "@/lib/supabase/server";
import { PraiseReportsGrid } from "@/components/PraiseReportsGrid";
import { VideoCarousel } from "@/components/VideoCarousel";
import { HeroVideo } from "@/components/HeroVideo";

export default async function Home() {
  const supabase = await createClient();

  // Fetch videos for homepage — filter by show_on_home when the column exists,
  // fall back to all published videos if the DB migration hasn't been run yet.
  async function fetchHomeVideos() {
    const { data, error } = await supabase
      .from("video_testimonies")
      .select("*")
      .eq("published", true)
      .eq("show_on_home", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      // Placement columns not yet in DB — return all published videos
      const { data: fallback } = await supabase
        .from("video_testimonies")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      return fallback;
    }
    return data;
  }

  const [
    { data: featuredEvent },
    { data: praiseReports },
    videos,
    { data: instagramPosts },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("praise_reports")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3),
    fetchHomeVideos(),
    supabase
      .from("instagram_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-deep-black">
          <HeroVideo />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-black/70 via-deep-black/60 to-deep-black" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <p className="animate-fade-in-up text-gold tracking-[0.3em] uppercase text-sm font-medium mb-6">
            501(c)(3) Non-Profit Ministry
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6">
            Advancing the
            <br />
            <span className="text-gradient-gold">Kingdom of Heaven</span>
          </h1>
          <p className="animate-fade-in-up animation-delay-400 text-xl sm:text-2xl text-white/80 font-light mb-10 max-w-2xl mx-auto">
            One Praise at a Time
          </p>
          <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/events"
              className="px-8 py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:scale-105 text-lg"
            >
              Upcoming Events
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── Next Event ─── */}
      <section className="relative bg-warm-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-3">
              Don&apos;t Miss Out
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-charcoal">
              Next Event
            </h2>
          </div>

          {featuredEvent ? (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto min-h-[320px]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: featuredEvent.image_url
                        ? `url('${featuredEvent.image_url}')`
                        : "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-gold rounded-full text-xs font-bold text-deep-black uppercase tracking-wider">
                    Upcoming
                  </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-charcoal mb-6">
                    {featuredEvent.title}
                  </h3>

                  {featuredEvent.description && (
                    <p className="text-charcoal/60 leading-relaxed mb-6 text-sm">
                      {featuredEvent.description}
                    </p>
                  )}

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-charcoal/70">
                      <MapPin className="w-5 h-5 text-gold shrink-0" />
                      <span>{featuredEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-charcoal/70">
                      <Calendar className="w-5 h-5 text-gold shrink-0" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-charcoal/70">
                      <Clock className="w-5 h-5 text-gold shrink-0" />
                      <span>{featuredEvent.time}</span>
                    </div>
                  </div>

                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:gap-3 self-start"
                  >
                    See All Events
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-black/5 p-16 text-center">
              <p className="text-charcoal/50 mb-6">
                No upcoming events at the moment — check back soon!
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all"
              >
                View Events Page
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Mission Pillars ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-3">
              Our Mission
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-charcoal mb-4">
              What We&apos;re About
            </h2>
            <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">
              We are a Holy Spirit led ministry creating intentional spaces where
              worship exists beyond stages into homes, hospitals, communities,
              and everyday moments.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Music,
                title: "Worship",
                description:
                  "Creating powerful moments of praise in public spaces and gatherings.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "Building authentic connections through shared faith and fellowship.",
              },
              {
                icon: Heart,
                title: "Outreach",
                description:
                  "Taking the message of hope beyond church walls into our neighborhoods.",
              },
              {
                icon: HandHeart,
                title: "Generosity",
                description:
                  "Serving others and making an impact through sacrificial giving.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="group text-center p-8 rounded-2xl hover:bg-warm-white transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <pillar.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">
                  {pillar.title}
                </h3>
                <p className="text-charcoal/60 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Image Banner / CTA ─── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-deep-black">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black/80 to-deep-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Join the Movement
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Whether you worship, volunteer, or give — there&apos;s a place for you in
            what God is doing through Proclaiming Praise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/giving"
              className="px-8 py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:scale-105 text-lg"
            >
              Give Online
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all text-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Video Testimonies Carousel ─── */}
      <section className="bg-deep-black py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-3">
              Hear From Our Community
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white">
              Video Testimonies
            </h2>
          </div>

          {videos && videos.length > 0 ? (
            <>
              <VideoCarousel videos={videos} />
              <div className="text-center mt-12">
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
                >
                  Watch All Videos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 border border-white/10 rounded-3xl">
              <p className="text-white/40 mb-6">
                Video testimonies coming soon — check back after our next event.
              </p>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
              >
                Visit Videos Page
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Instagram Feed ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-3">
              Follow Along
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-charcoal mb-4">
              @proclaimingpraise
            </h2>
            <a
              href="https://www.instagram.com/proclaimingpraise"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-charcoal/50 hover:text-gold transition-colors text-sm"
            >
              <InstagramIcon className="w-4 h-4" />
              Follow us on Instagram
            </a>
          </div>

          {instagramPosts && instagramPosts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {instagramPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-warm-gray"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image_url}
                    alt={post.caption ?? ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-deep-black/0 group-hover:bg-deep-black/60 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 px-4 text-center">
                      <InstagramIcon className="w-6 h-6 text-white" />
                      {post.caption && (
                        <p className="text-white text-xs leading-relaxed line-clamp-3">
                          {post.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/proclaimingpraise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-warm-gray flex items-center justify-center hover:bg-warm-gray/70 transition-colors"
                >
                  <InstagramIcon className="w-8 h-8 text-charcoal/20 group-hover:text-gold/40 transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Praise Reports Preview ─── */}
      {praiseReports && praiseReports.length > 0 && (
        <section className="bg-warm-white py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-3">
                Testimonies
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-charcoal">
                Praise Reports
              </h2>
            </div>

            <div className="max-w-5xl mx-auto">
              <PraiseReportsGrid reports={praiseReports} />
            </div>

            <div className="text-center mt-12">
              <Link
                href="/praise-reports"
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
              >
                Read More Stories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
