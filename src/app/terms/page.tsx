import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Proclaiming Praise",
  description: "Terms and conditions for using the Proclaiming Praise website and services.",
};

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Legal
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-white/50 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="bg-warm-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-8">

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Acceptance of Terms</h2>
              <p className="text-charcoal/70 leading-relaxed">
                By accessing and using the Proclaiming Praise website at proclaimingpraise.org, you accept and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use this website.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">About Proclaiming Praise</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Proclaiming Praise is a 501(c)(3) non-profit organization based in Southern California. Our mission is to advance the Kingdom of Heaven through worship. All donations are tax-deductible to the extent permitted by law.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Use of This Website</h2>
              <p className="text-charcoal/70 leading-relaxed mb-3">You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</p>
              <ul className="list-disc pl-6 space-y-2 text-charcoal/70">
                <li>Submit false, misleading, or fraudulent information through any form</li>
                <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
                <li>Use automated tools (bots, scrapers) to access or interact with the site</li>
                <li>Transmit any harmful, offensive, or disruptive content</li>
                <li>Impersonate any person or organization</li>
              </ul>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Event RSVPs & Registration</h2>
              <p className="text-charcoal/70 leading-relaxed">
                When you RSVP for a free event, you are reserving a spot and agreeing to attend. RSVPs are non-transferable. Proclaiming Praise reserves the right to cancel or reschedule events at any time. For paid events, you will be redirected to a third-party ticketing platform — their terms and refund policies apply. Proclaiming Praise is not responsible for transactions processed by third-party platforms.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Worship Requests</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Submitting a worship request does not guarantee a response or scheduled event. Requests are reviewed by our team and fulfilled based on availability, location, and other factors. By submitting a request, you consent to being contacted at the email and phone number you provide.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Donations</h2>
              <p className="text-charcoal/70 leading-relaxed">
                Donations made through our website are processed by Zeffy, a third-party payment platform. All donations are voluntary and non-refundable unless required by law. Proclaiming Praise is a 501(c)(3) organization — donations may be tax-deductible. Please consult a tax professional for guidance specific to your situation.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">User-Submitted Content</h2>
              <p className="text-charcoal/70 leading-relaxed">
                When you submit a praise report or testimonial, you grant Proclaiming Praise a non-exclusive, royalty-free license to display, edit, and share that content on our website and social media channels. You confirm that the content is your own and does not infringe any third-party rights. We reserve the right to decline or remove any submitted content at our discretion.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Intellectual Property</h2>
              <p className="text-charcoal/70 leading-relaxed">
                All content on this website — including text, images, logos, and video — is the property of Proclaiming Praise or its content suppliers and is protected by copyright law. You may not reproduce, distribute, or use our content without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Third-Party Links</h2>
              <p className="text-charcoal/70 leading-relaxed">
                This website may contain links to third-party websites (Instagram, YouTube, Zeffy, etc.). These links are provided for convenience only. Proclaiming Praise has no control over those sites and accepts no responsibility for their content or privacy practices.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Disclaimer of Warranties</h2>
              <p className="text-charcoal/70 leading-relaxed">
                This website is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the site will be uninterrupted, error-free, or free of viruses. Your use of the site is at your own risk.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Limitation of Liability</h2>
              <p className="text-charcoal/70 leading-relaxed">
                To the fullest extent permitted by law, Proclaiming Praise shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or any content found on it.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Changes to These Terms</h2>
              <p className="text-charcoal/70 leading-relaxed">
                We may update these Terms & Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes your acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-3">Contact</h2>
              <p className="text-charcoal/70 leading-relaxed">
                If you have questions about these terms, please contact us at{" "}
                <a href="mailto:info@proclaimingpraise.org" className="text-gold hover:underline">
                  info@proclaimingpraise.org
                </a>.
              </p>
            </div>

            <div className="pt-4 border-t border-warm-gray">
              <p className="text-charcoal/50 text-sm">
                See also our{" "}
                <Link href="/privacy" className="text-gold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
