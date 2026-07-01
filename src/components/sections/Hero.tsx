"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import type { SiteContent } from "@/types/site-content";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.14),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="animate-float-slow mb-6"
        >
          <BrandMark className="h-28 w-36 drop-shadow-[0_0_24px_rgba(212,175,55,0.45)] sm:h-32 sm:w-40" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold"
        >
          {hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display text-4xl leading-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gold-gradient">{hero.title}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 max-w-2xl text-lg text-cream/75"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <ButtonLink href="/book">{hero.ctaLabel}</ButtonLink>
          <ButtonLink href="/#services" variant="ghost">
            {hero.secondaryCtaLabel}
          </ButtonLink>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gold/50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14m0 0l-6-6m6 6l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
