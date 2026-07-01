"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { SiteContent } from "@/types/site-content";

export function ServiceArea({ area }: { area: SiteContent["serviceArea"] }) {
  return (
    <section id="area" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-3xl sm:text-4xl"
        >
          <span className="text-gold-gradient">{area.title}</span>
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-cream/70">{area.subtitle}</p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {area.cities.map((city, i) => (
            <motion.span
              key={city}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-panel flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-cream/85"
            >
              <MapPin size={14} className="text-gold" />
              {city}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
