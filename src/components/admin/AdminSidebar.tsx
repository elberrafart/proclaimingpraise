"use client";

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
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/event-rsvps", label: "Event RSVPs", icon: Users },
  { href: "/admin/worship-requests", label: "Worship Requests", icon: HeartHandshake },
  { href: "/admin/newsletter", label: "Stay Connected", icon: Mail },
  { href: "/admin/praise-reports", label: "Praise Reports", icon: Star },
  { href: "/admin/videos", label: "Videos", icon: Play },
  { href: "/admin/instagram", label: "Instagram", icon: InstagramIcon },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-warm-gray flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-warm-gray">
        <Link href="/" className="flex items-center gap-3 group" target="_blank">
          <div className="w-9 h-9 rounded-full bg-deep-black flex items-center justify-center">
            <Cross className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal leading-tight">
              Proclaiming Praise
            </p>
            <p className="text-xs text-charcoal/40">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navLinks.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
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
  );
}
