const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function StepSchedule({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const isSunday = date ? new Date(date + "T00:00:00").getDay() === 0 : false;

  return (
    <div>
      <h2 className="font-display text-2xl text-cream">Pick a Date &amp; Time</h2>
      <p className="mt-1 mb-6 text-sm text-cream/60">
        We&apos;re available Monday–Saturday, 8:00 AM – 7:00 PM.
      </p>

      <div className="max-w-xs">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Date
        </label>
        <input
          type="date"
          min={todayIso()}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream outline-none focus:border-gold/60 [color-scheme:dark]"
        />
        {isSunday && (
          <p className="mt-2 text-xs text-amber-400">
            We&apos;re closed on Sundays — please pick another day.
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
          Time
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => onTimeChange(t)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                time === t
                  ? "border-gold bg-gold text-ink font-semibold"
                  : "border-gold/25 text-cream/75 hover:border-gold/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
