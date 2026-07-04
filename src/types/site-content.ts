export const WHY_US_ICONS = [
  "shield",
  "leaf",
  "map-pin",
  "thumbs-up",
  "calendar-clock",
  "star",
  "sparkles",
  "clock",
] as const;

export type WhyUsIcon = (typeof WHY_US_ICONS)[number];

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    secondaryCtaLabel: string;
  };
  about: {
    title: string;
    body: string;
    stats: { label: string; value: string }[];
  };
  services: ServicePackage[];
  vehicleTypes?: { id: string; name: string; price: string; models: string[] }[];
  serviceArea: {
    title: string;
    subtitle: string;
    cities: string[];
  };
  testimonials: { name: string; car?: string; quote: string; rating: number }[];
  gallery: {
    title: string;
    subtitle: string;
    items: { id: string; caption: string; tag: string; image?: string }[];
  };
  whyUs: {
    title: string;
    items: { icon: WhyUsIcon; title: string; description: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    phone: string;
    email?: string;
    instagram: string;
    instagramHandle: string;
    hours: string;
  };
  footer: {
    tagline: string;
  };
  links?: {
    title: string;
    subtitle: string;
    items: { id: string; label: string; url: string }[];
  };
}
