"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { CheckCircle, ArrowRight } from "lucide-react";

const STEPS = [
  { field: "email", type: "email",  label: "What's your email address?",      placeholder: "you@example.com",      required: true  },
  { field: "name",  type: "text",   label: "What's your name?",               placeholder: "First and last name",   required: true  },
  { field: "city",  type: "text",   label: "What city are you in?",           placeholder: "e.g. Los Angeles",     required: true  },
  { field: "phone", type: "tel",    label: "Best number to reach you? (optional)", placeholder: "Phone number",   required: false },
] as const;

type Fields = { email: string; name: string; city: string; phone: string; website: string };
type Phase  = "idle" | "exit" | "enter";

export function StayConnectedForm() {
  const [step,   setStep]   = useState(0);
  const [phase,  setPhase]  = useState<Phase>("idle");
  const [values, setValues] = useState<Fields>({ email: "", name: "", city: "", phone: "", website: "" });
  const [error,  setError]  = useState<string | null>(null);
  const [done,   setDone]   = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef     = useRef<HTMLInputElement>(null);
  const isFirstMount = useRef(true);

  // Focus the input whenever the step advances, but never on the initial page load
  // (autoFocus would scroll the footer into view on every page)
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    inputRef.current?.focus();
  }, [step]);

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  const inputStyle: React.CSSProperties = {
    transform:  phase === "exit" ? "translateX(-48px)" : phase === "enter" ? "translateX(48px)" : "translateX(0)",
    opacity:    phase === "idle" ? 1 : 0,
    transition: "transform 180ms ease, opacity 180ms ease",
  };

  function validate() {
    const val = values[current.field].trim();
    if (current.required && !val) {
      setError(`Please enter your ${current.placeholder.toLowerCase()}.`);
      return false;
    }
    if (current.field === "email" && !/\S+@\S+\.\S+/.test(val)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleNext() {
    if (!validate()) return;

    if (isLast) {
      const fd = new FormData();
      (Object.entries(values) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
      fd.set("website", values.website);
      startTransition(async () => {
        const result = await subscribeNewsletter(undefined, fd);
        if (result?.error) setError(result.error);
        else setDone(true);
      });
      return;
    }

    // Slide current input out left, then bring next input in from right
    setPhase("exit");
    setTimeout(() => {
      setStep((s) => s + 1);
      setPhase("enter");
      setTimeout(() => setPhase("idle"), 30);
    }, 180);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); handleNext(); }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 text-emerald-400 py-4">
        <CheckCircle className="w-10 h-10" />
        <p className="text-base font-medium text-white">You&apos;re in! Welcome to the community.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Step label */}
      <p className="text-white/60 text-sm mb-3 min-h-[20px]">{current.label}</p>

      {/* Input (animated) + Button (fixed) */}
      <div className="flex items-center gap-3">
        <div className="flex-1 overflow-hidden">
          <div style={inputStyle}>
            <input
              ref={inputRef}
              key={step}
              type={current.type}
              value={values[current.field]}
              onChange={(e) => setValues((v) => ({ ...v, [current.field]: e.target.value }))}
              onKeyDown={handleKeyDown}
              placeholder={current.placeholder}
              className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="shrink-0 flex items-center gap-2 px-6 py-3 bg-gold text-deep-black font-semibold rounded-full hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {isPending ? "…" : isLast ? "Join" : <><span>Next</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-xs mt-2 pl-2">{error}</p>}

      {/* Progress dots */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === step ? "16px" : "6px",
              height:     "6px",
              background: i < step ? "rgba(212,175,55,0.6)" : i === step ? "rgb(212,175,55)" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
