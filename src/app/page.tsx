import { getSiteContent } from "@/lib/content";
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
import { CtaBanner } from "@/components/sections/CtaBanner";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
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
        <CtaBanner />
      </main>
      <div className="relative z-10">
        <Footer content={content} />
      </div>
    </div>
  );
}
