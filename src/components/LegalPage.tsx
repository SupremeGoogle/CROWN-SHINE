import { CrownPattern } from "@/components/CrownPattern";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { SiteContent } from "@/types/site-content";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  content,
  children,
}: {
  title: string;
  updated: string;
  content: SiteContent;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <CrownPattern className="fixed" />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl">
            <span className="text-gold-gradient">{title}</span>
          </h1>
          <p className="mt-2 text-sm text-cream/45">Last updated: {updated}</p>

          <div className="legal-content mt-10 space-y-8 text-sm leading-relaxed text-cream/75">
            {children}
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <Footer content={content} />
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl text-cream">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
