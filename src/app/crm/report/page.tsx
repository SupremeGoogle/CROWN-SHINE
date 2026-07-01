import { BrandMark } from "@/components/ui/BrandMark";
import { PrintTrigger } from "@/components/admin/PrintTrigger";
import { getFilteredBookings, DATE_FILTER_LABELS } from "@/lib/reports";
import { getSiteContent } from "@/lib/content";
import type { DateFilter } from "@/lib/booking-filters";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-500/15 text-blue-300",
  CONFIRMED: "bg-gold/15 text-gold",
  COMPLETED: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-red-500/15 text-red-300",
};

export default async function CrmReportPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    from?: string;
    to?: string;
    status?: string;
    city?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const date = (params.date as DateFilter) || "today";
  const [content, { bookings, stats }] = await Promise.all([
    getSiteContent(),
    getFilteredBookings({
      date,
      from: params.from,
      to: params.to,
      status: params.status,
      city: params.city,
      search: params.search,
    }),
  ]);

  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const filterDescription = [
    DATE_FILTER_LABELS[date] ?? "Today",
    date === "custom" && params.from && params.to ? `(${params.from} → ${params.to})` : null,
    params.status && params.status !== "all" ? `Status: ${params.status}` : null,
    params.city && params.city !== "all" ? `City: ${params.city}` : null,
    params.search ? `Search: "${params.search}"` : null,
  ]
    .filter(Boolean)
    .join("  •  ");

  const serviceCounts = new Map<string, number>();
  const cityCounts = new Map<string, number>();
  for (const b of bookings) {
    serviceCounts.set(b.serviceName, (serviceCounts.get(b.serviceName) ?? 0) + 1);
    cityCounts.set(b.city, (cityCounts.get(b.city) ?? 0) + 1);
  }
  const topService = [...serviceCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const topCity = [...cityCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="report-page min-h-screen bg-ink px-4 py-6 text-cream sm:px-8 sm:py-10">
      <div className="no-print mb-8 flex justify-end">
        <PrintTrigger />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-gold/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="h-12 w-16 shrink-0" />
            <div>
              <p className="font-display text-xl">
                CROWN <span className="text-gold-gradient">SHINE</span>
              </p>
              <p className="text-xs uppercase tracking-widest text-cream/50">
                Booking Report
              </p>
            </div>
          </div>
          <div className="text-xs text-cream/50 sm:text-right">
            <p>Generated {generatedAt}</p>
            <p>{bookings.length} result{bookings.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gold/80">{filterDescription}</p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4">
          <ReportStat label="Total Bookings" value={stats.total} />
          <ReportStat label="Today" value={stats.today} />
          <ReportStat label="New" value={stats.byStatus.NEW ?? 0} />
          <ReportStat label="Confirmed" value={stats.byStatus.CONFIRMED ?? 0} />
          <ReportStat label="Completed" value={stats.byStatus.COMPLETED ?? 0} />
          <ReportStat label="Cancelled" value={stats.byStatus.CANCELLED ?? 0} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gold/15 p-4">
            <p className="text-xs uppercase tracking-widest text-gold/70">
              Most Requested Service (in this report)
            </p>
            <p className="mt-1 font-display text-lg">
              {topService ? `${topService[0]} (${topService[1]})` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-gold/15 p-4">
            <p className="text-xs uppercase tracking-widest text-gold/70">
              Busiest City (in this report)
            </p>
            <p className="mt-1 font-display text-lg">
              {topCity ? `${topCity[0]} (${topCity[1]})` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead>
            <tr className="border-b border-gold/25 uppercase tracking-widest text-gold/80">
              <th className="py-3 pr-3">Date / Time</th>
              <th className="py-3 pr-3">Customer</th>
              <th className="py-3 pr-3">Contact</th>
              <th className="py-3 pr-3">Vehicle</th>
              <th className="py-3 pr-3">Service</th>
              <th className="py-3 pr-3">Location</th>
              <th className="py-3 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-cream/40">
                  No bookings match this report&apos;s filters.
                </td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gold/10">
                <td className="py-3 pr-3 whitespace-nowrap">
                  {new Date(b.preferredDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <br />
                  <span className="text-cream/50">{b.preferredTime}</span>
                </td>
                <td className="py-3 pr-3">{b.customerName}</td>
                <td className="py-3 pr-3">
                  {b.phone}
                  <br />
                  <span className="text-cream/50">{b.email}</span>
                </td>
                <td className="py-3 pr-3">
                  {b.carYear ? `${b.carYear} ` : ""}
                  {b.carMake} {b.carModel}
                </td>
                <td className="py-3 pr-3">{b.serviceName}</td>
                <td className="py-3 pr-3">
                  {b.city}
                  <br />
                  <span className="text-cream/50">{b.address}</span>
                </td>
                <td className="py-3 pr-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="mt-12 border-t border-gold/15 pt-4 text-center text-[10px] text-cream/40">
          Crown Shine Mobile Detailing &mdash; Confidential internal report &mdash;{" "}
          {content.contact.phone} &mdash; {content.contact.email}
        </div>
      </div>
    </div>
  );
}

function ReportStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gold/15 px-3 py-4 text-center">
      <p className="font-display text-2xl text-gold-gradient">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-cream/55">{label}</p>
    </div>
  );
}
