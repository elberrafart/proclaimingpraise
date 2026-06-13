"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { CheckCircle } from "lucide-react";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, undefined);

  if (state?.success) {
    return (
      <div className="flex items-center justify-center gap-2 text-emerald-400 max-w-md mx-auto py-3">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">You&apos;re subscribed! Thank you.</span>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
      />
      <button
        type="submit"
        disabled={pending}
        className="px-8 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {pending ? "…" : "Subscribe"}
      </button>
      {state?.error && (
        <p className="text-red-400 text-xs text-center w-full mt-1">{state.error}</p>
      )}
    </form>
  );
}
