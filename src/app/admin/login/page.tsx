"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Cross } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-deep-black flex items-center justify-center mb-4">
            <Cross className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-charcoal">
            Proclaiming Praise
          </h1>
          <p className="text-charcoal/50 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-warm-gray p-8">
          <h2 className="text-lg font-semibold text-charcoal mb-6">Sign in</h2>

          {state?.error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-gold text-deep-black font-semibold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-charcoal/40 mt-6">
          Proclaiming Praise Admin — Authorized Access Only
        </p>
      </div>
    </div>
  );
}
