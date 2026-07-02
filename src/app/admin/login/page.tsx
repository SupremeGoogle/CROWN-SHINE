"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CrownPattern } from "@/components/CrownPattern";
import { BrandMark } from "@/components/ui/BrandMark";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Login failed");
      }
      const from = searchParams.get("from");
      router.push(from && from.startsWith("/") ? from : "/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <CrownPattern className="fixed" />
      <GlassCard strong className="relative z-10 w-full max-w-sm gold-border-glow p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <BrandMark className="mb-3 h-10 w-13 text-gold" gold="currentColor" />
          <h1 className="font-display text-xl text-cream">
            CROWN <span className="text-gold-gradient">SHINE</span>
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-cream/50">
            Admin &amp; CRM Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
              Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gold/25 bg-ink-soft/60 px-4 py-3 text-sm text-cream outline-none focus:border-gold/60"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
