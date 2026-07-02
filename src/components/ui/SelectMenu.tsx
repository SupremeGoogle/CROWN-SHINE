"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function SelectMenu({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-left text-sm outline-none transition focus:border-gold/60 disabled:opacity-40"
      >
        <span className={value ? "text-cream" : "text-cream/35"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-cream/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !disabled && (
        <ul className="glass-panel-strong absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl py-1">
          {options.map((opt) => {
            const active = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-gold/10 hover:text-gold ${
                    active ? "bg-gold/10 text-gold" : "text-cream/85"
                  }`}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
