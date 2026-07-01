"use client";

import { Printer } from "lucide-react";

export function PrintTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)] px-6 py-3 text-sm font-semibold text-ink shadow-lg"
    >
      <Printer size={16} /> Print / Save as PDF
    </button>
  );
}
