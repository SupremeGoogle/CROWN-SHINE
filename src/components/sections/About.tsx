"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContent } from "@/types/site-content";

export function About({ about }: { about: SiteContent["about"] }) {
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl">
            <span className="text-gold-gradient">{about.title}</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/75">{about.body}</p>
        </motion.div>

        <div className="mt-16 grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-4">
          {about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="h-full"
            >
              <GlassCard className="flex h-full flex-col items-center justify-center gap-1 px-4 py-8 text-center">
                <span className="font-display text-3xl text-gold-gradient sm:text-4xl">
                  {s.value}
                </span>
                <span className="text-xs uppercase tracking-widest text-cream/60">
                  {s.label}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
