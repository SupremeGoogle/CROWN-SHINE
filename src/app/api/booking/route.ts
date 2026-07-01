import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyTelegramAdmins } from "@/lib/telegram";

const bookingSchema = z.object({
  customerName: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(200),
  address: z.string().trim().min(1).max(300),
  city: z.string().trim().min(1).max(120),
  carMake: z.string().trim().min(1).max(100),
  carModel: z.string().trim().min(1).max(100),
  carYear: z.string().trim().max(4).optional(),
  carSource: z.enum(["CATALOG", "MANUAL"]),
  vehicleCategory: z.string().trim().max(60).optional(),
  serviceName: z.string().trim().min(1).max(150),
  notes: z.string().trim().max(2000).optional(),
  preferredDate: z.string().trim().min(1),
  preferredTime: z.string().trim().min(1).max(30),
  marketingEmailConsent: z.boolean().default(false),
  marketingSmsConsent: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const preferredDate = new Date(data.preferredDate + "T00:00:00");
  if (Number.isNaN(preferredDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const notesParts = [data.notes, data.vehicleCategory ? `Vehicle type: ${data.vehicleCategory}` : null].filter(
    Boolean
  );

  const booking = await prisma.booking.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      carMake: data.carMake,
      carModel: data.carModel,
      carYear: data.carYear || null,
      carSource: data.carSource,
      serviceName: data.serviceName,
      notes: notesParts.length ? notesParts.join(" — ") : null,
      preferredDate,
      preferredTime: data.preferredTime,
      marketingEmailConsent: data.marketingEmailConsent,
      marketingSmsConsent: data.marketingSmsConsent,
    },
  });

  await notifyTelegramAdmins(booking);

  return NextResponse.json({ id: booking.id }, { status: 201 });
}
