import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Crown Shine Mobile Detailing collects, uses, and protects your information.",
};

export default async function PrivacyPolicyPage() {
  const content = await getSiteContent();
  const { phone, email } = content.contact;

  return (
    <LegalPage title="Privacy Policy" updated="July 1, 2026" content={content}>
      <p>
        Crown Shine Mobile Detailing (&quot;Crown Shine,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) provides mobile car detailing services to customers in Seattle,
        Bellevue, Kirkland, Redmond, Issaquah, and other nearby areas in Washington State. This
        Privacy Policy explains how we collect, use, share, and protect information when you
        visit our website or book a service with us.
      </p>

      <LegalSection title="1. Information We Collect">
        <p>When you book an appointment through our website, we collect:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Your name, phone number, and email address</li>
          <li>The service address and city where the detail will take place</li>
          <li>Your vehicle&apos;s make, model, year, and type</li>
          <li>The service package you selected and any notes you provide</li>
          <li>Your preferred appointment date and time</li>
          <li>Your marketing preferences (whether you opt in to email and/or SMS marketing)</li>
        </ul>
        <p>
          We do not collect payment card information through this website, since payment is
          currently handled in person at the time of service.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <ul className="list-disc space-y-1 pl-5">
          <li>To schedule, confirm, and provide the detailing service you requested</li>
          <li>To contact you about your appointment (e.g. confirmations, arrival updates)</li>
          <li>To respond to questions or requests you send us</li>
          <li>To improve our services and customer experience</li>
          <li>
            To send you promotional emails and/or text messages, but{" "}
            <strong>only if you opted in</strong> to marketing communications at booking
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Email &amp; SMS Marketing">
        <p>
          If you checked the email marketing box at booking, we may send you promotions,
          seasonal offers, and updates by email. Every marketing email includes an unsubscribe
          link, and you may opt out at any time, in line with the CAN-SPAM Act.
        </p>
        <p>
          If you checked the SMS marketing box at booking, we may send you promotional text
          messages. Message and data rates may apply. Consent to receive marketing texts is not
          a condition of purchasing any service. You can opt out at any time by replying{" "}
          <strong>STOP</strong> to any text, in line with the Telephone Consumer Protection Act
          (TCPA).
        </p>
        <p>
          Regardless of your marketing preferences, we may still contact you with transactional
          messages related to an appointment you&apos;ve booked (e.g. confirmations or
          scheduling changes).
        </p>
      </LegalSection>

      <LegalSection title="4. How We Share Your Information">
        <p>
          We do not sell your personal information. We share information only as needed to run
          our business:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Internal notifications:</strong> booking details are sent via the Telegram
            Bot API to authorized Crown Shine staff so we can schedule and prepare for your
            appointment.
          </li>
          <li>
            <strong>Hosting &amp; infrastructure providers</strong> (such as our website host and
            database provider) who process data on our behalf to operate this website.
          </li>
          <li>If required by law, subpoena, or to protect our rights and safety.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          Our website uses only essential cookies required for basic functionality, such as
          keeping our administrators securely signed in to internal tools. We do not currently
          use third-party advertising or analytics tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain booking and customer information for as long as reasonably necessary to
          provide our services, maintain business records, and comply with legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>
          You may request to access, correct, or delete your personal information, or withdraw
          marketing consent at any time, by contacting us at{" "}
          <a href={`mailto:${email}`} className="text-gold underline hover:text-gold-light">
            {email}
          </a>{" "}
          or{" "}
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-gold underline hover:text-gold-light">
            {phone}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <p>
          Our services and website are not directed to children under 13, and we do not
          knowingly collect personal information from children.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page with an updated &quot;Last updated&quot; date.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <p>
          Questions about this Privacy Policy? Reach us at{" "}
          <a href={`mailto:${email}`} className="text-gold underline hover:text-gold-light">
            {email}
          </a>{" "}
          or{" "}
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-gold underline hover:text-gold-light">
            {phone}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
