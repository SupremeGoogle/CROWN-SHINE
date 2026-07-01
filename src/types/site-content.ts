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
  serviceArea: {
    title: string;
    subtitle: string;
    cities: string[];
  };
  testimonials: { name: string; car: string; quote: string; rating: number }[];
  contact: {
    phone: string;
    email: string;
    instagram: string;
    instagramHandle: string;
    hours: string;
  };
  footer: {
    tagline: string;
  };
}
