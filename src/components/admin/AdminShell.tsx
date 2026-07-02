"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Site Content", shortLabel: "Content" },
  { href: "/crm", label: "CRM / Bookings", shortLabel: "CRM" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="glass-panel-strong sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Crown Shine" className="h-7 w-auto object-contain shrink-0" />
            <span className="hidden font-display text-sm tracking-widest sm:inline">
              CROWN <span className="text-gold-gradient">SHINE</span>
            </span>
          </div>
          <nav className="flex gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition sm:px-4 sm:text-sm ${
                    active
                      ? "bg-gold text-ink font-semibold"
                      : "text-cream/70 hover:text-gold"
                  }`}
                >
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-2 text-sm text-cream/60 hover:text-gold"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
