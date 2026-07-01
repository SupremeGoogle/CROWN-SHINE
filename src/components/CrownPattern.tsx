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

// Разбивает холст на сетку ячеек и кладёт по одной короне в случайную точку
// внутри каждой ячейки — так короны не скучиваются в одном месте и не
// перекрывают друг друга слишком сильно.
function generateCrowns(
  cols: number,
  rows: number,
  seed: number,
  sizeRange: [number, number]
): CrownSpec[] {
  const rand = mulberry32(seed);
  const crowns: CrownSpec[] = [];
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      crowns.push({
        top: row * cellH + rand() * cellH * 0.7,
        left: col * cellW + rand() * cellW * 0.7,
        size: sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]),
        rotate: rand() * 60 - 30,
        opacity: 0.05 + rand() * 0.16,
      });
    }
  }
  return crowns;
}

const DESKTOP_CROWNS = generateCrowns(9, 8, 1337, [18, 46]);
const MOBILE_CROWNS = generateCrowns(3, 8, 4242, [16, 30]);

function CrownLayer({ crowns }: { crowns: CrownSpec[] }) {
  return (
    <>
      {crowns.map((c, i) => (
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
    </>
  );
}

/** Фон с хаотично разбросанными коронами, как на визитке Crown Shine. */
export function CrownPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <div className="sm:hidden">
        <CrownLayer crowns={MOBILE_CROWNS} />
      </div>
      <div className="hidden sm:block">
        <CrownLayer crowns={DESKTOP_CROWNS} />
      </div>
    </div>
  );
}
