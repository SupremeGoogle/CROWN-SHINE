import { getSiteContent } from "@/lib/content";
import { CrownPattern } from "@/components/CrownPattern";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { Testimonials } from "@/components/sections/Testimonials";
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
        <ServiceArea area={content.serviceArea} />
        <Testimonials testimonials={content.testimonials} />
        <CtaBanner />
      </main>
      <div className="relative z-10">
        <Footer content={content} />
      </div>
    </div>
  );
}
