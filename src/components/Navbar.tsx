"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Cross } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/giving", label: "Online Giving" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
              <Cross className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="text-white font-semibold text-lg tracking-tight block leading-tight">
                Proclaiming Praise
              </span>
              <span className="text-white/50 text-xs tracking-widest uppercase">
                501(c)(3) Non-Profit
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-gold transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/giving"
              className="ml-4 px-5 py-2.5 bg-gold text-deep-black font-semibold text-sm rounded-full hover:bg-gold-light transition-colors"
            >
              Give Now
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white/80 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-deep-black/95 backdrop-blur-md border-t border-white/10 animate-fade-in">
          <nav className="flex flex-col px-6 py-6 gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-white/80 hover:text-gold hover:bg-white/5 rounded-lg transition-colors text-lg"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/giving"
              onClick={() => setOpen(false)}
              className="mt-4 px-5 py-3 bg-gold text-deep-black font-semibold text-center rounded-full hover:bg-gold-light transition-colors"
            >
              Give Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
