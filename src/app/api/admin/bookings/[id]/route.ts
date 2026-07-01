import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
