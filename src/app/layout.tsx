import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Crown Shine Mobile Detailing | Luxury Mobile Car Detailing",
    template: "%s | Crown Shine Mobile Detailing",
  },
  description:
    "Premium mobile car detailing serving Seattle, Bellevue, Kirkland, Redmond, Issaquah and surrounding areas. We come to you.",
  keywords: [
    "mobile detailing",
    "car detailing Seattle",
    "auto detailing Bellevue",
    "ceramic coating",
    "luxury car care",
  ],
  openGraph: {
    title: "Crown Shine Mobile Detailing",
    description:
      "Premium mobile car detailing serving Seattle, Bellevue, Kirkland, Redmond, Issaquah and surrounding areas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        {children}
      </body>
    </html>
  );
}
