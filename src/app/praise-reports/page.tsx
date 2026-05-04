import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PraiseReportsGrid } from "@/components/PraiseReportsGrid";

export const metadata = {
  title: "Praise Reports | Proclaiming Praise",
  description:
    "Read testimonies from the Proclaiming Praise community and share your own story.",
};

export default async function PraiseReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("praise_reports")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Testimonies
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            Praise Reports
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Stories of what God is doing through Proclaiming Praise — in lives,
            communities, and moments of worship.
          </p>
          <Link
            href="/praise-reports/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:gap-3"
          >
            Share Your Story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Reports */}
      <section className="bg-warm-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {!reports?.length ? (
            <div className="text-center py-20">
              <p className="text-charcoal/50 mb-6">
                No praise reports yet — be the first to share your story.
              </p>
              <Link
                href="/praise-reports/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all"
              >
                Submit a Report <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <PraiseReportsGrid reports={reports} />
              <div className="text-center mt-16">
                <Link
                  href="/praise-reports/submit"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:gap-3 text-lg"
                >
                  Share Your Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
