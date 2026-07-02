"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/Combobox";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { VEHICLE_CATEGORIES } from "@/lib/vehicles";

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

export function CarPicker({
  value,
  onChange,
}: {
  value: CarValue;
  onChange: (value: CarValue) => void;
}) {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const manual = value.source === "MANUAL";

  useEffect(() => {
    fetch("/api/vehicles/makes")
      .then((r) => r.json())
      .then((d) => setMakes(d.makes ?? []))
      .catch(() => setMakes([]))
      .finally(() => setLoadingMakes(false));
  }, []);

  useEffect(() => {
    if (!value.make || manual) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-change pattern, verified working
    setLoadingModels(true);
    fetch(`/api/vehicles/models?make=${encodeURIComponent(value.make)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setModels(d.models ?? []);
      })
      .catch(() => {
        if (!cancelled) setModels([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.make, manual]);

  const displayedModels = !manual && value.make ? models : [];

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Vehicle Type
        </label>
        <SelectMenu
          options={[...VEHICLE_CATEGORIES]}
          value={value.category}
          placeholder="Select vehicle type"
          onChange={(category) => onChange({ ...value, category })}
        />
      </div>

      {!manual ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Make
              </label>
              <Combobox
                options={makes}
                value={value.make}
                loading={loadingMakes}
                placeholder="e.g. Toyota, BMW, Tesla..."
                onChange={(make) => onChange({ ...value, make, model: "" })}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Model
              </label>
              <Combobox
                options={displayedModels}
                value={value.model}
                loading={loadingModels}
                disabled={!value.make}
                placeholder={value.make ? "e.g. Camry, X5, Model 3..." : "Select make first"}
                onChange={(model) => onChange({ ...value, model })}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange({ ...value, source: "MANUAL" })}
            className="text-xs font-medium text-gold/80 underline decoration-gold/30 underline-offset-4 hover:text-gold"
          >
            Can&apos;t find your car? Enter it manually
          </button>
        </>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Make
              </label>
              <input
                type="text"
                value={value.make}
                onChange={(e) => onChange({ ...value, make: e.target.value })}
                placeholder="Enter make"
                className="w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-gold/60"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Model
              </label>
              <input
                type="text"
                value={value.model}
                onChange={(e) => onChange({ ...value, model: e.target.value })}
                placeholder="Enter model"
                className="w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-gold/60"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ ...value, source: "CATALOG", make: "", model: "" })}
            className="text-xs font-medium text-gold/80 underline decoration-gold/30 underline-offset-4 hover:text-gold"
          >
            Choose from list instead
          </button>
        </>
      )}

      <div className="max-w-[200px]">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Year (optional)
        </label>
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
