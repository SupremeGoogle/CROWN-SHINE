import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-ink)] shadow-[0_6px_24px_rgba(212,175,55,0.35)] hover:shadow-[0_10px_32px_rgba(212,175,55,0.55)] hover:scale-[1.03] active:scale-[0.98]",
  ghost:
    "border border-gold/40 text-cream hover:bg-gold/10 hover:border-gold/70",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
