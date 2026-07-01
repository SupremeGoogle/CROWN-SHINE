import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { CrownPattern } from "@/components/CrownPattern";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book Your Detail",
  description: "Book your mobile car detailing appointment with Crown Shine.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const content = await getSiteContent();
  const { service } = await searchParams;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <CrownPattern className="fixed" />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-32">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="font-display text-3xl sm:text-4xl">
            Book Your <span className="text-gold-gradient">Crown-Level Shine</span>
          </h1>
          <p className="mt-3 text-cream/65">
            Four quick steps and we&apos;ll take it from there.
          </p>
        </div>
        <BookingWizard
          services={content.services}
          cities={content.serviceArea.cities}
          preselectedServiceId={service}
        />
      </main>
      <div className="relative z-10">
        <Footer content={content} />
      </div>
    </div>
  );
}
