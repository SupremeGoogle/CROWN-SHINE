import { CarPicker, type CarValue } from "@/components/booking/CarPicker";

export function StepVehicle({
  value,
  onChange,
}: {
  value: CarValue;
  onChange: (value: CarValue) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-cream">Tell Us About Your Car</h2>
      <p className="mt-1 mb-6 text-sm text-cream/60">
        Pick your vehicle from our catalog, or enter it manually if it&apos;s not listed.
      </p>
      <CarPicker value={value} onChange={onChange} />
    </div>
  );
}
