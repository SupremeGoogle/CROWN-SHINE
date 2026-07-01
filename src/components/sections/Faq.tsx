"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteContent } from "@/types/site-content";

export function Faq({ faq }: { faq: SiteContent["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center font-display text-3xl sm:text-4xl"
        >
          <span className="text-gold-gradient">{faq.title}</span>
        </motion.h2>

        <div className="mt-10 space-y-3">
          {faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <GlassCard key={item.question} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base text-cream">{item.question}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-cream/70">
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
