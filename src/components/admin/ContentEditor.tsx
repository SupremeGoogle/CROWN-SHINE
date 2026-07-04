"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea, RemoveButton, AddButton, ImageUploader } from "@/components/admin/fields";
import type { SiteContent, ServicePackage, WhyUsIcon } from "@/types/site-content";
import { WHY_US_ICONS } from "@/types/site-content";
import { DEFAULT_VEHICLE_TYPES } from "@/lib/vehicles";
import { Check, AlertCircle } from "lucide-react";

const TABS = [
  "Hero",
  "About",
  "Services",
  "Vehicles",
  "Gallery",
  "Why Us",
  "Service Area",
  "Testimonials",
  "FAQ",
  "Contact",
  "Links",
] as const;

export function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => setContent(d.content))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      setMessage({ type: "ok", text: "Saved. Your website will update in ~1 minute." });
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-cream/50">Loading content...</p>;
  if (!content) return <p className="text-red-400">Failed to load content.</p>;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            Site <span className="text-gold-gradient">Content</span>
          </h1>
          <p className="mt-1 text-sm text-cream/55">
            Edit any part of your website below, then save to publish changes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`flex items-center gap-1.5 text-sm ${
                message.type === "ok" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {message.type === "ok" ? <Check size={15} /> : <AlertCircle size={15} />}
              {message.text}
            </span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              tab === t ? "bg-gold text-ink font-semibold" : "border border-gold/20 text-cream/70 hover:border-gold/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <GlassCard className="p-6 sm:p-8">
        {tab === "Hero" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Eyebrow" className="sm:col-span-2">
              <TextInput
                value={content.hero.eyebrow}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, eyebrow: v } })}
              />
            </Field>
            <Field label="Title" className="sm:col-span-2">
              <TextInput
                value={content.hero.title}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, title: v } })}
              />
            </Field>
            <Field label="Subtitle" className="sm:col-span-2">
              <TextArea
                value={content.hero.subtitle}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })}
              />
            </Field>
            <Field label="Primary Button Label">
              <TextInput
                value={content.hero.ctaLabel}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, ctaLabel: v } })}
              />
            </Field>
            <Field label="Secondary Button Label">
              <TextInput
                value={content.hero.secondaryCtaLabel}
                onChange={(v) =>
                  setContent({ ...content, hero: { ...content.hero, secondaryCtaLabel: v } })
                }
              />
            </Field>
          </div>
        )}

        {tab === "About" && (
          <div className="space-y-6">
            <Field label="Title">
              <TextInput
                value={content.about.title}
                onChange={(v) => setContent({ ...content, about: { ...content.about, title: v } })}
              />
            </Field>
            <Field label="Body">
              <TextArea
                rows={5}
                value={content.about.body}
                onChange={(v) => setContent({ ...content, about: { ...content.about, body: v } })}
              />
            </Field>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold/80">
                Stats
              </p>
              <div className="space-y-3">
                {content.about.stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <TextInput
                      value={s.value}
                      placeholder="Value (e.g. 500+)"
                      onChange={(v) => {
                        const stats = [...content.about.stats];
                        stats[i] = { ...stats[i], value: v };
                        setContent({ ...content, about: { ...content.about, stats } });
                      }}
                    />
                    <TextInput
                      value={s.label}
                      placeholder="Label (e.g. Cars Detailed)"
                      onChange={(v) => {
                        const stats = [...content.about.stats];
                        stats[i] = { ...stats[i], label: v };
                        setContent({ ...content, about: { ...content.about, stats } });
                      }}
                    />
                    <RemoveButton
                      onClick={() => {
                        const stats = content.about.stats.filter((_, idx) => idx !== i);
                        setContent({ ...content, about: { ...content.about, stats } });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <AddButton
                  label="Add Stat"
                  onClick={() =>
                    setContent({
                      ...content,
                      about: {
                        ...content.about,
                        stats: [...content.about.stats, { label: "", value: "" }],
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {tab === "Services" && (
          <div className="space-y-6">
            {content.services.map((s, i) => (
              <ServiceEditor
                key={i}
                service={s}
                onChange={(updated) => {
                  const services = [...content.services];
                  services[i] = updated;
                  setContent({ ...content, services });
                }}
                onRemove={() => {
                  const services = content.services.filter((_, idx) => idx !== i);
                  setContent({ ...content, services });
                }}
              />
            ))}
            <AddButton
              label="Add Service Package"
              onClick={() =>
                setContent({
                  ...content,
                  services: [
                    ...content.services,
                    {
                      id: `service-${Date.now()}`,
                      name: "",
                      price: "",
                      duration: "",
                      description: "",
                      features: [],
                    },
                  ],
                })
              }
            />
          </div>
        )}

        {tab === "Vehicles" &&
          (() => {
            const types = content.vehicleTypes ?? DEFAULT_VEHICLE_TYPES;
            const update = (v: NonNullable<SiteContent["vehicleTypes"]>) =>
              setContent({ ...content, vehicleTypes: v });
            return (
              <div className="space-y-6">
                <p className="text-sm text-cream/55">
                  Vehicle types shown in the booking form. The starting price follows the type
                  the customer picks, and only that type&apos;s models appear in the list.
                </p>
                {types.map((t, ti) => (
                  <div key={t.id} className="rounded-xl border border-gold/15 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Type Name (e.g. Large SUV)">
                        <TextInput
                          value={t.name}
                          onChange={(v) => {
                            const arr = [...types];
                            arr[ti] = { ...arr[ti], name: v };
                            update(arr);
                          }}
                        />
                      </Field>
                      <Field label="Starting Price (e.g. From $110)">
                        <TextInput
                          value={t.price}
                          onChange={(v) => {
                            const arr = [...types];
                            arr[ti] = { ...arr[ti], price: v };
                            update(arr);
                          }}
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold/80">
                        Models
                      </label>
                      <div className="space-y-2">
                        {t.models.map((m, mi) => (
                          <div key={mi} className="flex items-center gap-2">
                            <TextInput
                              value={m}
                              onChange={(v) => {
                                const arr = [...types];
                                const models = [...arr[ti].models];
                                models[mi] = v;
                                arr[ti] = { ...arr[ti], models };
                                update(arr);
                              }}
                            />
                            <RemoveButton
                              onClick={() => {
                                const arr = [...types];
                                arr[ti] = {
                                  ...arr[ti],
                                  models: arr[ti].models.filter((_, x) => x !== mi),
                                };
                                update(arr);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <AddButton
                          label="Add Model"
                          onClick={() => {
                            const arr = [...types];
                            arr[ti] = { ...arr[ti], models: [...arr[ti].models, ""] };
                            update(arr);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 border-t border-gold/10 pt-4">
                      <RemoveButton onClick={() => update(types.filter((_, x) => x !== ti))} />
                    </div>
                  </div>
                ))}
                <AddButton
                  label="Add Vehicle Type"
                  onClick={() =>
                    update([...types, { id: `type-${Date.now()}`, name: "", price: "", models: [] }])
                  }
                />
              </div>
            );
          })()}

        {tab === "Gallery" && (
          <div className="space-y-6">
            <Field label="Title">
              <TextInput
                value={content.gallery.title}
                onChange={(v) => setContent({ ...content, gallery: { ...content.gallery, title: v } })}
              />
            </Field>
            <Field label="Subtitle">
              <TextArea
                value={content.gallery.subtitle}
                onChange={(v) =>
                  setContent({ ...content, gallery: { ...content.gallery, subtitle: v } })
                }
              />
            </Field>
            <div className="space-y-4">
              {content.gallery.items.map((item, i) => (
                <div key={item.id} className="rounded-xl border border-gold/15 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Caption (e.g. Signature Detail)">
                      <TextInput
                        value={item.caption}
                        onChange={(v) => {
                          const items = [...content.gallery.items];
                          items[i] = { ...items[i], caption: v };
                          setContent({ ...content, gallery: { ...content.gallery, items } });
                        }}
                      />
                    </Field>
                    <Field label="Tag (e.g. Tesla Model S)">
                      <TextInput
                        value={item.tag}
                        onChange={(v) => {
                          const items = [...content.gallery.items];
                          items[i] = { ...items[i], tag: v };
                          setContent({ ...content, gallery: { ...content.gallery, items } });
                        }}
                      />
                    </Field>
                    <Field label="Photo (upload from device or paste a URL — blank shows a placeholder)" className="sm:col-span-2">
                      <ImageUploader
                        value={item.image ?? ""}
                        onChange={(v) => {
                          const items = [...content.gallery.items];
                          items[i] = { ...items[i], image: v };
                          setContent({ ...content, gallery: { ...content.gallery, items } });
                        }}
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <RemoveButton
                      onClick={() => {
                        const items = content.gallery.items.filter((_, idx) => idx !== i);
                        setContent({ ...content, gallery: { ...content.gallery, items } });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <AddButton
              label="Add Photo"
              onClick={() =>
                setContent({
                  ...content,
                  gallery: {
                    ...content.gallery,
                    items: [
                      ...content.gallery.items,
                      { id: `gallery-${Date.now()}`, caption: "", tag: "", image: "" },
                    ],
                  },
                })
              }
            />
          </div>
        )}

        {tab === "Why Us" && (
          <div className="space-y-6">
            <Field label="Title">
              <TextInput
                value={content.whyUs.title}
                onChange={(v) => setContent({ ...content, whyUs: { ...content.whyUs, title: v } })}
              />
            </Field>
            <div className="space-y-4">
              {content.whyUs.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-gold/15 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Icon">
                      <select
                        value={item.icon}
                        onChange={(e) => {
                          const items = [...content.whyUs.items];
                          items[i] = { ...items[i], icon: e.target.value as WhyUsIcon };
                          setContent({ ...content, whyUs: { ...content.whyUs, items } });
                        }}
                        className="w-full rounded-lg border border-gold/25 bg-ink-soft/60 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold/60"
                      >
                        {WHY_US_ICONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Title">
                      <TextInput
                        value={item.title}
                        onChange={(v) => {
                          const items = [...content.whyUs.items];
                          items[i] = { ...items[i], title: v };
                          setContent({ ...content, whyUs: { ...content.whyUs, items } });
                        }}
                      />
                    </Field>
                    <Field label="Description" className="sm:col-span-2">
                      <TextArea
                        value={item.description}
                        onChange={(v) => {
                          const items = [...content.whyUs.items];
                          items[i] = { ...items[i], description: v };
                          setContent({ ...content, whyUs: { ...content.whyUs, items } });
                        }}
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <RemoveButton
                      onClick={() => {
                        const items = content.whyUs.items.filter((_, idx) => idx !== i);
                        setContent({ ...content, whyUs: { ...content.whyUs, items } });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <AddButton
              label="Add Reason"
              onClick={() =>
                setContent({
                  ...content,
                  whyUs: {
                    ...content.whyUs,
                    items: [
                      ...content.whyUs.items,
                      { icon: "star", title: "", description: "" },
                    ],
                  },
                })
              }
            />
          </div>
        )}

        {tab === "Service Area" && (
          <div className="space-y-6">
            <Field label="Title">
              <TextInput
                value={content.serviceArea.title}
                onChange={(v) =>
                  setContent({ ...content, serviceArea: { ...content.serviceArea, title: v } })
                }
              />
            </Field>
            <Field label="Subtitle">
              <TextArea
                value={content.serviceArea.subtitle}
                onChange={(v) =>
                  setContent({ ...content, serviceArea: { ...content.serviceArea, subtitle: v } })
                }
              />
            </Field>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold/80">
                Cities Served
              </p>
              <div className="flex flex-wrap gap-3">
                {content.serviceArea.cities.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      value={c}
                      onChange={(e) => {
                        const cities = [...content.serviceArea.cities];
                        cities[i] = e.target.value;
                        setContent({ ...content, serviceArea: { ...content.serviceArea, cities } });
                      }}
                      className="w-32 rounded-lg border border-gold/25 bg-ink-soft/60 px-3 py-2 text-sm text-cream outline-none focus:border-gold/60"
                    />
                    <RemoveButton
                      onClick={() => {
                        const cities = content.serviceArea.cities.filter((_, idx) => idx !== i);
                        setContent({ ...content, serviceArea: { ...content.serviceArea, cities } });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <AddButton
                  label="Add City"
                  onClick={() =>
                    setContent({
                      ...content,
                      serviceArea: {
                        ...content.serviceArea,
                        cities: [...content.serviceArea.cities, ""],
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {tab === "Testimonials" && (
          <div className="space-y-6">
            {content.testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border border-gold/15 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Customer Name">
                    <TextInput
                      value={t.name}
                      onChange={(v) => {
                        const testimonials = [...content.testimonials];
                        testimonials[i] = { ...testimonials[i], name: v };
                        setContent({ ...content, testimonials });
                      }}
                    />
                  </Field>
                  <Field label="Quote" className="sm:col-span-2">
                    <TextArea
                      value={t.quote}
                      onChange={(v) => {
                        const testimonials = [...content.testimonials];
                        testimonials[i] = { ...testimonials[i], quote: v };
                        setContent({ ...content, testimonials });
                      }}
                    />
                  </Field>
                  <Field label="Rating (1-5)">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={t.rating}
                      onChange={(e) => {
                        const testimonials = [...content.testimonials];
                        testimonials[i] = {
                          ...testimonials[i],
                          rating: Number(e.target.value),
                        };
                        setContent({ ...content, testimonials });
                      }}
                      className="w-24 rounded-lg border border-gold/25 bg-ink-soft/60 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold/60"
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <RemoveButton
                    onClick={() => {
                      const testimonials = content.testimonials.filter((_, idx) => idx !== i);
                      setContent({ ...content, testimonials });
                    }}
                  />
                </div>
              </div>
            ))}
            <AddButton
              label="Add Testimonial"
              onClick={() =>
                setContent({
                  ...content,
                  testimonials: [
                    ...content.testimonials,
                    { name: "", quote: "", rating: 5 },
                  ],
                })
              }
            />
          </div>
        )}

        {tab === "FAQ" && (
          <div className="space-y-6">
            <Field label="Title">
              <TextInput
                value={content.faq.title}
                onChange={(v) => setContent({ ...content, faq: { ...content.faq, title: v } })}
              />
            </Field>
            <div className="space-y-4">
              {content.faq.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-gold/15 p-5">
                  <Field label="Question">
                    <TextInput
                      value={item.question}
                      onChange={(v) => {
                        const items = [...content.faq.items];
                        items[i] = { ...items[i], question: v };
                        setContent({ ...content, faq: { ...content.faq, items } });
                      }}
                    />
                  </Field>
                  <div className="mt-4">
                    <Field label="Answer">
                      <TextArea
                        value={item.answer}
                        onChange={(v) => {
                          const items = [...content.faq.items];
                          items[i] = { ...items[i], answer: v };
                          setContent({ ...content, faq: { ...content.faq, items } });
                        }}
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <RemoveButton
                      onClick={() => {
                        const items = content.faq.items.filter((_, idx) => idx !== i);
                        setContent({ ...content, faq: { ...content.faq, items } });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <AddButton
              label="Add Question"
              onClick={() =>
                setContent({
                  ...content,
                  faq: {
                    ...content.faq,
                    items: [...content.faq.items, { question: "", answer: "" }],
                  },
                })
              }
            />
          </div>
        )}

        {tab === "Contact" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone">
              <TextInput
                value={content.contact.phone}
                onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })}
              />
            </Field>
            <Field label="Instagram URL">
              <TextInput
                value={content.contact.instagram}
                onChange={(v) =>
                  setContent({ ...content, contact: { ...content.contact, instagram: v } })
                }
              />
            </Field>
            <Field label="Instagram Handle">
              <TextInput
                value={content.contact.instagramHandle}
                onChange={(v) =>
                  setContent({ ...content, contact: { ...content.contact, instagramHandle: v } })
                }
              />
            </Field>
            <Field label="Business Hours" className="sm:col-span-2">
              <TextInput
                value={content.contact.hours}
                onChange={(v) => setContent({ ...content, contact: { ...content.contact, hours: v } })}
              />
            </Field>
            <Field label="Footer Tagline" className="sm:col-span-2">
              <TextInput
                value={content.footer.tagline}
                onChange={(v) => setContent({ ...content, footer: { tagline: v } })}
              />
            </Field>
          </div>
        )}

        {tab === "Links" &&
          (() => {
            const links: NonNullable<SiteContent["links"]> =
              content.links ?? { title: "", subtitle: "", items: [] };
            const update = (l: NonNullable<SiteContent["links"]>) =>
              setContent({ ...content, links: l });
            return (
              <div className="space-y-6">
                <p className="text-sm text-cream/55">
                  These buttons show on your public links page (<code className="text-gold/80">/links</code>) —
                  perfect behind a QR code on business cards &amp; stickers.
                </p>
                <Field label="Page Title">
                  <TextInput value={links.title} onChange={(v) => update({ ...links, title: v })} />
                </Field>
                <Field label="Subtitle">
                  <TextArea value={links.subtitle} onChange={(v) => update({ ...links, subtitle: v })} />
                </Field>
                <div className="space-y-4">
                  {links.items.map((item, i) => (
                    <div key={item.id} className="rounded-xl border border-gold/15 p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Button Label">
                          <TextInput
                            value={item.label}
                            onChange={(v) => {
                              const items = [...links.items];
                              items[i] = { ...items[i], label: v };
                              update({ ...links, items });
                            }}
                          />
                        </Field>
                        <Field label="URL (https://…, tel:…, or /book)">
                          <TextInput
                            value={item.url}
                            onChange={(v) => {
                              const items = [...links.items];
                              items[i] = { ...items[i], url: v };
                              update({ ...links, items });
                            }}
                          />
                        </Field>
                      </div>
                      <div className="mt-4">
                        <RemoveButton
                          onClick={() => update({ ...links, items: links.items.filter((_, idx) => idx !== i) })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <AddButton
                  label="Add Link"
                  onClick={() =>
                    update({
                      ...links,
                      items: [...links.items, { id: `link-${Date.now()}`, label: "", url: "" }],
                    })
                  }
                />
              </div>
            );
          })()}
      </GlassCard>
    </div>
  );
}

function ServiceEditor({
  service,
  onChange,
  onRemove,
}: {
  service: ServicePackage;
  onChange: (s: ServicePackage) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-gold/15 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput value={service.name} onChange={(v) => onChange({ ...service, name: v })} />
        </Field>
        <Field label="Price">
          <TextInput value={service.price} onChange={(v) => onChange({ ...service, price: v })} />
        </Field>
        <Field label="Duration">
          <TextInput
            value={service.duration}
            onChange={(v) => onChange({ ...service, duration: v })}
          />
        </Field>
        <Field label="Highlighted">
          <label className="flex h-full items-center gap-2 text-sm text-cream/75">
            <input
              type="checkbox"
              checked={Boolean(service.highlighted)}
              onChange={(e) => onChange({ ...service, highlighted: e.target.checked })}
              className="h-4 w-4 accent-[var(--color-gold)]"
            />
            Show &ldquo;Most Popular&rdquo; badge
          </label>
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <TextArea
            value={service.description}
            onChange={(v) => onChange({ ...service, description: v })}
          />
        </Field>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold/80">
          Features
        </p>
        <div className="space-y-2">
          {service.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <TextInput
                value={f}
                onChange={(v) => {
                  const features = [...service.features];
                  features[i] = v;
                  onChange({ ...service, features });
                }}
              />
              <RemoveButton
                onClick={() => onChange({ ...service, features: service.features.filter((_, idx) => idx !== i) })}
              />
            </div>
          ))}
        </div>
        <div className="mt-2">
          <AddButton
            label="Add Feature"
            onClick={() => onChange({ ...service, features: [...service.features, ""] })}
          />
        </div>
      </div>

      <div className="mt-4">
        <RemoveButton onClick={onRemove} />
      </div>
    </div>
  );
}
