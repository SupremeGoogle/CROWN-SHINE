"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { CarSilhouette } from "@/components/ui/CarSilhouette";
import type { SiteContent } from "@/types/site-content";

type Item = NonNullable<SiteContent["beforeAfter"]>["items"][number];

function Placeholder({ label, tint }: { label: string; tint: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tint}`}>
      <div className="flex flex-col items-center gap-3 text-gold/45">
        <CarSilhouette className="h-14 w-28" />
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}

function Slider({ item }: { item: Item }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-gold/20"
      onPointerDown={(e) => {
        dragging.current = true;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          /* ignore — capture is a nicety, not required */
        }
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) move(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      {/* After (full, underneath) */}
      <div className="absolute inset-0">
        {item.after ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URLs may be from any host
          <img src={item.after} alt="After" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <Placeholder label="After" tint="from-gold/25 via-ink-elevated to-ink" />
        )}
      </div>

      {/* Before (same size, revealed to the left of the handle via clip-path) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {item.before ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URLs may be from any host
          <img src={item.before} alt="Before" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <Placeholder label="Before" tint="from-ink via-ink-elevated to-ink-soft" />
        )}
      </div>

      {/* Corner labels (always visible) */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream/85 backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold backdrop-blur-sm">
        After
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-gold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-ink/90 text-gold shadow-lg">
          <MoveHorizontal size={16} />
        </div>
      </div>

      {item.label ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 sm:p-4 sm:pt-10">
          <p className="font-display text-sm text-cream sm:text-base">{item.label}</p>
        </div>
      ) : null}
    </div>
  );
}

export function BeforeAfter({
  beforeAfter,
}: {
  beforeAfter: NonNullable<SiteContent["beforeAfter"]>;
}) {
  if (!beforeAfter.items.length) return null;
  return (
    <section id="before-after" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl">
            <span className="text-gold-gradient">{beforeAfter.title}</span>
          </h2>
          <p className="mt-4 text-cream/70">{beforeAfter.subtitle}</p>
          <p className="mt-2 text-xs uppercase tracking-widest text-gold/60">
            Drag the slider to compare
          </p>
        </motion.div>

        <div
          className={`mt-10 grid gap-5 sm:mt-14 ${
            beforeAfter.items.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-3xl"
          }`}
        >
          {beforeAfter.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Slider item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
