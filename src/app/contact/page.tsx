"use client";

import { Mail, MapPin } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black/70 to-deep-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Social + Email Links */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <a
              href="https://www.instagram.com/proclaimingpraise"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white/80 hover:text-gold transition-colors text-lg"
            >
              <InstagramIcon className="w-6 h-6" />
              @proclaimingpraise
            </a>
            <a
              href="mailto:info@proclaimingpraise.org"
              className="inline-flex items-center gap-3 text-white/80 hover:text-gold transition-colors text-lg"
            >
              <Mail className="w-6 h-6" />
              info@proclaimingpraise.org
            </a>
          </div>

          <p className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Request Worship
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-4">
            Submit Your Proclaiming Praise Request
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Whether it&apos;s a celebration or a difficult season — we want to
            bring worship to you and your community.
          </p>
        </div>
      </section>

      {/* Request Form */}
      <section className="bg-warm-white py-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <form
            className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Name <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Email <span className="text-gold">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Phone <span className="text-gold">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                City <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                What is the Purpose for your Personal Praise Event?{" "}
                <span className="text-gold">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="purpose"
                    value="high"
                    required
                    className="w-5 h-5 accent-gold"
                  />
                  <span className="text-charcoal/70 group-hover:text-charcoal transition-colors">
                    High Season of Life: A time of celebration
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="purpose"
                    value="low"
                    className="w-5 h-5 accent-gold"
                  />
                  <span className="text-charcoal/70 group-hover:text-charcoal transition-colors">
                    Low Season of Life: A time of discouragement
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Please explain more about your situation, so that Proclaiming
                Praise can understand how to best serve you and your community:{" "}
                <span className="text-gold">*</span>
              </label>
              <textarea
                rows={5}
                required
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Date and Time of Event
              </label>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-charcoal/50 mb-1">
                    Month
                  </label>
                  <select className="w-full px-3 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-charcoal/70 text-sm">
                    <option value="">--</option>
                    {[
                      "Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec",
                    ].map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-charcoal/50 mb-1">
                    Day
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    placeholder="--"
                    className="w-full px-3 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-charcoal/50 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    min={2026}
                    placeholder="--"
                    className="w-full px-3 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-charcoal/50 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-3 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-gold" />
                <span className="text-charcoal/60 text-sm group-hover:text-charcoal transition-colors">
                  Date and Time TBD.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all text-lg mt-4"
            >
              Submit Request
            </button>
          </form>

          {/* Additional Contact */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-charcoal/50 text-sm">
              For general inquiries, reach us directly:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="mailto:info@proclaimingpraise.org"
                className="flex items-center gap-2 text-charcoal/70 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@proclaimingpraise.org
              </a>
              <a
                href="https://www.instagram.com/proclaimingpraise"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-charcoal/70 hover:text-gold transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                @proclaimingpraise
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
