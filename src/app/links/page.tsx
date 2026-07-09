import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { CrownPattern } from "@/components/CrownPattern";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Phone, Globe, Star, Sparkles, Music2, Link as LinkIcon, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Crown Shine — All Our Links",
  description: "Book a detail, call us, or follow Crown Shine Mobile Detailing.",
};

function iconFor(label: string, url: string) {
  const t = `${label} ${url}`.toLowerCase();
  if (/instagram/.test(t)) return InstagramIcon;
  if (/tiktok/.test(t)) return Music2;
  if (/google|maps|review|yelp/.test(t)) return Star;
  if (url.startsWith("tel:") || /call|phone|text|whatsapp/.test(t)) return Phone;
  if (url === "/book" || /\bbook\b|запис/.test(t)) return Sparkles;
  if (url === "/" || /website|сайт/.test(t)) return Globe;
  if (/map|location/.test(t)) return MapPin;
  return LinkIcon;
}

export default async function LinksPage() {
  const content = await getSiteContent();
  const links = content.links ?? {
    title: "Crown Shine Mobile Detailing",
    subtitle: "",
    items: [],
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-14">
      <CrownPattern className="fixed" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
        <img
          src="/logo.png"
          alt="Crown Shine"
          className="h-24 w-auto object-contain drop-shadow-[0_0_24px_rgba(212,175,55,0.45)]"
        />
        <h1 className="mt-4 text-center font-display text-2xl">
          <span className="text-gold-gradient">{links.title}</span>
        </h1>
        {links.subtitle && (
          <p className="mt-2 text-center text-sm text-cream/65">{links.subtitle}</p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3">
          {links.items.map((item) => {
            const Icon = iconFor(item.label, item.url);
            const external = /^(https?:|tel:|mailto:)/.test(item.url);
            return (
              <a
                key={item.id}
                href={item.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="glass-panel group flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:border-gold/50 hover:bg-gold/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold/20">
                  <Icon size={20} />
                </span>
                <span className="font-display text-base tracking-wide text-cream">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-cream/40">
          © {new Date().getFullYear()} Crown Shine Mobile Detailing LLC
        </p>
      </div>
    </div>
  );
}
