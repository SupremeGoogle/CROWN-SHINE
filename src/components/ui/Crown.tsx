import type { CSSProperties } from "react";

export function CrownIcon({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 40 L2 16 L16 26 L24 8 L32 20 L40 8 L48 26 L62 16 L60 40 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M4 40 H60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
