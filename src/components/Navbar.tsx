"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#area", label: "Service Area" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-panel-strong" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Crown Shine" className="h-8 w-auto object-contain transition-transform group-hover:-translate-y-0.5" />
          <span className="font-display text-lg tracking-[0.15em] text-cream">
            CROWN <span className="text-gold-gradient">SHINE</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/80 transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <ButtonLink href="/book" className="!py-2.5 !px-6 text-xs">
            Book Now
          </ButtonLink>
        </div>

        <button
          className="text-cream lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="glass-panel-strong mx-4 mb-4 flex flex-col gap-4 rounded-2xl p-6 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-cream/80 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink href="/book" className="w-full">
            Book Now
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
