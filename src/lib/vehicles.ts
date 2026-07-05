const ACRONYM_OVERRIDES: Record<string, string> = {
  bmw: "BMW",
  gmc: "GMC",
  amc: "AMC",
  mg: "MG",
  vw: "VW",
};

export function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split(/(\s|-|\/)/)
    .map((part) => {
      if (part === " " || part === "-" || part === "/") return part;
      if (ACRONYM_OVERRIDES[part]) return ACRONYM_OVERRIDES[part];
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

export interface VehicleType {
  id: string;
  name: string;
  price: string;
  /** Optional catalog of models (no longer required — customers type their own). */
  models?: string[];
  /** Optional per-service starting price, keyed by service id. */
  prices?: Record<string, string>;
}

export const DEFAULT_VEHICLE_TYPES: VehicleType[] = [
  { id: "type-sedan", name: "Sedan", price: "From $89" },
  { id: "type-coupe", name: "Coupe", price: "From $89" },
  { id: "type-hatchback", name: "Hatchback", price: "From $89" },
  { id: "type-convertible", name: "Convertible", price: "From $99" },
  { id: "type-small-suv", name: "Small SUV / Small Truck", price: "From $99" },
  { id: "type-large-suv", name: "Large SUV / Large Truck", price: "From $119" },
  { id: "type-rv", name: "RV", price: "From $199" },
  { id: "type-boat", name: "Boat", price: "From $199" },
];
