import "server-only";
import { Prisma, BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dateRangeFor, type DateFilter } from "@/lib/booking-filters";

export interface BookingFilters {
  date: DateFilter;
  from?: string;
  to?: string;
  status?: string;
  city?: string;
  search?: string;
}

function buildWhere(filters: BookingFilters): Prisma.BookingWhereInput {
  const where: Prisma.BookingWhereInput = {};

  const range = dateRangeFor(filters.date, filters.from, filters.to);
  if (range.gte || range.lt) {
    where.preferredDate = {};
    if (range.gte) where.preferredDate.gte = range.gte;
    if (range.lt) where.preferredDate.lt = range.lt;
  }

  if (filters.status && filters.status !== "all") {
    where.status = filters.status as BookingStatus;
  }

  if (filters.city && filters.city !== "all") {
    where.city = filters.city;
  }

  if (filters.search) {
    where.OR = [
      { customerName: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { carMake: { contains: filters.search, mode: "insensitive" } },
      { carModel: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getFilteredBookings(filters: BookingFilters) {
  const where = buildWhere(filters);

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

  return {
    bookings,
    stats: { total, today: todayCount, byStatus: statusMap },
    cities: cities.map((c) => c.city),
  };
}

export const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  today: "Today",
  week: "Next 7 Days",
  upcoming: "Upcoming",
  past: "Past",
  all: "All Time",
  custom: "Custom Range",
};
