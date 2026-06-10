import { Heart, Shield, Lightbulb, Receipt } from "lucide-react";

export const metadata = {
  title: "Online Giving | Proclaiming Praise",
  description:
    "Support the mission of Proclaiming Praise. All donations are tax-deductible. EIN: 33-4660474.",
};

export default function GivingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black/70 to-deep-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Partner With Us
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            Your Gift Makes a Way
          </h1>
          <div className="text-white/60 text-lg max-w-2xl mx-auto space-y-2">
            <p>Proclaiming Praise is a 501(c)(3) nonprofit organization.</p>
            <p>All donations are tax-deductible.</p>
            <p className="text-white/40 text-base">EIN: 33-4660474</p>
          </div>
        </div>
      </section>

      {/* Zeffy Embed */}
      <section className="bg-warm-white py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
            <div className="p-8 md:p-10 text-center">
              <Heart className="w-10 h-10 text-gold mx-auto mb-4" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-charcoal mb-2">
                Proclaiming Praise Donations 2026
              </h2>
              <p className="text-charcoal/60 mb-1">
                Be Part of the Praise Movement
              </p>
              <p className="text-charcoal/50 text-sm mb-8">
                Help us advance the kingdom of heaven, one praise at a time!
              </p>

              {/* Zeffy Donation iframe */}
              <div className="rounded-2xl overflow-hidden border border-warm-gray">
                <iframe
                  title="Donation form powered by Zeffy"
                  src="https://www.zeffy.com/en-US/donation-form/proclaiming-praise-donations--2026"
                  style={{ width: "100%", minHeight: "700px", border: "none" }}
                  allow="payment"
                />
              </div>

              <p className="text-charcoal/40 text-xs mt-6">
                Powered by Zeffy — 100% of your donation goes to our mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-deep-black py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-6">
            The Impact of Your Generosity
          </h2>
          <p className="text-gold/80 text-lg mb-2">
            Proclaiming Praise is a movement that operates through generous
            giving.
          </p>
          <p className="text-white/50 mb-4">
            These are the three categories of funds that your gift will supply.
          </p>
          <p className="text-white/40 mb-16">
            Thank you for considering to partner with us!
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: "🎵",
                title: "Worship Events",
                text: "Equipment, venues, and production for worship gatherings — from sunset praises to young adult nights.",
              },
              {
                icon: "🤝",
                title: "Community Outreach",
                text: "Personal praise moments in homes, hospitals, and celebrations — meeting people where they are.",
              },
              {
                icon: "📖",
                title: "Ministry Resources",
                text: "Expanding our reach through media, materials, and tools to mobilize worship across communities.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-warm-white py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Safe",
                text: "All transactions are encrypted and processed through Zeffy's trusted platform.",
              },
              {
                icon: Receipt,
                title: "Tax Deductible",
                text: "You'll receive a tax receipt for every donation. EIN: 33-4660474.",
              },
              {
                icon: Lightbulb,
                title: "100% Goes to Mission",
                text: "We fundraise with Zeffy to ensure 100% of your donation goes to our mission.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
