"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import type { ServicePackage } from "@/types/site-content";

export function Services({ services }: { services: ServicePackage[] }) {
  return (
    <section id="services" className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl">
            Our <span className="text-gold-gradient">Detailing Packages</span>
          </h2>
          <p className="mt-4 text-cream/70">
            Choose the level of shine your car deserves. Every package is fully
            customizable at booking.
          </p>
        </motion.div>

        <div className="carousel-mobile mt-16 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="h-full w-[80%] shrink-0 snap-center sm:w-auto"
            >
              <GlassCard
                strong={s.highlighted}
                className={`flex h-full flex-col p-7 ${
                  s.highlighted ? "gold-border-glow scale-[1.02]" : ""
                }`}
              >
                {s.highlighted && (
                  <span className="mb-3 w-fit rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl text-cream">{s.name}</h3>
                <p className="mt-1 text-2xl font-semibold text-gold-gradient">
                  {s.price}
                </p>
                <p className="text-xs uppercase tracking-widest text-cream/50">
                  {s.duration}
                </p>
                <p className="mt-4 text-sm text-cream/70">{s.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-cream/80">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/book?service=${s.id}`}
                  variant={s.highlighted ? "primary" : "ghost"}
                  className="mt-8 w-full"
                >
                  Select Package
                </ButtonLink>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
