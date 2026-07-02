"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { Search, RefreshCw, FileText, Pencil, Download } from "lucide-react";
import { BookingEditModal, type BookingRecord } from "@/components/admin/BookingEditModal";

type Booking = BookingRecord;

interface ApiResponse {
  bookings: Booking[];
  stats: { total: number; today: number; byStatus: Record<string, number> };
  cities: string[];
}

const DATE_FILTERS = [
  { value: "today", label: "Today" },
  { value: "week", label: "Next 7 Days" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom Range" },
];

const STATUS_OPTIONS = ["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CONFIRMED: "bg-gold/15 text-gold border-gold/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function CrmPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [demoBusy, setDemoBusy] = useState(false);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("date", dateFilter);
    if (dateFilter === "custom") {
      if (customFrom) p.set("from", customFrom);
      if (customTo) p.set("to", customTo);
    }
    p.set("status", status);
    p.set("city", city);
    if (search) p.set("search", search);
    return p.toString();
  }, [dateFilter, customFrom, customTo, status, city, search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?${query}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-filter-change pattern, verified working
    load();
  }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            bookings: prev.bookings.map((b) =>
              b.id === id ? { ...b, status: newStatus as Booking["status"] } : b
            ),
          }
        : prev
    );
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function seedDemo() {
    setDemoBusy(true);
    try {
      await fetch("/api/admin/demo-data", { method: "POST" });
      await load();
    } finally {
      setDemoBusy(false);
    }
  }

  async function clearDemo() {
    if (!window.confirm("Remove all demo/sample bookings?")) return;
    setDemoBusy(true);
    try {
      await fetch("/api/admin/demo-data", { method: "DELETE" });
      await load();
    } finally {
      setDemoBusy(false);
    }
  }

  function applyEdit(updated: Booking) {
    setData((prev) =>
      prev
        ? { ...prev, bookings: prev.bookings.map((b) => (b.id === updated.id ? updated : b)) }
        : prev
    );
    setEditing(null);
  }

  function removeBooking(id: string) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            bookings: prev.bookings.filter((b) => b.id !== id),
            stats: { ...prev.stats, total: Math.max(0, prev.stats.total - 1) },
          }
        : prev
    );
    setEditing(null);
  }

  const stats = data?.stats;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            Bookings <span className="text-gold-gradient">CRM</span>
          </h1>
          <p className="mt-1 text-sm text-cream/55">
            Manage and track every Crown Shine appointment.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/crm/report?${query}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)] px-5 py-2 text-sm font-semibold text-ink shadow-[0_6px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_26px_rgba(212,175,55,0.45)]"
          >
            <FileText size={14} /> Report
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download from an API route, not a page navigation */}
          <a
            href="/api/admin/bookings/export"
            className="flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-sm text-cream/75 hover:border-gold/50 hover:text-gold"
          >
            <Download size={14} /> Export XLSX
          </a>
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-sm text-cream/75 hover:border-gold/50 hover:text-gold"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={seedDemo}
            disabled={demoBusy}
            title="Fill the CRM with 200 sample bookings to preview it"
            className="rounded-full border border-gold/15 px-3 py-2 text-xs text-cream/50 hover:border-gold/40 hover:text-cream/80 disabled:opacity-50"
          >
            {demoBusy ? "…" : "+ Demo data"}
          </button>
          <button
            onClick={clearDemo}
            disabled={demoBusy}
            title="Remove all sample/demo bookings"
            className="rounded-full border border-red-500/20 px-3 py-2 text-xs text-red-300/70 hover:border-red-500/40 hover:text-red-300 disabled:opacity-50"
          >
            Clear demo
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Bookings" value={stats?.total ?? "-"} />
        <StatCard label="Today" value={stats?.today ?? "-"} />
        <StatCard label="New" value={stats?.byStatus?.NEW ?? 0} />
        <StatCard label="Confirmed" value={stats?.byStatus?.CONFIRMED ?? 0} />
        <StatCard label="Completed" value={stats?.byStatus?.COMPLETED ?? 0} />
        <StatCard label="Cancelled" value={stats?.byStatus?.CANCELLED ?? 0} />
      </div>

      <GlassCard className="relative z-20 mb-6 flex flex-wrap items-end gap-4 p-5">
        <FilterField label="Date" className="min-w-[150px]">
          <SelectMenu
            options={DATE_FILTERS.map((f) => f.label)}
            value={DATE_FILTERS.find((f) => f.value === dateFilter)?.label ?? ""}
            placeholder="Date"
            onChange={(label) => {
              const f = DATE_FILTERS.find((x) => x.label === label);
              if (f) setDateFilter(f.value);
            }}
          />
        </FilterField>

        {dateFilter === "custom" && (
          <>
            <FilterField label="From">
              <input
                type="date"
                lang="en-US"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className={`${selectClass} [color-scheme:dark]`}
              />
            </FilterField>
            <FilterField label="To">
              <input
                type="date"
                lang="en-US"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className={`${selectClass} [color-scheme:dark]`}
              />
            </FilterField>
          </>
        )}

        <FilterField label="Status" className="min-w-[150px]">
          <SelectMenu
            options={["All", ...STATUS_OPTIONS]}
            value={status === "all" ? "All" : status}
            placeholder="Status"
            onChange={(v) => setStatus(v === "All" ? "all" : v)}
          />
        </FilterField>

        <FilterField label="City" className="min-w-[160px]">
          <SelectMenu
            options={["All Cities", ...(data?.cities ?? [])]}
            value={city === "all" ? "All Cities" : city}
            placeholder="City"
            onChange={(v) => setCity(v === "All Cities" ? "all" : v)}
          />
        </FilterField>

        <FilterField label="Search" className="min-w-[220px] flex-1">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, phone, email, car..."
              className={`${selectClass} pl-9`}
            />
          </div>
        </FilterField>
      </GlassCard>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-xs uppercase tracking-widest text-gold/80">
              <th className="px-5 py-4">Date / Time</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Vehicle</th>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Edit</th>
            </tr>
          </thead>
          <tbody>
            {data?.bookings.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-cream/40">
                  No bookings match these filters.
                </td>
              </tr>
            )}
            {data?.bookings.map((b) => (
              <tr key={b.id} className="border-b border-gold/8 hover:bg-gold/5">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="font-medium text-cream">
                    {new Date(b.preferredDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-cream/50">{b.preferredTime}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-cream">{b.customerName}</div>
                  <div className="text-xs text-cream/50">{b.phone}</div>
                  <div className="text-xs text-cream/50">{b.email}</div>
                </td>
                <td className="px-5 py-4">
                  {b.carYear ? `${b.carYear} ` : ""}
                  {b.carMake} {b.carModel}
                </td>
                <td className="px-5 py-4">{b.serviceName}</td>
                <td className="px-5 py-4">
                  <div>{b.city}</div>
                  <div className="max-w-[160px] truncate text-xs text-cream/40">{b.address}</div>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${STATUS_STYLES[b.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-ink text-cream">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => setEditing(b)}
                    aria-label="Edit booking"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gold/25 text-cream/70 transition hover:border-gold/60 hover:text-gold"
                  >
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {editing && (
        <BookingEditModal
          booking={editing}
          onClose={() => setEditing(null)}
          onSaved={applyEdit}
          onDeleted={removeBooking}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <GlassCard className="flex flex-col items-center gap-1 px-3 py-5 text-center">
      <span className="font-display text-2xl text-gold-gradient">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-cream/55">{label}</span>
    </GlassCard>
  );
}

function FilterField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-gold/70">
        {label}
      </label>
      {children}
    </div>
  );
}

const selectClass =
  "w-full rounded-lg border border-gold/25 bg-ink-soft/60 px-3 py-2 text-sm text-cream outline-none focus:border-gold/60";
