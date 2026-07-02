"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDateEn(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StepSchedule({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl text-cream">Pick a Date &amp; Time</h2>
      <p className="mt-1 mb-6 text-sm text-cream/60">
        We&apos;re available Monday–Sunday, 9:00 AM – 9:00 PM.
      </p>

      <div className="max-w-xs">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Date
        </label>
        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-left text-sm text-cream outline-none transition focus:border-gold/60"
          >
            <span className={date ? "text-cream" : "text-cream/35"}>
              {date ? formatDateEn(date) : "Select a date"}
            </span>
            <CalendarDays size={16} className="text-gold/70" />
          </button>
          {open && (
            <div className="absolute left-0 top-full z-30 mt-2">
              <Calendar
                value={date}
                min={todayIso()}
                onChange={(iso) => {
                  onDateChange(iso);
                  setOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Time
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => onTimeChange(t)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                time === t
                  ? "border-gold bg-gold text-ink font-semibold"
                  : "border-gold/25 text-cream/75 hover:border-gold/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
