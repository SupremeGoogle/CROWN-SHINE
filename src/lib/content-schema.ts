import { z } from "zod";
import { WHY_US_ICONS } from "@/types/site-content";

export const servicePackageSchema = z.object({
  id: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(100),
  price: z.string().trim().min(1).max(50),
  duration: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(500),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  highlighted: z.boolean().optional(),
});

export const siteContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().trim().min(1).max(100),
    title: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(400),
    ctaLabel: z.string().trim().min(1).max(60),
    secondaryCtaLabel: z.string().trim().min(1).max(60),
  }),
  about: z.object({
    title: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(2000),
    stats: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(60),
          value: z.string().trim().min(1).max(30),
        })
      )
      .max(12),
  }),
  services: z.array(servicePackageSchema).max(20),
  vehicleTypes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1).max(60),
        price: z.string().trim().max(50),
        models: z.array(z.string().trim().min(1).max(80)).max(200).optional(),
        prices: z.record(z.string(), z.string().trim().max(50)).optional(),
      })
    )
    .max(40)
    .optional(),
  serviceArea: z.object({
    title: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(400),
    cities: z.array(z.string().trim().min(1).max(80)).max(60),
  }),
  testimonials: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(100),
        car: z.string().trim().max(100).optional().or(z.literal("")),
        quote: z.string().trim().min(1).max(1000),
        rating: z.number().int().min(1).max(5),
      })
    )
    .max(30),
  gallery: z.object({
    title: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(400),
    items: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(60),
          caption: z.string().trim().min(1).max(150),
          tag: z.string().trim().min(1).max(60),
          image: z.string().trim().max(500).optional().or(z.literal("")),
        })
      )
      .max(24),
  }),
  whyUs: z.object({
    title: z.string().trim().min(1).max(200),
    items: z
      .array(
        z.object({
          icon: z.enum(WHY_US_ICONS),
          title: z.string().trim().min(1).max(100),
          description: z.string().trim().min(1).max(300),
        })
      )
      .max(12),
  }),
  faq: z.object({
    title: z.string().trim().min(1).max(200),
    items: z
      .array(
        z.object({
          question: z.string().trim().min(1).max(200),
          answer: z.string().trim().min(1).max(1000),
        })
      )
      .max(20),
  }),
  contact: z.object({
    phone: z.string().trim().min(1).max(30),
    email: z.string().trim().email().max(200).optional().or(z.literal("")),
    instagram: z.string().trim().url().max(300),
    instagramHandle: z.string().trim().min(1).max(60),
    hours: z.string().trim().min(1).max(200),
  }),
  footer: z.object({
    tagline: z.string().trim().min(1).max(200),
  }),
  links: z
    .object({
      title: z.string().trim().max(120),
      subtitle: z.string().trim().max(300),
      items: z
        .array(
          z.object({
            id: z.string(),
            label: z.string().trim().min(1).max(60),
            url: z.string().trim().min(1).max(500),
          })
        )
        .max(30),
    })
    .optional(),
});
