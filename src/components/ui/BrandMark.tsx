import type { CSSProperties } from "react";

/**
 * Crown Shine brand mark: interlocking wireframe crown over a coupe silhouette.
 * Pure gold linework on a transparent background, matching the business card artwork.
 */
export function BrandMark({
  className,
  style,
  gold = "#d4af37",
}: {
  className?: string;
  style?: CSSProperties;
  gold?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 320"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={gold} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <polygon points="30,206 78,96 126,206" />
        <polygon points="96,206 156,54 216,206" />
        <polygon points="152,206 200,26 248,206" />
        <polygon points="184,206 244,54 304,206" />
        <polygon points="274,206 322,96 370,206" />
        <line x1="14" y1="206" x2="386" y2="206" />
        <line x1="14" y1="220" x2="386" y2="220" />
      </g>

      <g stroke={gold} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M15,296
             Q18,268 55,258
             Q95,250 105,250
             Q118,218 155,214
             Q200,208 245,214
             Q282,218 295,250
             Q305,250 345,258
             Q382,268 385,296
             L345,296
             C325,272 300,272 280,296
             L120,296
             C100,272 75,272 55,296
             Z"
        />
        <path d="M138,251 Q145,240 160,238" strokeWidth="3" />
      </g>
    </svg>
  );
}
