"use client";

import { useActionState } from "react";
import { submitPraiseReport } from "@/app/actions/praise-reports";
import { CheckCircle } from "lucide-react";

export default function SubmitPraiseReportPage() {
  const [state, action, pending] = useActionState(submitPraiseReport, undefined);

  if (state?.success) {
    return (
      <>
        <section className="relative pt-32 pb-20 bg-deep-black">
          <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <p className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-4">
              Share Your Story
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-4">
              Submit a Praise Report
            </h1>
          </div>
        </section>
        <section className="bg-warm-white py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="bg-white rounded-3xl shadow-sm p-12">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-4">
                Thank You!
              </h2>
              <p className="text-charcoal/60 leading-relaxed">
                Your praise report has been received. Our team will review it
                and share it with the community. Your testimony matters.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-deep-black">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black to-charcoal" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-sm font-medium mb-4">
            Share Your Story
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mb-4">
            Submit a Praise Report
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Has God moved in your life through Proclaiming Praise? We&apos;d love
            to hear your testimony and share it with our community.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-warm-white py-24">
        <div className="max-w-2xl mx-auto px-6">
          {state?.error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {state.error}
            </div>
          )}

          <form
            action={action}
            className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Your Name <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Sarah M."
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Your Role / Title
              </label>
              <input
                type="text"
                name="role"
                placeholder="e.g. Worship Attendee, Volunteer, Worship Warrior"
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Your Testimony <span className="text-gold">*</span>
              </label>
              <textarea
                name="quote"
                rows={6}
                required
                placeholder="Share what God has done in your life through Proclaiming Praise..."
                className="w-full px-4 py-3.5 bg-warm-white border border-warm-gray rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all text-lg mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? "Submitting…" : "Submit My Praise Report"}
            </button>

            <p className="text-center text-xs text-charcoal/40">
              Your report will be reviewed before being published to the site.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
