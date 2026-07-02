import { NextRequest, NextResponse } from "next/server";
import { Prisma, BookingStatus, CarSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_MARKER = "[demo]";

const FIRST = [
  "James", "Olivia", "Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella",
  "Lucas", "Mia", "Aiden", "Amelia", "Jack", "Harper", "Daniel", "Ella", "Henry", "Grace",
  "Owen", "Chloe", "Leo", "Zoe", "Nathan", "Lily", "Ryan", "Nora", "Dylan", "Aria",
];
const LAST = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
  "Martinez", "Lee", "Nguyen", "Kim", "Patel", "Chen", "Anderson", "Taylor", "Thomas", "Moore", "Clark",
];
const CARS: Record<string, string[]> = {
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  BMW: ["3 Series", "5 Series", "X5", "M4"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLE", "S-Class"],
  Audi: ["A4", "Q5", "A6", "Q7"],
  Toyota: ["Camry", "RAV4", "Corolla", "Highlander"],
  Honda: ["Accord", "Civic", "CR-V", "Pilot"],
  Lexus: ["RX", "ES", "NX", "GX"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape"],
  Chevrolet: ["Silverado", "Tahoe", "Corvette", "Equinox"],
};
const SERVICES = ["Express Shine", "Signature Detail", "Full Royal Detail", "Ceramic Coating"];
const CITIES = [
  "Seattle", "Bellevue", "Kirkland", "Redmond", "Issaquah",
  "Sammamish", "Renton", "Mercer Island", "Bothell", "Woodinville",
];
const TIMES = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];
const STREETS = ["Main St", "Oak Ave", "Lake View Dr", "Pine St", "Maple Way", "Cedar Ln", "1st Ave", "Park Blvd"];
const STATUSES: BookingStatus[] = [
  "NEW", "NEW", "NEW", "CONFIRMED", "CONFIRMED", "COMPLETED", "COMPLETED", "CANCELLED",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}

export async function POST(request: NextRequest) {
  const count = Math.min(Number(new URL(request.url).searchParams.get("count")) || 200, 500);
  const makes = Object.keys(CARS);
  const rows: Prisma.BookingCreateManyInput[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(FIRST);
    const last = pick(LAST);
    const make = pick(makes);
    const model = pick(CARS[make]);
    const hasEmail = Math.random() > 0.25;

    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 51) - 20); // -20..+30 days
    const preferredDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    rows.push({
      status: pick(STATUSES),
      customerName: `${first} ${last}`,
      phone: `(206) 555-${pad(Math.floor(Math.random() * 100))}${pad(Math.floor(Math.random() * 100))}`,
      email: hasEmail ? `${first.toLowerCase()}.${last.toLowerCase()}@example.com` : null,
      carMake: make,
      carModel: model,
      carYear: String(2015 + Math.floor(Math.random() * 11)),
      carSource: CarSource.CATALOG,
      serviceName: pick(SERVICES),
      notes: null,
      adminNotes: DEMO_MARKER,
      address: `${100 + Math.floor(Math.random() * 9800)} ${pick(STREETS)}`,
      city: pick(CITIES),
      preferredDate,
      preferredTime: pick(TIMES),
      marketingEmailConsent: Math.random() > 0.4,
      marketingSmsConsent: Math.random() > 0.5,
    });
  }

  const result = await prisma.booking.createMany({ data: rows });
  return NextResponse.json({ ok: true, created: result.count });
}

export async function DELETE() {
  const result = await prisma.booking.deleteMany({ where: { adminNotes: DEMO_MARKER } });
  return NextResponse.json({ ok: true, deleted: result.count });
}
