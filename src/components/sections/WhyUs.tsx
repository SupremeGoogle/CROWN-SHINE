"use client";

import { motion } from "framer-motion";
import { Shield, Leaf, MapPin, ThumbsUp, CalendarClock, Star, Sparkles, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContent, WhyUsIcon } from "@/types/site-content";

const ICONS: Record<WhyUsIcon, React.ComponentType<{ size?: number; className?: string }>> = {
  shield: Shield,
  leaf: Leaf,
  "map-pin": MapPin,
  "thumbs-up": ThumbsUp,
  "calendar-clock": CalendarClock,
  star: Star,
  sparkles: Sparkles,
  clock: Clock,
};

export function WhyUs({ whyUs }: { whyUs: SiteContent["whyUs"] }) {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-3xl sm:text-4xl"
        >
          <span className="text-gold-gradient">{whyUs.title}</span>
        </motion.h2>

        <div className="carousel-mobile mt-14 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {whyUs.items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Star;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="w-[80%] shrink-0 snap-center sm:w-auto"
              >
                <GlassCard className="flex h-full flex-col items-start gap-3 p-6">
                  <span className="rounded-xl bg-gold/10 p-3 text-gold">
                    <Icon size={22} />
                  </span>
                  <p className="font-display text-lg text-cream">{item.title}</p>
                  <p className="text-sm text-cream/65">{item.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
