import type { CSSProperties } from "react";
import { CrownIcon } from "@/components/ui/Crown";

// Детерминированный псевдослучайный генератор (mulberry32), чтобы разметка
// на сервере и клиенте совпадала (не вызывала hydration mismatch).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type CrownSpec = {
  top: number;
  left: number;
  size: number;
  rotate: number;
  opacity: number;
};

function generateCrowns(count: number, seed: number): CrownSpec[] {
  const rand = mulberry32(seed);
  const crowns: CrownSpec[] = [];
  for (let i = 0; i < count; i++) {
    crowns.push({
      top: rand() * 100,
      left: rand() * 100,
      size: 18 + rand() * 46,
      rotate: rand() * 60 - 30,
      opacity: 0.05 + rand() * 0.16,
    });
  }
  return crowns;
}

const CROWNS = generateCrowns(70, 1337);

/** Фон с хаотично разбросанными коронами, как на визитке Crown Shine. */
export function CrownPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {CROWNS.map((c, i) => (
        <CrownIcon
          key={i}
          className="absolute text-gold"
          style={
            {
              top: `${c.top}%`,
              left: `${c.left}%`,
              width: `${c.size}px`,
              height: `${c.size * 0.75}px`,
              transform: `rotate(${c.rotate}deg)`,
              opacity: c.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
