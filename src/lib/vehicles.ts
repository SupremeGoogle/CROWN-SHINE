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

export const VEHICLE_CATEGORIES = [
  "Sedan",
  "Coupe",
  "Hatchback",
  "SUV",
  "Truck",
  "Minivan",
  "Sports Car",
  "Convertible",
  "Wagon",
  "Other",
] as const;
