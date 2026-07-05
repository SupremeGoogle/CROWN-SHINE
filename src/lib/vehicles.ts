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
  models: string[];
  /** Optional per-service starting price, keyed by service id. */
  prices?: Record<string, string>;
}

export const DEFAULT_VEHICLE_TYPES: VehicleType[] = [
  {
    id: "type-sedan",
    name: "Sedan",
    price: "From $89",
    models: [
      "Toyota Camry",
      "Honda Accord",
      "Tesla Model 3",
      "BMW 3 Series",
      "Mercedes-Benz C-Class",
      "Audi A4",
      "Hyundai Sonata",
      "Nissan Altima",
      "Kia K5",
      "Lexus ES",
    ],
    prices: {
      "express-shine": "From $89",
      "signature-detail": "From $189",
      "full-royal-detail": "From $349",
      "ceramic-coating": "From $599",
    },
  },
  {
    id: "type-coupe",
    name: "Coupe",
    price: "From $89",
    models: ["BMW M4", "Ford Mustang", "Chevrolet Camaro", "Dodge Challenger", "Audi A5"],
    prices: {
      "express-shine": "From $89",
      "signature-detail": "From $189",
      "full-royal-detail": "From $349",
      "ceramic-coating": "From $599",
    },
  },
  {
    id: "type-hatchback",
    name: "Hatchback",
    price: "From $89",
    models: ["Volkswagen Golf", "Mazda 3", "Toyota Corolla Hatchback", "Honda Civic Hatchback"],
    prices: {
      "express-shine": "From $89",
      "signature-detail": "From $189",
      "full-royal-detail": "From $349",
      "ceramic-coating": "From $599",
    },
  },
  {
    id: "type-small-suv",
    name: "Small SUV",
    price: "From $99",
    models: [
      "Toyota RAV4",
      "Honda CR-V",
      "Tesla Model Y",
      "BMW X3",
      "Mazda CX-5",
      "Nissan Rogue",
      "Subaru Forester",
      "Audi Q5",
    ],
    prices: {
      "express-shine": "From $99",
      "signature-detail": "From $199",
      "full-royal-detail": "From $359",
      "ceramic-coating": "From $609",
    },
  },
  {
    id: "type-large-suv",
    name: "Large SUV",
    price: "From $110",
    models: [
      "Chevrolet Tahoe",
      "Ford Explorer",
      "BMW X5",
      "BMW X7",
      "Cadillac Escalade",
      "Toyota Highlander",
      "GMC Yukon",
      "Mercedes-Benz GLE",
    ],
    prices: {
      "express-shine": "From $110",
      "signature-detail": "From $210",
      "full-royal-detail": "From $370",
      "ceramic-coating": "From $620",
    },
  },
  {
    id: "type-truck",
    name: "Truck",
    price: "From $110",
    models: ["Ford F-150", "Chevrolet Silverado", "RAM 1500", "Toyota Tundra", "GMC Sierra"],
    prices: {
      "express-shine": "From $110",
      "signature-detail": "From $210",
      "full-royal-detail": "From $370",
      "ceramic-coating": "From $620",
    },
  },
  {
    id: "type-minivan",
    name: "Minivan",
    price: "From $109",
    models: ["Honda Odyssey", "Toyota Sienna", "Chrysler Pacifica", "Kia Carnival"],
    prices: {
      "express-shine": "From $105",
      "signature-detail": "From $205",
      "full-royal-detail": "From $365",
      "ceramic-coating": "From $615",
    },
  },
];
