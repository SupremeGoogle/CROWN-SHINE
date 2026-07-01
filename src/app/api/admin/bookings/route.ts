import { NextRequest, NextResponse } from "next/server";
import { Prisma, BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dateRangeFor, type DateFilter } from "@/lib/booking-filters";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const dateFilter = (params.get("date") as DateFilter) || "today";
  const from = params.get("from") ?? undefined;
  const to = params.get("to") ?? undefined;
  const status = params.get("status") ?? undefined;
  const city = params.get("city") ?? undefined;
  const search = params.get("search")?.trim() ?? undefined;

  const where: Prisma.BookingWhereInput = {};

  const range = dateRangeFor(dateFilter, from, to);
  if (range.gte || range.lt) {
    where.preferredDate = {};
    if (range.gte) where.preferredDate.gte = range.gte;
    if (range.lt) where.preferredDate.lt = range.lt;
  }

  if (status && status !== "all") {
    where.status = status as BookingStatus;
  }

  if (city && city !== "all") {
    where.city = city;
  }

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { carMake: { contains: search, mode: "insensitive" } },
      { carModel: { contains: search, mode: "insensitive" } },
    ];
  }

  const [bookings, total, todayCount, statusCounts, cities] = await Promise.all([
    prisma.booking.findMany({ where, orderBy: { preferredDate: "asc" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { preferredDate: dateRangeFor("today") } }),
    prisma.booking.groupBy({ by: ["status"], _count: true }),
    prisma.booking.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
  ]);

  const statusMap: Record<string, number> = {};
  for (const s of statusCounts) statusMap[s.status] = s._count;

  return NextResponse.json({
    bookings,
    stats: {
      total,
      today: todayCount,
      byStatus: statusMap,
    },
    cities: cities.map((c) => c.city),
  });
}
