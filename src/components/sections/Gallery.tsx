"use client";

import { motion } from "framer-motion";
import { CarSilhouette } from "@/components/ui/CarSilhouette";
import type { SiteContent } from "@/types/site-content";

const TINTS = [
  "from-gold/25 via-ink-elevated to-ink",
  "from-ink-elevated via-gold/15 to-ink",
  "from-ink via-ink-elevated to-gold/20",
];

export function Gallery({ gallery }: { gallery: SiteContent["gallery"] }) {
  return (
    <section id="gallery" className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl">
            <span className="text-gold-gradient">{gallery.title}</span>
          </h2>
          <p className="mt-4 text-cream/70">{gallery.subtitle}</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
          {gallery.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/15"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URLs may be from any host
                <img
                  src={item.image}
                  alt={item.caption}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${TINTS[i % TINTS.length]}`}
                >
                  <CarSilhouette className="h-16 w-32 text-gold/50 transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 sm:p-4 sm:pt-10">
                <p className="font-display text-xs leading-tight text-cream sm:text-base">{item.caption}</p>
                <p className="text-[10px] uppercase tracking-widest text-gold/80 sm:text-xs">{item.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
