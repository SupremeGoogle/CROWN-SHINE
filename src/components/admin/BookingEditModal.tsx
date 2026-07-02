"use client";

import { useState } from "react";
import { X, Trash2, Save } from "lucide-react";
import { SelectMenu } from "@/components/ui/SelectMenu";

export interface BookingRecord {
  id: string;
  createdAt: string;
  status: "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  customerName: string;
  phone: string;
  email: string | null;
  carMake: string;
  carModel: string;
  carYear: string | null;
  serviceName: string;
  notes: string | null;
  adminNotes: string | null;
  address: string;
  city: string;
  preferredDate: string;
  preferredTime: string;
  marketingEmailConsent: boolean;
  marketingSmsConsent: boolean;
}

const STATUS_OPTIONS = ["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toDateInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const field =
  "w-full rounded-lg border border-gold/25 bg-ink-soft/60 px-3 py-2 text-sm text-cream outline-none focus:border-gold/60 [color-scheme:dark]";

export function BookingEditModal({
  booking,
  onClose,
  onSaved,
  onDeleted,
}: {
  booking: BookingRecord;
  onClose: () => void;
  onSaved: (b: BookingRecord) => void;
  onDeleted: (id: string) => void;
}) {
  const [form, setForm] = useState({
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email ?? "",
    carYear: booking.carYear ?? "",
    carMake: booking.carMake,
    carModel: booking.carModel,
    serviceName: booking.serviceName,
    preferredDate: toDateInput(booking.preferredDate),
    preferredTime: booking.preferredTime,
    city: booking.city,
    address: booking.address,
    status: booking.status,
    notes: booking.notes ?? "",
    adminNotes: booking.adminNotes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not save.");
      onSaved(data.booking as BookingRecord);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this booking permanently? This cannot be undone.")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Could not delete.");
      }
      onDeleted(booking.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={onClose}
    >
      <div
        className="glass-panel-strong my-8 w-full max-w-2xl rounded-2xl p-6 sm:p-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl text-cream">
            Edit <span className="text-gold-gradient">Booking</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-cream/50 transition hover:text-gold"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Customer Name">
            <input className={field} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
          </L>
          <L label="Phone">
            <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </L>
          <L label="Email" full>
            <input className={field} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="(optional)" />
          </L>
          <L label="Year">
            <input className={field} value={form.carYear} onChange={(e) => set("carYear", e.target.value)} placeholder="(optional)" />
          </L>
          <L label="Make">
            <input className={field} value={form.carMake} onChange={(e) => set("carMake", e.target.value)} />
          </L>
          <L label="Model">
            <input className={field} value={form.carModel} onChange={(e) => set("carModel", e.target.value)} />
          </L>
          <L label="Service" full>
            <input className={field} value={form.serviceName} onChange={(e) => set("serviceName", e.target.value)} />
          </L>
          <L label="Date">
            <input type="date" lang="en-US" className={field} value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} />
          </L>
          <L label="Time">
            <input className={field} value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} />
          </L>
          <L label="City">
            <input className={field} value={form.city} onChange={(e) => set("city", e.target.value)} />
          </L>
          <L label="Status">
            <SelectMenu
              options={STATUS_OPTIONS}
              value={form.status}
              placeholder="Status"
              onChange={(v) => set("status", v as BookingRecord["status"])}
            />
          </L>
          <L label="Address" full>
            <input className={field} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </L>
          <L label="Customer Notes" full>
            <textarea className={field} rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </L>
          <L label="Admin Comment" full>
            <textarea
              className={field}
              rows={3}
              value={form.adminNotes}
              onChange={(e) => set("adminNotes", e.target.value)}
              placeholder="Internal notes — not shown to the customer"
            />
          </L>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={remove}
            disabled={deleting || saving}
            className="flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={15} /> {deleting ? "Deleting…" : "Delete"}
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gold/25 px-4 py-2 text-sm text-cream/75 hover:border-gold/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || deleting}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-gold-dark)] via-[var(--color-gold)] to-[var(--color-gold-light)] px-5 py-2 text-sm font-semibold text-ink shadow-lg disabled:opacity-50"
            >
              <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-gold/70">
        {label}
      </label>
      {children}
    </div>
  );
}
