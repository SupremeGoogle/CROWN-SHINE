import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for booking Crown Shine Mobile Detailing services.",
};

export default async function TermsPage() {
  const content = await getSiteContent();
  const { phone } = content.contact;

  return (
    <LegalPage title="Terms of Service" updated="July 2, 2026" content={content}>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the Crown Shine Mobile
        Detailing website and booking system, and your purchase of detailing services from
        Crown Shine Mobile LLC, doing business as Crown Shine Mobile Detailing (&quot;Crown
        Shine,&quot; &quot;we,&quot; &quot;us&quot;). By booking an appointment with us, you agree
        to these Terms.
      </p>

      <LegalSection title="1. Our Services">
        <p>
          Crown Shine provides mobile car detailing services at a location you choose within our
          service area, including Seattle, Bellevue, Kirkland, Redmond, Issaquah, and nearby
          cities. Available packages, pricing, and durations are listed on our website and are
          subject to change.
        </p>
      </LegalSection>

      <LegalSection title="2. Booking &amp; Confirmation">
        <p>
          Submitting a booking request through our website is a request for an appointment, not
          a guaranteed reservation. We will contact you by phone, email, or text to confirm your
          appointment time.
        </p>
      </LegalSection>

      <LegalSection title="3. Pricing &amp; Payment">
        <p>
          Listed prices are starting prices. Final pricing may vary depending on your vehicle&apos;s
          size, condition, and any additional services requested, and will be confirmed with you
          before or at the start of service. Payment is currently collected in person at the time
          of service; we do not process payments through this website.
        </p>
      </LegalSection>

      <LegalSection title="4. Cancellations &amp; Rescheduling">
        <p>
          We understand plans change. You may cancel or reschedule your appointment at no charge
          as long as you give us at least <strong>24 hours&apos; notice</strong> before your
          scheduled start time. This lets us offer the slot to another customer.
        </p>
        <p>
          Cancellations or reschedule requests made <strong>less than 24 hours</strong> before
          the appointment, or a no-show at the scheduled time, may be subject to a cancellation
          fee. If any deposit or prepayment applies to your booking, it may be forfeited for
          late cancellations or no-shows.
        </p>
      </LegalSection>

      <LegalSection title="5. Access &amp; Customer Responsibilities">
        <p>
          To complete your service, please ensure our detailer has reasonable access to your
          vehicle at the agreed time and location. We recommend removing valuables and personal
          items from the vehicle before your appointment. Crown Shine is not responsible for
          items left inside the vehicle.
        </p>
      </LegalSection>

      <LegalSection title="6. Vehicle Condition">
        <p>
          Please let us know about any pre-existing damage, modifications, or unusual conditions
          (e.g. worn paint, aftermarket coatings, mechanical issues) before service begins. We
          take care with every vehicle, but we are not responsible for pre-existing damage or
          wear that is not caused by our work.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Crown Shine&apos;s liability for any claim
          arising from our services is limited to the amount paid for the service in question.
          We are not liable for indirect, incidental, or consequential damages.
        </p>
      </LegalSection>

      <LegalSection title="8. Website Use">
        <p>
          The content, design, and branding of this website are the property of Crown Shine
          Mobile Detailing and may not be copied or used without permission.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing Law">
        <p>
          These Terms are governed by the laws of the State of Washington, without regard to its
          conflict of law principles.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of our website or services
          after changes are posted means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          Questions about these Terms? Reach us by phone at{" "}
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-gold underline hover:text-gold-light">
            {phone}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
