"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    // Показываем заставку только один раз за сессию (первое открытие сайта).
    // При переходах по якорным ссылкам и повторной навигации она не появляется.
    if (sessionStorage.getItem("cs_splash_shown")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time splash gate on mount
      setPhase("gone");
      return;
    }
    sessionStorage.setItem("cs_splash_shown", "1");
    const t1 = setTimeout(() => setPhase("fade"), 1700);
    const t2 = setTimeout(() => setPhase("gone"), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] hidden md:flex items-center justify-center bg-ink transition-opacity duration-500 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="loaderRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8a6d1d" />
                <stop offset="50%" stopColor="#f3e0a3" />
                <stop offset="100%" stopColor="#8a6d1d" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#loaderRing)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="80 210"
            />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, no optimization needed */}
          <img
            src="/logo.png"
            alt="Crown Shine"
            className="animate-loader-glow h-20 w-auto object-contain"
          />
        </div>
        <p className="text-gold-gradient font-display text-sm tracking-[0.3em]">CROWN SHINE</p>
      </div>
    </div>
  );
}
