"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

import { StepVehicle } from "@/components/booking/StepVehicle";
import { StepService } from "@/components/booking/StepService";
import { StepSchedule } from "@/components/booking/StepSchedule";
import { StepContact } from "@/components/booking/StepContact";
import type { CarValue } from "@/components/booking/CarPicker";
import type { ServicePackage } from "@/types/site-content";
import { DEFAULT_VEHICLE_TYPES, type VehicleType } from "@/lib/vehicles";

const STEPS = ["Vehicle", "Service", "Schedule", "Contact"] as const;

export function BookingWizard({
  services,
  cities,
  vehicleTypes,
  preselectedServiceId,
}: {
  services: ServicePackage[];
  cities: string[];
  vehicleTypes?: VehicleType[];
  preselectedServiceId?: string;
}) {
  const types = vehicleTypes && vehicleTypes.length ? vehicleTypes : DEFAULT_VEHICLE_TYPES;
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [car, setCar] = useState<CarValue>({
    category: "",
    make: "",
    model: "",
    year: "",
    source: "CATALOG",
  });
  const [serviceId, setServiceId] = useState(
    preselectedServiceId && services.some((s) => s.id === preselectedServiceId)
      ? preselectedServiceId
      : services[0]?.id ?? ""
  );
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [contact, setContact] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    marketingEmailConsent: false,
    marketingSmsConsent: false,
  });

  const canNext = (() => {
    if (step === 0) return Boolean(car.category && car.make && car.model);
    if (step === 1) return Boolean(serviceId);
    if (step === 2) return Boolean(date && time);
    return true;
  })();

  const canSubmit =
    contact.customerName && contact.phone && contact.address && contact.city;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const selectedService = services.find((s) => s.id === serviceId);
      const selectedType = types.find((t) => t.name === car.category);
      const quotePrice = selectedType?.prices?.[serviceId] || selectedType?.price || "";
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: contact.customerName,
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
          city: contact.city,
          carMake: car.make,
          carModel: car.model,
          carYear: car.year || undefined,
          carSource: car.source,
          vehicleCategory: quotePrice ? `${car.category} · ${quotePrice}` : car.category,
          serviceName: selectedService?.name ?? serviceId,
          notes: notes || undefined,
          preferredDate: date,
          preferredTime: time,
          marketingEmailConsent: contact.marketingEmailConsent,
          marketingSmsConsent: contact.marketingSmsConsent,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <GlassCard strong className="mx-auto max-w-lg gold-border-glow p-10 text-center">
        <img src="/logo.png" alt="Crown Shine" className="mx-auto mb-4 h-12 w-auto object-contain" />
        <h2 className="font-display text-2xl text-gold-gradient">You&apos;re All Set!</h2>
        <p className="mt-3 text-sm text-cream/70">
          Your booking request has been received. We&apos;ll reach out shortly to confirm
          your appointment for <strong>{date}</strong> at <strong>{time}</strong>.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                i <= step
                  ? "border-gold bg-gold text-ink"
                  : "border-gold/25 text-cream/40"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-[10px] uppercase tracking-widest ${
                i <= step ? "text-gold" : "text-cream/35"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <GlassCard strong className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <StepVehicle value={car} onChange={setCar} vehicleTypes={types} />
            )}
            {step === 1 && (
              <StepService
                services={services}
                selectedId={serviceId}
                onSelect={setServiceId}
                notes={notes}
                onNotesChange={setNotes}
                vehicleType={types.find((t) => t.name === car.category)}
              />
            )}
            {step === 2 && (
              <StepSchedule
                date={date}
                time={time}
                onDateChange={setDate}
                onTimeChange={setTime}
              />
            )}
            {step === 3 && (
              <StepContact value={contact} onChange={setContact} cities={cities} />
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-10 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
