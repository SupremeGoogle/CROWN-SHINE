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
  // Отслеживаем, печатал ли пользователь после открытия списка. Пока не печатал —
  // показываем ВЕСЬ список (даже если поле уже заполнено выбранным значением),
  // чтобы можно было легко выбрать другой вариант, ничего не стирая.
  const [typed, setTyped] = useState(false);
  const [syncedValue, setSyncedValue] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the input text in sync when `value` changes from outside (e.g. parent
  // resets the field) — adjusting state during render instead of in an effect.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setQuery(value);
    setTyped(false);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTyped(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [value]);

  function reveal() {
    if (disabled) return;
    setOpen(true);
    setTyped(false);
    inputRef.current?.select();
  }

  // До первого ввода символа — весь список; после — фильтруем по введённому тексту.
  const filtered =
    !typed || query.trim() === ""
      ? options
      : options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  function choose(opt: string) {
    onChange(opt);
    setQuery(opt);
    setTyped(false);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setTyped(true);
            setOpen(true);
          }}
          onFocus={reveal}
          onClick={reveal}
          placeholder={placeholder}
          className="w-full cursor-pointer rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none transition focus:border-gold/60 disabled:opacity-40"
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : reveal())}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 transition hover:text-gold disabled:opacity-40"
          aria-label="Toggle list"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          )}
        </button>
      </div>

      {open && !disabled && filtered.length > 0 && (
        <ul className="glass-panel-strong absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl py-1">
          {filtered.slice(0, 100).map((opt) => {
            const active = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => choose(opt)}
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

      {open && !disabled && filtered.length === 0 && (
        <div className="glass-panel-strong absolute z-20 mt-2 w-full rounded-xl px-4 py-3 text-sm text-cream/50">
          Not found. Try manual entry below.
        </div>
      )}
    </div>
  );
}
