"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContent } from "@/types/site-content";

export function Testimonials({
  testimonials,
}: {
  testimonials: SiteContent["testimonials"];
}) {
  return (
    <section id="reviews" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-3xl sm:text-4xl"
        >
          What Our <span className="text-gold-gradient">Clients Say</span>
        </motion.h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard className="flex h-full flex-col p-7">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-cream/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-gold/15 pt-4">
                  <p className="text-sm font-semibold text-cream">{t.name}</p>
                  <p className="text-xs text-cream/50">{t.car}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
