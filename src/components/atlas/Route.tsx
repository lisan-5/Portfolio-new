/**
 * The route: experience as a GPS journey, oldest stop first. Each row draws its own
 * segment of the route as it scrolls into view; segments meet on the centre line so the
 * whole thing reads as one continuous road with waypoints. Cards read like turn-by-turn
 * directions.
 */
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { experiences } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE, Reveal, SheetHead } from "./shared";

type Exp = (typeof experiences)[number];

function months(period: string) {
  const [a, b] = period.split("-").map((s) => s.trim());
  const parse = (s: string) => {
    if (/present/i.test(s)) {
      const d = new Date();
      return d.getFullYear() * 12 + d.getMonth();
    }
    const [m, y] = s.split("/").map(Number);
    return y * 12 + (m - 1);
  };
  return Math.max(1, parse(b) - parse(a) + 1);
}
const fmtSpan = (n: number) => (n >= 12 ? `${Math.floor(n / 12)} yr ${n % 12 ? `${n % 12} mo` : ""}`.trim() : `${n} mo`);

export function Route() {
  const stops = [...experiences].reverse();
  const total = stops.reduce((s, e) => s + months(e.period), 0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const km = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section id="route" className="relative px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <SheetHead
          sheet="03"
          grid="D1–D6"
          title="The route"
          italic="so far."
          aside={
            <>
              {stops.length} stops, {fmtSpan(total)} on the road — geospatial backends, a national
              healthcare platform, freight routing, AI systems and now CTO at Spirit Hero. Scroll to drive it.
            </>
          }
        />

        <div ref={ref} className="relative">
          <Endpoint kind="depart" />
          {stops.map((e, i) => (
            <Leg key={`${e.company}-${e.role}`} exp={e} index={i} promoted={i > 0 && stops[i - 1].company === e.company} side={i % 2 ? "right" : "left"} />
          ))}
          <Endpoint kind="arrive" />

          {/* trip meter */}
          <motion.div
            aria-hidden
            className="pointer-events-none sticky bottom-8 z-10 mx-auto mt-6 hidden w-fit items-center gap-3 border border-border bg-background/80 px-3 py-1.5 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur md:flex"
          >
            trip
            <span className="relative block h-1 w-40 bg-border">
              <motion.span className="absolute inset-y-0 left-0 w-full origin-left bg-cyber" style={{ scaleX: km }} />
            </span>
            2022 → now
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Segment({ side }: { side: "left" | "right" }) {
  // centre line in, swing out to the waypoint, back to centre
  const bend = side === "left" ? 2 : 98;
  const d = `M50 0 C50 22, ${bend} 22, ${bend} 50 S50 78, 50 100`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <path d={d} fill="none" stroke="var(--contour-index)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeDasharray="2 6" />
      <motion.path
        d={d}
        fill="none"
        stroke="var(--cyber)"
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -35% 0px" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

function Leg({ exp: e, index, promoted, side }: { exp: Exp; index: number; promoted: boolean; side: "left" | "right" }) {
  const [more, setMore] = useState(false);
  const span = months(e.period);
  const present = /present/i.test(e.period);
  const spirit = present && e.company === "Spirit Hero";
  const turn = side === "left" ? "↰" : "↱";
  return (
    <div className="relative grid min-h-[340px] grid-cols-[48px_1fr] md:grid-cols-2 md:gap-32">
      {/* the road: a full-width segment on desktop, a straight line on phones */}
      <div className="absolute inset-y-0 left-1/2 hidden w-32 -translate-x-1/2 md:block">
        <Segment side={side} />
      </div>
      <div className="relative md:hidden">
        <span className="absolute inset-y-0 left-[23px] w-px bg-[var(--contour-index)]" />
      </div>

      <Reveal
        x={side === "left" ? -40 : 40}
        y={0}
        className={cn("relative py-10 md:py-16", side === "right" ? "md:col-start-2" : "md:col-start-1 md:row-start-1")}
      >
        {/* waypoint marker */}
        {spirit ? (
          <span
            className={cn(
              "absolute top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border-2 border-spirit-gold bg-spirit text-[15px] leading-none text-spirit-gold",
              "-left-[42px] md:left-auto",
              side === "left" ? "md:-right-[16px]" : "md:-left-[16px]",
            )}
          >
            <span className="absolute inset-0 animate-ping-ring rounded-full border border-spirit-gold" />★
          </span>
        ) : (
          <span
            className={cn(
              "absolute top-1/2 grid h-5 w-5 -translate-y-1/2 rotate-45 place-items-center border-2 border-cyber bg-background",
              "-left-[35px] md:left-auto",
              side === "left" ? "md:-right-[10px]" : "md:-left-[10px]",
            )}
          >
            <span className="h-1.5 w-1.5 bg-cyber" />
          </span>
        )}

        <article
          className={cn(
            "relative p-6 backdrop-blur-sm sm:p-7",
            spirit ? "border-2 border-spirit bg-spirit-deep/55" : "border border-input bg-card/70",
            side === "left" && "md:text-right",
          )}
        >
          {spirit && <SpiritDressing side={side} />}
          <div className={cn("map-label flex items-center gap-2", side === "left" && "md:justify-end")}>
            <span className={cn("text-base leading-none", spirit ? "text-spirit-gold" : "text-cyber")}>{turn}</span>
            waypoint {String(index + 1).padStart(2, "0")} · {e.period} · {fmtSpan(span)}
          </div>
          <p className="mt-3 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {index === 0 ? "Head out to" : promoted ? "Promoted at" : "Continue to"}
          </p>
          <h3 className="font-map text-[2.6rem] leading-[0.95] text-foreground">
            {e.href ? (
              <a href={e.href} target="_blank" rel="noopener noreferrer" className="underline-offset-[6px] hover:underline">
                {e.company}
              </a>
            ) : (
              e.company
            )}
          </h3>
          <p className={cn("mt-1 text-sm", spirit ? "text-spirit-gold" : "text-cyber")}>
            {e.role}
            {present && <span className="ml-2 font-mono-tech text-[10px] uppercase tracking-[0.16em]">· current position</span>}
          </p>
          <ul className={cn("mt-4 flex flex-wrap gap-1.5", side === "left" && "md:justify-end")}>
            {e.stack.map((s) => (
              <li key={s} className={cn("border px-2 py-0.5 font-mono-tech text-[9.5px] tracking-[0.12em] text-muted-foreground", spirit ? "border-spirit/70" : "border-border")}>
                {s}
              </li>
            ))}
          </ul>
          <ul className={cn("mt-5 space-y-2.5 text-left text-[14px] leading-relaxed text-slate-mid")}>
            {(more ? e.highlights : e.highlights.slice(0, 2)).map((h) => (
              <motion.li
                key={h}
                className="flex gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 bg-cyber" />
                {h}
              </motion.li>
            ))}
          </ul>
          {e.highlights.length > 2 && (
            <button
              type="button"
              onClick={() => setMore((m) => !m)}
              className="mt-4 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {more ? "fewer notes ↑" : `${e.highlights.length - 2} more notes ↓`}
            </button>
          )}
        </article>
      </Reveal>
    </div>
  );
}

function Endpoint({ kind }: { kind: "depart" | "arrive" }) {
  const depart = kind === "depart";
  return (
    <Reveal className="relative grid grid-cols-[48px_1fr] items-center py-6 md:flex md:flex-col md:items-center md:text-center">
      <span className="relative mx-auto grid h-9 w-9 place-items-center rounded-full border-2 border-cyber bg-background">
        {!depart && <span className="absolute inset-0 animate-ping-ring rounded-full border border-cyber" />}
        <span className={cn("h-3 w-3 rounded-full", depart ? "bg-foreground" : "bg-cyber")} />
      </span>
      <div className="md:mt-3">
        <div className="map-label">{depart ? "Depart · 2022" : "Arrive · now"}</div>
        <p className="font-map mt-1 text-2xl text-foreground">
          {depart ? "Addis Ababa University & A2SV" : "Chief Technology Officer · Spirit Hero"}
        </p>
        <p className="mt-1 font-mono-tech text-[11px] text-muted-foreground">
          {depart ? "BSc Computer Science · 1,000+ algorithmic challenges" : "Leading technology strategy, architecture and engineering"}
        </p>
      </div>
    </Reveal>
  );
}

/**
 * The current post, dressed as spirit wear: a stitched seam inside the card, a chenille
 * varsity patch, a pennant, and a little burst of stars when it scrolls into view.
 */
function SpiritDressing({ side }: { side: "left" | "right" }) {
  const outer = side === "left" ? "-left-6" : "-right-6";
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-1.5 border border-dashed border-spirit-gold/60" />

      {/* chenille patch */}
      <motion.svg
        aria-hidden
        viewBox="0 0 120 120"
        className={cn("pointer-events-none absolute -top-12 h-24 w-24 drop-shadow-xl", outer)}
        initial={{ scale: 0.4, rotate: side === "left" ? -30 : 30, opacity: 0 }}
        whileInView={{ scale: 1, rotate: side === "left" ? -9 : 9, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -25% 0px" }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.35 }}
      >
        <defs>
          <filter id="chenille" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
          </filter>
        </defs>
        <circle cx="60" cy="60" r="56" fill="var(--spirit-gold)" />
        <circle cx="60" cy="60" r="49" fill="var(--spirit)" filter="url(#chenille)" />
        <circle cx="60" cy="60" r="52.5" fill="none" stroke="var(--spirit-deep)" strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="var(--spirit-gold)" strokeWidth="1" strokeDasharray="2 3" opacity=".8" />
        <text x="60" y="71" textAnchor="middle" fontFamily="'Young Serif', Georgia, serif" fontSize="34" fill="var(--spirit-gold)" stroke="#fff" strokeOpacity=".9" strokeWidth="1.1" paintOrder="stroke">
          CTO
        </text>
        {[[33, 40], [87, 40]].map(([x, y]) => (
          <path key={x} d={starPath(x, y, 6)} fill="#fff" />
        ))}
        <text x="60" y="94" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="2" fill="#fff">
          EST · 2026
        </text>
      </motion.svg>

      {/* pennant */}
      <motion.svg
        aria-hidden
        viewBox="0 0 90 34"
        className={cn("pointer-events-none absolute -bottom-4 h-8 w-[84px]", side === "left" ? "left-5" : "right-5")}
        initial={{ x: side === "left" ? -14 : 14, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -25% 0px" }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
        style={{ transform: side === "right" ? "scaleX(-1)" : undefined }}
      >
        <path d="M2 2 L88 17 L2 32 Z" fill="var(--spirit)" stroke="var(--spirit-gold)" strokeWidth="1.5" />
        <path d="M2 2 L2 32" stroke="var(--spirit-gold)" strokeWidth="4" />
        <text
          x="34"
          y="21"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="9"
          letterSpacing="2"
          fill="var(--spirit-gold)"
          transform={side === "right" ? "translate(68 0) scale(-1 1)" : undefined}
        >
          NOW
        </text>
      </motion.svg>

      {/* star burst */}
      <span aria-hidden className={cn("pointer-events-none absolute -top-2 h-0 w-0", side === "left" ? "left-6" : "right-6")}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (-150 + i * 15) * (Math.PI / 180) * (side === "left" ? 1 : -1) + (side === "left" ? 0 : Math.PI);
          const d = 46 + (i % 3) * 18;
          return (
            <motion.span
              key={i}
              className={cn("absolute text-[11px] leading-none", i % 2 ? "text-spirit-gold" : "text-spirit")}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              whileInView={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: [0, 1, 0], scale: [0.4, 1.1, 0.8] }}
              viewport={{ once: true, margin: "0px 0px -25% 0px" }}
              transition={{ duration: 1.3, ease: "easeOut", delay: 0.45 + i * 0.03 }}
            >
              ★
            </motion.span>
          );
        })}
      </span>
    </>
  );
}

function starPath(cx: number, cy: number, r: number) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }
  return `${d}Z`;
}
