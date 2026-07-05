"use client";

import { SelectMenu } from "@/components/ui/SelectMenu";
import type { VehicleType } from "@/lib/vehicles";

export interface CarValue {
  category: string;
  make: string;
  model: string;
  year: string;
  source: "CATALOG" | "MANUAL";
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 2 }, (_, i) =>
  String(currentYear + 1 - i)
);

const inputClass =
  "w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-gold/60";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-widest text-gold";

export function CarPicker({
  value,
  onChange,
  vehicleTypes,
}: {
  value: CarValue;
  onChange: (value: CarValue) => void;
  vehicleTypes: VehicleType[];
}) {
  const selectedType = vehicleTypes.find((t) => t.name === value.category);

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Vehicle Type</label>
        <SelectMenu
          options={vehicleTypes.map((t) => t.name)}
          value={value.category}
          placeholder="Select vehicle type"
          onChange={(name) => onChange({ ...value, category: name })}
        />
        {selectedType?.price && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs font-semibold text-gold">
            {selectedType.name}: {selectedType.price}
          </span>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Make</label>
          <input
            type="text"
            value={value.make}
            onChange={(e) => onChange({ ...value, make: e.target.value, source: "MANUAL" })}
            placeholder="e.g. Toyota, BMW, Tesla…"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Model</label>
          <input
            type="text"
            value={value.model}
            onChange={(e) => onChange({ ...value, model: e.target.value, source: "MANUAL" })}
            placeholder="e.g. Camry, X5, Model 3…"
            className={inputClass}
          />
        </div>
      </div>

      <div className="max-w-[200px]">
        <label className={labelClass}>Year (optional)</label>
        <SelectMenu
          options={YEARS}
          value={value.year}
          placeholder="Year"
          onChange={(year) => onChange({ ...value, year })}
        />
      </div>
    </div>
  );
}
