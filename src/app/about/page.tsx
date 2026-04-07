import Link from "next/link";
import { ArrowRight, BookOpen, Eye, Target } from "lucide-react";

export const metadata = {
  title: "About Us | Proclaiming Praise",
  description:
    "Learn about Proclaiming Praise — a 501(c)(3) non-profit advancing the Kingdom of Heaven through public worship and community.",
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
          <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Who We Are
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            About Us
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Proclaiming Praise is a 501(c)(3) non-profit ministry rooted in the
            belief that worship transforms lives, communities, and nations.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-warm-white py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal/70 text-lg leading-relaxed mb-8">
              What started as a simple act of praise has grown into a movement.
              Proclaiming Praise exists to take worship outside the four walls of
              the church — into parks, beaches, neighborhoods, and wherever
              people gather. We believe that when praise goes up, blessings come
              down, and lives are forever changed.
            </p>
            <p className="text-charcoal/70 text-lg leading-relaxed">
              Our team is passionate about creating authentic worship experiences
              that are open to everyone — no matter where you are in your faith
              journey. From sunset praise gatherings at Salt Creek Bluff to
              community outreach events across Southern California, we are
              advancing the Kingdom of Heaven, one praise at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To proclaim the goodness of God through public praise, worship gatherings, and community engagement that draws people into a relationship with Jesus Christ.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To see communities across the nation transformed by the power of worship — where praise is proclaimed boldly and lives are changed by God's love.",
              },
              {
                icon: BookOpen,
                title: "Our Values",
                text: "Authenticity in worship. Boldness in proclamation. Generosity in service. Unity in community. Excellence in all we do for His glory.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-warm-white border border-warm-gray"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-charcoal/60 leading-relaxed">{item.text}</p>
              </div>
            ))}
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
