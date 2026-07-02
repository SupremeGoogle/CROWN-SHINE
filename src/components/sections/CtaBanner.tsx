"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";


export function CtaBanner() {
  return (
    <section className="relative px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl"
      >
        <GlassCard strong className="flex flex-col items-center gap-6 px-8 py-16 text-center gold-border-glow">
          <img src="/logo.png" alt="Crown Shine" className="h-14 w-auto object-contain" />
          <h2 className="font-display text-3xl sm:text-4xl">
            Ready for Your <span className="text-gold-gradient">Crown-Level Shine?</span>
          </h2>
          <p className="max-w-xl text-cream/70">
            Pick your car, your package, and your time — we&apos;ll take care of the rest.
          </p>
          <ButtonLink href="/book">Book Your Detail Now</ButtonLink>
        </GlassCard>
      </motion.div>
    </section>
  );
}
