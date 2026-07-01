import Link from "next/link";

export interface ContactValue {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  marketingEmailConsent: boolean;
  marketingSmsConsent: boolean;
}

export function StepContact({
  value,
  onChange,
  cities,
}: {
  value: ContactValue;
  onChange: (value: ContactValue) => void;
  cities: string[];
}) {
  const cityIsCustom = value.city !== "" && !cities.includes(value.city);

  return (
    <div>
      <h2 className="font-display text-2xl text-cream">Your Details</h2>
      <p className="mt-1 mb-6 text-sm text-cream/60">
        Where should we send your Crown Shine detailer?
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name">
          <input
            required
            type="text"
            value={value.customerName}
            onChange={(e) => onChange({ ...value, customerName: e.target.value })}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </Field>
        <Field label="Phone">
          <input
            required
            type="tel"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="(206) 555-0123"
            className={inputClass}
          />
        </Field>
        <Field label="Email" className="sm:col-span-2">
          <input
            required
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="jane@email.com"
            className={inputClass}
          />
        </Field>
        <Field label="Service Address" className="sm:col-span-2">
          <input
            required
            type="text"
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="Street address where we'll detail your car"
            className={inputClass}
          />
        </Field>
        <Field label="City">
          <select
            value={cityIsCustom ? "Other" : value.city}
            onChange={(e) =>
              onChange({ ...value, city: e.target.value === "Other" ? "" : e.target.value })
            }
            className={inputClass}
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </Field>
        {(cityIsCustom || value.city === "") && (
          <Field label="City (type yours)">
            <input
              type="text"
              value={cityIsCustom ? value.city : ""}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              placeholder="Enter your city"
              className={inputClass}
            />
          </Field>
        )}
      </div>

      <div className="mt-8 space-y-3 border-t border-gold/15 pt-6">
        <label className="flex items-start gap-3 text-sm text-cream/75">
          <input
            type="checkbox"
            checked={value.marketingEmailConsent}
            onChange={(e) =>
              onChange({ ...value, marketingEmailConsent: e.target.checked })
            }
            className="mt-0.5 h-4 w-4 accent-[var(--color-gold)]"
          />
          Yes, send me promos and updates by email.
        </label>
        <label className="flex items-start gap-3 text-sm text-cream/75">
          <input
            type="checkbox"
            checked={value.marketingSmsConsent}
            onChange={(e) => onChange({ ...value, marketingSmsConsent: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-[var(--color-gold)]"
          />
          Yes, text me promos and updates (msg &amp; data rates may apply, reply STOP to opt out).
        </label>
        <p className="text-xs text-cream/45">
          We&apos;ll only use your info to schedule and confirm this appointment, plus
          marketing you&apos;ve opted into above. See our{" "}
          <Link href="/privacy" className="underline hover:text-gold">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-gold/60 [color-scheme:dark]";

function Field({
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
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </label>
      {children}
    </div>
  );
}
