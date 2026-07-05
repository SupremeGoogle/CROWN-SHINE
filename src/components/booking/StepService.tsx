import { Check } from "lucide-react";
import type { ServicePackage } from "@/types/site-content";
import type { VehicleType } from "@/lib/vehicles";

export function StepService({
  services,
  selectedId,
  onSelect,
  notes,
  onNotesChange,
  vehicleType,
}: {
  services: ServicePackage[];
  selectedId: string;
  onSelect: (id: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  vehicleType?: VehicleType;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-cream">Choose Your Service</h2>
      <p className="mt-1 mb-6 text-sm text-cream/60">
        {vehicleType
          ? `Prices shown for your ${vehicleType.name}. Select the package that fits your car's needs.`
          : "Select the package that fits your car's needs."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => {
          const active = s.id === selectedId;
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`rounded-xl border p-5 text-left transition ${
                active
                  ? "border-gold bg-gold/10 gold-border-glow"
                  : "border-gold/20 bg-ink-soft/40 hover:border-gold/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg text-cream">{s.name}</p>
                  <p className="text-sm font-semibold text-gold">
                    {vehicleType?.prices?.[s.id] || s.price}
                  </p>
                  <p className="text-xs text-cream/50">{s.duration}</p>
                </div>
                {active && (
                  <span className="rounded-full bg-gold p-1 text-ink">
                    <Check size={14} />
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-cream/60">{s.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Anything else we should know? (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="Pet hair, stains, specific areas of focus, gate code, etc."
          className="w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-gold/60"
        />
      </div>
    </div>
  );
}
