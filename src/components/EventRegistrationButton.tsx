"use client";

import { useState, useTransition } from "react";
import { ArrowRight, X, CheckCircle } from "lucide-react";
import { submitRsvp } from "@/app/actions/event-rsvps";
import type { RegistrationType } from "@/types/database";

interface Props {
  eventId: string;
  eventTitle: string;
  registrationType: RegistrationType;
  registrationUrl: string | null;
}

export function EventRegistrationButton({
  eventId,
  eventTitle,
  registrationType,
  registrationUrl,
}: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (registrationType === "none") return null;

  if (registrationType === "paid") {
    return (
      <a
        href={registrationUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:gap-3 self-start"
      >
        Register <ArrowRight className="w-4 h-4" />
      </a>
    );
  }

  // free_rsvp
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const honeypot = fd.get("website") as string;
    setError(null);
    startTransition(async () => {
      const result = await submitRsvp(eventId, name, email, honeypot);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  function handleClose() {
    setOpen(false);
    setDone(false);
    setError(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-all hover:gap-3 self-start"
      >
        I&apos;ll Be There <ArrowRight className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {done ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-charcoal/60 text-sm">
                  We&apos;ll see you at <span className="font-medium text-charcoal">{eventTitle}</span>.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2.5 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-colors text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-charcoal mb-1">
                  Count me in!
                </h3>
                <p className="text-charcoal/50 text-sm mb-6">
                  {eventTitle}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 mb-1">
                      Your name <span className="text-gold">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      autoFocus
                      placeholder="First and last name"
                      className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 mb-1">
                      Email address <span className="text-gold">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-colors disabled:opacity-60 text-sm"
                  >
                    {isPending ? "Saving…" : "Reserve my spot"}
                  </button>
                  <p className="text-center text-charcoal/40 text-xs">
                    This is a free event — no payment needed.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
