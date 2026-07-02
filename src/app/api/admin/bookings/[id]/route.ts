import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  customerName: z.string().trim().min(1).max(200).optional(),
  phone: z.string().trim().min(3).max(30).optional(),
  email: z.union([z.string().trim().email().max(200), z.literal("")]).nullish(),
  carMake: z.string().trim().min(1).max(100).optional(),
  carModel: z.string().trim().min(1).max(100).optional(),
  carYear: z.string().trim().max(10).nullish(),
  serviceName: z.string().trim().min(1).max(150).optional(),
  address: z.string().trim().min(1).max(300).optional(),
  city: z.string().trim().min(1).max(120).optional(),
  preferredDate: z.string().trim().min(1).optional(),
  preferredTime: z.string().trim().min(1).max(30).optional(),
  notes: z.string().trim().max(2000).nullish(),
  adminNotes: z.string().trim().max(2000).nullish(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const data: Prisma.BookingUpdateInput = {};
  if (d.status !== undefined) data.status = d.status;
  if (d.customerName !== undefined) data.customerName = d.customerName;
  if (d.phone !== undefined) data.phone = d.phone;
  if (d.email !== undefined) data.email = d.email || null;
  if (d.carMake !== undefined) data.carMake = d.carMake;
  if (d.carModel !== undefined) data.carModel = d.carModel;
  if (d.carYear !== undefined) data.carYear = d.carYear || null;
  if (d.serviceName !== undefined) data.serviceName = d.serviceName;
  if (d.address !== undefined) data.address = d.address;
  if (d.city !== undefined) data.city = d.city;
  if (d.preferredTime !== undefined) data.preferredTime = d.preferredTime;
  if (d.notes !== undefined) data.notes = d.notes || null;
  if (d.adminNotes !== undefined) data.adminNotes = d.adminNotes || null;
  if (d.preferredDate !== undefined) {
    const pd = new Date(d.preferredDate + "T00:00:00");
    if (Number.isNaN(pd.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    data.preferredDate = pd;
  }

  try {
    const booking = await prisma.booking.update({ where: { id }, data });
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
