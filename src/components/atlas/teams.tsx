/**
 * Each team on the route gets its own colour and a small motif drawn from what the work
 * was: a geocoding pin, map tiles, a gallery frame, a highway, a labyrinth, chat bubbles.
 * Deliberately quiet — the Spirit Hero stop keeps the loudest treatment.
 */
import type { ReactNode } from "react";

export type TeamTheme = { color: string; label: string; motif: ReactNode };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, vectorEffect: "non-scaling-stroke" as const };

export const TEAMS: Record<string, TeamTheme> = {
  "Ambalay Maps": {
    color: "var(--co-ambalay)",
    label: "geocoding",
    motif: (
      <>
        {[10, 18, 26].map((r) => (
          <circle key={r} cx="32" cy="40" r={r} {...stroke} strokeDasharray="2 4" opacity={1 - r / 40} />
        ))}
        <path d="M32 44 C24 32, 22 26, 22 22 a10 10 0 0 1 20 0 c0 4 -2 10 -10 22 Z" {...stroke} />
        <circle cx="32" cy="22" r="3.5" fill="currentColor" />
      </>
    ),
  },
  "Brana Software Solution": {
    color: "var(--co-brana)",
    label: "map tiles",
    motif: (
      <>
        {[
          [20, 18],
          [38, 18],
          [29, 33],
          [47, 33],
          [20, 48],
          [38, 48],
        ].map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y - 9} L${x + 8} ${y - 4.5} L${x + 8} ${y + 4.5} L${x} ${y + 9} L${x - 8} ${y + 4.5} L${x - 8} ${y - 4.5} Z`}
            {...stroke}
            fill={i === 2 ? "currentColor" : "none"}
            fillOpacity={0.35}
          />
        ))}
      </>
    ),
  },
  "Haddis Art": {
    color: "var(--co-haddis)",
    label: "gallery",
    motif: (
      <>
        <rect x="10" y="12" width="44" height="40" {...stroke} />
        <rect x="16" y="18" width="32" height="28" {...stroke} strokeDasharray="1 3" />
        <path d="M18 42 L28 30 L34 37 L39 32 L46 42" {...stroke} />
        <circle cx="40" cy="25" r="3" fill="currentColor" />
      </>
    ),
  },
  "Spotter AI": {
    color: "var(--co-spotter)",
    label: "freight",
    motif: (
      <>
        <path d="M6 50 C22 46, 30 30, 58 20" {...stroke} strokeWidth={6} opacity={0.25} />
        <path d="M6 50 C22 46, 30 30, 58 20" {...stroke} strokeDasharray="4 4" />
        <rect x="40" y="16" width="12" height="7" fill="currentColor" transform="rotate(-20 46 20)" />
      </>
    ),
  },
  "Theseus Group": {
    color: "var(--co-theseus)",
    label: "labyrinth",
    motif: (
      <>
        <path d="M8 8 H56 V56 H8 V16" {...stroke} />
        <path d="M16 16 H48 V48 H16 V24" {...stroke} />
        <path d="M24 24 H40 V40 H24 V32" {...stroke} />
        <circle cx="32" cy="32" r="2.5" fill="currentColor" />
      </>
    ),
  },
  "Vivid Insights": {
    color: "var(--co-vivid)",
    label: "conversations",
    motif: (
      <>
        <path d="M8 12 H40 V32 H20 L12 39 V32 H8 Z" {...stroke} />
        <path d="M26 30 H56 V48 H52 V55 L45 48 H26 Z" {...stroke} fill="currentColor" fillOpacity={0.18} />
        {[34, 41, 48].map((x, i) => (
          <circle key={x} cx={x} cy="39" r="2" fill="currentColor" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </>
    ),
  },
  "Spirit Hero": {
    color: "var(--spirit)",
    label: "spirit wear",
    motif: (
      <>
        <path d="M14 10 V56" {...stroke} />
        <path d="M14 12 L52 22 L14 32 Z" {...stroke} fill="currentColor" fillOpacity={0.25} />
        <path d="M27 16 l1.6 3.4 3.7.4-2.8 2.5.8 3.7-3.3-1.9-3.3 1.9.8-3.7-2.8-2.5 3.7-.4z" fill="var(--spirit-gold)" />
      </>
    ),
  },
};

export const teamColor = (company: string) => TEAMS[company]?.color ?? "var(--cyber)";
