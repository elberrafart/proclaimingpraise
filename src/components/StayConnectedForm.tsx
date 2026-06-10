"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { CheckCircle } from "lucide-react";

export function StayConnectedForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, undefined);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-emerald-400 max-w-md mx-auto py-4">
        <CheckCircle className="w-8 h-8" />
        <p className="text-sm font-medium">You&apos;re in! Welcome to the community.</p>
      </div>
    );
  }

  return (
    <form action={action} className="max-w-lg mx-auto space-y-3">
      {/* Row 1: Name + Email */}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="name"
          type="text"
          required
          placeholder="Your name *"
          className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email address *"
          className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
      </div>

      {/* Row 2: City + Phone */}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="city"
          type="text"
          required
          placeholder="City *"
          className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-center pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-10 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {pending ? "Joining…" : "Stay Connected"}
        </button>
      </div>

      {state?.error && (
        <p className="text-red-400 text-xs text-center">{state.error}</p>
      )}
    </form>
  );
}
