import { CarPicker, type CarValue } from "@/components/booking/CarPicker";
import type { VehicleType } from "@/lib/vehicles";

export function StepVehicle({
  value,
  onChange,
  vehicleTypes,
}: {
  value: CarValue;
  onChange: (value: CarValue) => void;
  vehicleTypes: VehicleType[];
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-cream">Tell Us About Your Car</h2>
      <p className="mt-1 mb-6 text-sm text-cream/60">
        Choose your vehicle type — the starting price adjusts to its size — then tell us your
        car&apos;s make and model.
      </p>
      <CarPicker value={value} onChange={onChange} vehicleTypes={vehicleTypes} />
    </div>
  );
}
