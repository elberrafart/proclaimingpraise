import Link from "next/link";
import { ArrowRight, BookOpen, Eye, Target } from "lucide-react";

export const metadata = {
  title: "About Us | Proclaiming Praise",
  description:
    "Get to know Proclaiming Praise — a Holy Spirit led non-profit ministry founded by Tyler & Sabrina Oakson, creating intentional spaces where worship exists beyond stages.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black/70 to-deep-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Get to Know Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            Praise Is on the Move
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            We are a Holy Spirit led non-profit ministry creating intentional
            spaces where worship exists beyond stages and into homes, hospitals,
            communities, and everyday moments.
          </p>
        </div>
      </section>

      {/* About Intro */}
      <section className="bg-warm-white py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <p className="text-charcoal/70 text-lg leading-relaxed mb-6">
            Our heart is to invite people into a lifestyle of praise — where
            worship becomes a response to God&apos;s presence in every season.
            Proclaiming Praise is about community, honesty, and making space for
            Jesus to move mightily in our lives.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 rounded-3xl bg-warm-white border border-warm-gray">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-gold font-medium mb-3">
                Mission Statement
              </h3>
              <p className="font-[family-name:var(--font-display)] text-2xl text-charcoal leading-snug">
                Advancing the Kingdom of Heaven one praise at a time.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-warm-white border border-warm-gray">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-gold font-medium mb-3">
                Vision Statement
              </h3>
              <p className="font-[family-name:var(--font-display)] text-2xl text-charcoal leading-snug">
                To be a movement that mobilizes worship music, creating intimate
                encounters with God for the gathering of His people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-warm-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-3">
              Our Story
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-charcoal">
              Tyler &amp; Sabrina Oakson
            </h2>
            <p className="text-charcoal/50 mt-3 text-lg">
              The founders of Proclaiming Praise
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 text-charcoal/70 text-lg leading-relaxed">
            <p>
              On April 23, 2024, Tyler and Sabrina stepped into the holy
              covenant of marriage. From the very beginning, they prayed that
              their union would be used for one purpose — advancing the Kingdom
              of Heaven.
            </p>

            <p>
              Even before their wedding day, God was shaping what would become
              Proclaiming Praise. Instead of a traditional wedding registry,
              Tyler and Sabrina felt led to invite friends and family to give
              toward a vision rooted in worship and community. Through that
              generosity, the foundation of this nonprofit was formed.
            </p>

            <p>
              Proclaiming Praise was born from a desire to bridge the gap between
              worship on stages and worship in the lives of everyday people. We
              believe worship belongs in homes, in moments of celebration and
              moments of hardship, in birthdays and hospital rooms alike. Every
              person is in need of Jesus, and He is worthy to be welcomed into it
              all.
            </p>

            <p>
              What began in a living room has now grown into multiple events each
              month — ranging from young adult worship nights gathering over 400
              people, to public praise events at beaches and schools, to personal
              moments of worship in hospital rooms and at birthday celebrations.
              In every setting, the heart remains the same: to create space for
              people to encounter God and experience authentic community.
            </p>

            <div className="bg-white rounded-2xl p-8 border border-warm-gray my-10">
              <BookOpen className="w-8 h-8 text-gold mb-4" />
              <p className="italic text-charcoal/80">
                At the center of every worship night stands a wooden cross
                handcrafted by a local woodworker in Puerto Vallarta, Mexico,
                where Tyler and Sabrina were married. That cross now rests in
                their home and is present at each gathering — as a reminder of
                the sacrificial love of Jesus Christ. It is the foundation of
                their marriage and the cornerstone of Proclaiming Praise.
              </p>
            </div>

            <p>
              There is power in praise. Proclaiming Praise exists to create
              intentional spaces where people can encounter God&apos;s presence
              one praise at a time.
            </p>

            <p className="font-[family-name:var(--font-display)] text-2xl text-charcoal text-center pt-6">
              It&apos;s time to praise. Join the movement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-white mb-6">
            Ready to Be Part of Something Bigger?
          </h2>
          <p className="text-white/60 mb-8">
            Join us at our next worship event or partner with us through giving.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all"
            >
              See Events <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/giving"
              className="px-8 py-4 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all"
            >
              Give Online
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
