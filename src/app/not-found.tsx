import Link from "next/link";
import { Cross } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-deep-black flex items-center justify-center mb-6">
        <Cross className="w-6 h-6 text-gold" />
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-5xl text-charcoal mb-3">
        404
      </h1>
      <p className="text-charcoal/60 text-lg mb-2">Page not found</p>
      <p className="text-charcoal/40 text-sm mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gold text-deep-black text-sm font-semibold rounded-full hover:bg-gold/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
