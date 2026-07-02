"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContent } from "@/types/site-content";

export function Faq({ faq }: { faq: SiteContent["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative px-6 py-16 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-2xl sm:text-4xl"
        >
          <span className="text-gold-gradient">{faq.title}</span>
        </motion.h2>

        <div className="mt-7 space-y-2.5 sm:mt-10 sm:space-y-3">
          {faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <GlassCard key={item.question} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-6 sm:py-5"
                >
                  <span className="font-display text-sm text-cream sm:text-base">{item.question}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 text-xs leading-relaxed text-cream/70 sm:px-6 sm:pb-5 sm:text-sm">
                    {item.answer}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
