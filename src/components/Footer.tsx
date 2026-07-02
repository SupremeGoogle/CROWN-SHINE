import Link from "next/link";
import { Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import type { SiteContent } from "@/types/site-content";

export function Footer({ content }: { content: SiteContent }) {
  return (
    <footer id="contact" className="relative border-t border-gold/15 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Crown Shine" className="h-7 w-auto object-contain" />
            <span className="font-display text-base tracking-widest">
              CROWN <span className="text-gold-gradient">SHINE</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream/60">{content.footer.tagline}</p>
        </div>

        <div className="space-y-2 text-sm text-cream/70">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
            Contact
          </p>
          <a
            href={`tel:${content.contact.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 hover:text-gold"
          >
            <Phone size={15} /> {content.contact.phone}
          </a>
          <a
            href={content.contact.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-gold"
          >
            <InstagramIcon size={15} /> {content.contact.instagramHandle}
          </a>
          <p className="pt-1 text-cream/50">{content.contact.hours}</p>
        </div>

        <div className="space-y-2 text-sm text-cream/70">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
            Company
          </p>
          <Link href="/privacy" className="block hover:text-gold">
            Privacy Policy
          </Link>
          <Link href="/terms" className="block hover:text-gold">
            Terms of Service
          </Link>
          <Link href="/book" className="block hover:text-gold">
            Book a Detail
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-gold/10 pt-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Crown Shine Mobile Detailing. All rights reserved.
      </div>
    </footer>
  );
}
