import { NextRequest, NextResponse } from "next/server";
import { getFilteredBookings } from "@/lib/reports";
import type { DateFilter } from "@/lib/booking-filters";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const result = await getFilteredBookings({
    date: (params.get("date") as DateFilter) || "today",
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
    status: params.get("status") ?? undefined,
    city: params.get("city") ?? undefined,
    search: params.get("search")?.trim() ?? undefined,
  });

  return NextResponse.json(result);
}
