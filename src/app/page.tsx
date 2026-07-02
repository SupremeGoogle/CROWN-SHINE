import { getSiteContent } from "@/lib/content";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CrownPattern } from "@/components/CrownPattern";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { BookingWizard } from "@/components/booking/BookingWizard";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <LoadingScreen />
      <CrownPattern className="fixed" />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Hero hero={content.hero} />
        <About about={content.about} />
        <Services services={content.services} />
        <Gallery gallery={content.gallery} />
        <WhyUs whyUs={content.whyUs} />
        <ServiceArea area={content.serviceArea} />
        <Testimonials testimonials={content.testimonials} />
        <Faq faq={content.faq} />
        <section id="book" className="relative px-6 py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              Book Your <span className="text-gold-gradient">Detail</span>
            </h2>
            <p className="mt-3 text-cream/65">
              Pick your car, your package, and your time — we&apos;ll take care of the rest.
            </p>
          </div>
          <BookingWizard
            services={content.services}
            cities={content.serviceArea.cities}
          />
        </section>
      </main>
      <div className="relative z-10">
        <Footer content={content} />
      </div>
    </div>
  );
}
