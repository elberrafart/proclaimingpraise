import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact | Proclaiming Praise",
  description: "Get in touch with Proclaiming Praise. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em] uppercase text-sm font-medium mb-4">
            Reach Out
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-white mb-6">
            Contact Us
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have a question, want to partner with us, or just want to say hello?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-warm-white py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-6">
                  Get in Touch
                </h2>
                <p className="text-charcoal/60 leading-relaxed">
                  Whether you want to attend an event, volunteer, partner with
                  us, or just have a question — we&apos;re here for you.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Email</p>
                    <a
                      href="mailto:info@proclaimingpraise.org"
                      className="text-charcoal/60 hover:text-gold transition-colors"
                    >
                      info@proclaimingpraise.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">
                      Location
                    </p>
                    <p className="text-charcoal/60">Southern California</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">Phone</p>
                    <p className="text-charcoal/60">Available upon request</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-3">
              <form className="bg-white rounded-3xl shadow-sm p-8 md:p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-charcoal/60">
                    <option>General Inquiry</option>
                    <option>Event Information</option>
                    <option>Volunteering</option>
                    <option>Partnership</option>
                    <option>Giving</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
