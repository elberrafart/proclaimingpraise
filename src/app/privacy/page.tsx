import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Proclaiming Praise",
  description: "How Proclaiming Praise collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Legal
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="bg-warm-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 prose prose-charcoal max-w-none space-y-8">

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Who We Are</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Proclaiming Praise is a 501(c)(3) non-profit worship ministry based in Southern California.
                Our website is located at{" "}
                <a href="https://www.proclaimingpraise.org" className="text-gold hover:underline">
                  proclaimingpraise.org
                </a>
                . You can reach us at{" "}
                <a href="mailto:info@proclaimingpraise.org" className="text-gold hover:underline">
                  info@proclaimingpraise.org
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">What Information We Collect</h2>
              <p className="text-charcoal/70 leading-relaxed mb-3">
                We only collect information you voluntarily provide through our forms:
              </p>
              <ul className="list-disc list-inside space-y-2 text-charcoal/70">
                <li><strong>Stay Connected form</strong> — name, email address, city, and optionally phone number.</li>
                <li><strong>Worship Request form</strong> — name, email address, phone number, city, event details, and a description of your situation.</li>
                <li><strong>Event RSVP</strong> — name and email address.</li>
                <li><strong>Praise Report submission</strong> — name, role/title, and your testimony.</li>
              </ul>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                We do not collect payment information directly. Donations and paid event registrations
                are processed by Zeffy, a third-party platform with its own privacy policy.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-charcoal/70">
                <li>To follow up on worship requests and connect you with our team.</li>
                <li>To confirm your RSVP and send event reminders.</li>
                <li>To send community updates if you join our Stay Connected list.</li>
                <li>To review and publish praise reports on our website (with your consent via submission).</li>
              </ul>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                We do not sell, rent, or share your personal information with third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Data Storage</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Your information is stored securely in our database hosted by{" "}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Supabase
                </a>
                , which uses industry-standard encryption at rest and in transit. Our website is
                hosted on{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Vercel
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Your Rights</h2>
              <p className="text-charcoal/70 leading-relaxed">
                You may request to view, update, or delete any personal information we hold about you
                at any time. To make a request, email us at{" "}
                <a href="mailto:info@proclaimingpraise.org" className="text-gold hover:underline">
                  info@proclaimingpraise.org
                </a>
                . We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Cookies</h2>
              <p className="text-charcoal/70 leading-relaxed">
                We use only functional cookies necessary for authentication on the admin portal.
                We do not use advertising or tracking cookies.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Contact</h2>
              <p className="text-charcoal/70 leading-relaxed">
                If you have any questions about this policy, please contact us at{" "}
                <a href="mailto:info@proclaimingpraise.org" className="text-gold hover:underline">
                  info@proclaimingpraise.org
                </a>
                .
              </p>
            </div>

          </div>

          <div className="text-center mt-10">
            <Link href="/" className="text-sm text-charcoal/40 hover:text-gold transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
