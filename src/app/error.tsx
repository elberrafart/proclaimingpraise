"use client";

import { useEffect } from "react";
import { Cross } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-deep-black flex items-center justify-center mb-6">
        <Cross className="w-6 h-6 text-gold" />
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-charcoal mb-3">
        Something went wrong
      </h1>
      <p className="text-charcoal/50 text-sm mb-8 max-w-sm">
        An unexpected error occurred. Please try again — if the problem persists,
        contact us.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-gold text-deep-black text-sm font-semibold rounded-full hover:bg-gold/90 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-warm-gray text-charcoal/60 text-sm font-medium rounded-full hover:border-charcoal/30 transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
