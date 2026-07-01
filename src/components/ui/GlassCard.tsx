import type { HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  strong = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; strong?: boolean }) {
  return (
    <div
      className={`rounded-2xl ${strong ? "glass-panel-strong" : "glass-panel"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
