"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  loading,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [syncedValue, setSyncedValue] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keep the input text in sync when `value` changes from outside (e.g. parent
  // resets the field) — adjusting state during render instead of in an effect.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setQuery(value);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [value]);

  const filtered =
    query.trim() === ""
      ? options
      : options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none transition focus:border-gold/60 disabled:opacity-40"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/40">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
        </span>
      </div>

      {open && !disabled && filtered.length > 0 && (
        <ul className="glass-panel-strong absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl py-1">
          {filtered.slice(0, 100).map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setQuery(opt);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-cream/85 hover:bg-gold/10 hover:text-gold"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !disabled && filtered.length === 0 && (
        <div className="glass-panel-strong absolute z-20 mt-2 w-full rounded-xl px-4 py-3 text-sm text-cream/50">
          Not found. Try manual entry below.
        </div>
      )}
    </div>
  );
}
