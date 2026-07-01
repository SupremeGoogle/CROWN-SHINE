"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CrownIcon } from "@/components/ui/Crown";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Site Content" },
  { href: "/crm", label: "CRM / Bookings" },
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
      <header className="glass-panel-strong sticky top-0 z-40 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CrownIcon className="h-6 w-8 text-gold" />
            <span className="font-display text-sm tracking-widest">
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
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    active
                      ? "bg-gold text-ink font-semibold"
                      : "text-cream/70 hover:text-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
