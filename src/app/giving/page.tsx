import { Heart, Shield, CreditCard, Repeat } from "lucide-react";

export const metadata = {
  title: "Online Giving | Proclaiming Praise",
  description: "Support the mission of Proclaiming Praise through your generous online donations.",
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
            Online Giving
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Your generosity fuels our mission. Every gift helps us create more
            opportunities for people to encounter God through praise and worship.
          </p>
        </div>
      </section>

      {/* Giving Options */}
      <section className="bg-warm-white py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Giving CTA Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-10 md:p-14 text-center mb-16">
            <Heart className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-charcoal mb-4">
              Make a Difference Today
            </h2>
            <p className="text-charcoal/60 max-w-lg mx-auto mb-8 text-lg">
              As a 501(c)(3) non-profit, all donations to Proclaiming Praise are
              tax-deductible. Your giving directly supports worship events,
              community outreach, and ministry resources.
            </p>

            {/* Placeholder amounts */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {["$25", "$50", "$100", "$250", "Other"].map((amount) => (
                <button
                  key={amount}
                  className="px-6 py-3 rounded-full border-2 border-gold/30 text-charcoal font-semibold hover:bg-gold hover:text-deep-black hover:border-gold transition-all"
                >
                  {amount}
                </button>
              ))}
            </div>

            <button className="px-10 py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:scale-105 text-lg">
              Give Now
            </button>

            <p className="text-charcoal/40 text-sm mt-6">
              You will be redirected to our secure payment processor.
            </p>
          </div>

          {/* Trust Signals */}
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Safe",
                text: "All transactions are encrypted and processed through trusted payment providers.",
              },
              {
                icon: CreditCard,
                title: "Tax Deductible",
                text: "Proclaiming Praise is a registered 501(c)(3). You'll receive a receipt for your records.",
              },
              {
                icon: Repeat,
                title: "Recurring Giving",
                text: "Set up automatic monthly giving to provide consistent support for our ministry.",
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
