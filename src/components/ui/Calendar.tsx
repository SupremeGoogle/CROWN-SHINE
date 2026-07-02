"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export function Calendar({
  value,
  min,
  onChange,
}: {
  value: string;
  min?: string;
  onChange: (iso: string) => void;
}) {
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selected = value ? new Date(value + "T00:00:00") : null;
  const minDate = min ? new Date(min + "T00:00:00") : null;
  const base = selected ?? todayMid;
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() });

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const canPrev =
    !minDate ||
    view.y > minDate.getFullYear() ||
    (view.y === minDate.getFullYear() && view.m > minDate.getMonth());

  function prev() {
    if (!canPrev) return;
    setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  }
  function next() {
    setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));
  }

  const navBtn =
    "flex h-8 w-8 items-center justify-center rounded-lg text-cream/70 transition hover:bg-gold/15 hover:text-gold disabled:opacity-25 disabled:hover:bg-transparent";

  return (
    <div className="glass-panel-strong w-[290px] rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={prev} disabled={!canPrev} className={navBtn} aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <span className="font-display text-sm tracking-wide text-cream">
          {MONTHS[view.m]} {view.y}
        </span>
        <button type="button" onClick={next} className={navBtn} aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-gold/60">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <span key={`b${i}`} />;
          const cellDate = new Date(view.y, view.m, d);
          const iso = toIso(view.y, view.m, d);
          const disabled = !!minDate && cellDate < minDate;
          const isSelected = !!selected && iso === value;
          const isToday = cellDate.getTime() === todayMid.getTime();
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={`h-9 rounded-lg text-sm transition ${
                isSelected
                  ? "bg-gold font-semibold text-ink"
                  : disabled
                    ? "cursor-not-allowed text-cream/20"
                    : "text-cream/80 hover:bg-gold/15 hover:text-gold"
              } ${isToday && !isSelected ? "ring-1 ring-inset ring-gold/40" : ""}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
