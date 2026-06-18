"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  Cross,
  LayoutDashboard,
  CalendarDays,
  HeartHandshake,
  Mail,
  Star,
  Play,
  LogOut,
  Users,
  Menu,
  X,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

const navLinks = [
  { href: "/admin",               label: "Dashboard",       icon: LayoutDashboard, exact: true },
  { href: "/admin/events",        label: "Events",          icon: CalendarDays },
  { href: "/admin/event-rsvps",   label: "Event RSVPs",     icon: Users },
  { href: "/admin/worship-requests", label: "Worship Requests", icon: HeartHandshake },
  { href: "/admin/newsletter",    label: "Stay Connected",  icon: Mail },
  { href: "/admin/praise-reports",label: "Praise Reports",  icon: Star },
  { href: "/admin/videos",        label: "Videos",          icon: Play },
  { href: "/admin/instagram",     label: "Instagram",       icon: InstagramIcon },
];

export function AdminSidebar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-warm-gray flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-deep-black flex items-center justify-center shrink-0">
            <Cross className="w-3 h-3 text-gold" />
          </div>
          <span className="text-sm font-semibold text-charcoal">Proclaiming Praise</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-warm-white rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ── Backdrop ───────────────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={[
          // Base
          "bg-white border-r border-warm-gray flex flex-col",
          // Mobile: fixed overlay, slides in/out
          "fixed inset-y-0 left-0 z-50 w-64",
          "transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop: back to normal flow, always visible
          "md:static md:translate-x-0 md:transition-none md:z-auto",
          "md:w-64 md:shrink-0 md:min-h-screen md:sticky md:top-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-warm-gray flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" target="_blank">
            <div className="w-9 h-9 rounded-full bg-deep-black flex items-center justify-center shrink-0">
              <Cross className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal leading-tight">
                Proclaiming Praise
              </p>
              <p className="text-xs text-charcoal/40">Admin</p>
            </div>
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1.5 text-charcoal/40 hover:text-charcoal rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? "bg-gold/10 text-gold"
                  : "text-charcoal/60 hover:text-charcoal hover:bg-warm-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-warm-gray">
          <p className="px-3 text-xs text-charcoal/40 truncate mb-2">{email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal/60 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
