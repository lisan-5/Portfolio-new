/**
 * Field reports — testimonials as a deck of field dispatches.
 *
 * Each report is a dispatch card filed from where the work happened, franked with a
 * postmark in that team's colour. The deck turns on its own (a progress bar in the index
 * shows when), pauses on hover, and can be turned by the index, the big prev/next
 * controls, the arrow keys, or by flicking the top card aside.
 */
import { motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useState, type KeyboardEvent } from "react";
import { testimonials, type Testimonial } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE, SheetHead } from "./shared";
import { teamColor } from "./teams";

const DWELL = 9; // seconds per report

const FILED_FROM: Record<string, { place: string; coords: string }> = {
  "Theseus Group": { place: "Los Angeles", coords: "34.05° N · 118.24° W" },
  "Addis Ababa University": { place: "Addis Ababa", coords: "9.03° N · 38.76° E" },
  "Ambalay Maps": { place: "Addis Ababa", coords: "9.01° N · 38.75° E" },
};
const filed = (t: Testimonial) => FILED_FROM[t.org] ?? { place: "Addis Ababa", coords: "9.03° N · 38.74° E" };
const ink = (t: Testimonial) => (t.org === "Addis Ababa University" ? "var(--cyber)" : teamColor(t.org));
const no = (n: number) => String(n + 1).padStart(2, "0");

export function Reports() {
  const n = testimonials.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (to: number, d?: number) => {
      const next = ((to % n) + n) % n;
      setDir(d ?? (next >= i ? 1 : -1));
      setI(next);
    },
    [i, n],
  );
  const next = () => go(i + 1, 1);
  const prev = () => go(i - 1, -1);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  return (
    <section id="reports" className="relative px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <SheetHead
          sheet="06"
          grid="G1"
          title="Field"
          italic="reports."
          aside="Dispatches filed by the people I've worked with. Flick through them — drag the top card, use the arrows, or pick one from the index."
        />

        <div
          className="grid gap-10 lg:grid-cols-12 lg:gap-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* index */}
          <ol className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-input" aria-label="Report index">
            {testimonials.map((t, j) => {
              const on = j === i;
              const f = filed(t);
              return (
                <li key={t.name} className="shrink-0 lg:border-b lg:border-input">
                  <button
                    type="button"
                    onClick={() => go(j)}
                    aria-current={on}
                    className={cn(
                      "group relative block w-[230px] border border-input px-4 py-4 text-left transition-colors lg:w-full lg:border-0 lg:px-2 lg:py-5",
                      on ? "bg-card/80" : "hover:bg-card/40",
                    )}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-map text-3xl leading-none transition-colors" style={{ color: on ? ink(t) : "var(--muted-foreground)" }}>
                        {no(j)}
                      </span>
                      <div className="min-w-0">
                        <div className={cn("truncate text-[15px]", on ? "text-foreground" : "text-slate-mid group-hover:text-foreground")}>{t.name}</div>
                        <div className="map-label mt-1 truncate text-[9px]">
                          {t.org} · {f.place}
                        </div>
                      </div>
                      <ArrowRight
                        className={cn("ml-auto h-4 w-4 shrink-0 transition-all", on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60")}
                        style={{ color: ink(t) }}
                      />
                    </div>
                    {/* dwell timer: when it fills, the next report is filed */}
                    <span className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden lg:inset-x-2">
                      {on && (
                        <span
                          key={i}
                          className="report-progress block h-full origin-left"
                          style={{ background: ink(t), animationDuration: `${DWELL}s`, animationPlayState: paused ? "paused" : "running" }}
                          onAnimationEnd={() => go(i + 1, 1)}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* deck */}
          <div className="lg:col-span-8">
            <div
              tabIndex={0}
              onKeyDown={onKey}
              role="region"
              aria-roledescription="carousel"
              aria-label={`Field report ${no(i)} of ${no(n - 1)}`}
              className="relative grid outline-none [perspective:1600px] focus-visible:ring-1 focus-visible:ring-cyber"
            >
              {testimonials.map((t, j) => {
                const depth = (j - i + n) % n; // 0 = top of the deck
                return <Dispatch key={t.name} t={t} index={j} depth={depth} dir={dir} onFlick={(d) => (d > 0 ? next() : prev())} />;
              })}
            </div>

            {/* controls */}
            <div className="mt-14 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous report"
                className="grid h-12 w-12 place-items-center border border-input bg-background/70 text-foreground transition-colors hover:border-cyber hover:text-cyber"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next report"
                className="grid h-12 w-12 place-items-center border border-cyber bg-cyber text-cyber-foreground transition-transform hover:-translate-y-0.5"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="ml-2 font-mono-tech text-[11px] tracking-[0.18em] text-muted-foreground">
                <span className="text-foreground">{no(i)}</span> / {no(n - 1)}
              </div>
              <div className="ml-auto hidden font-mono-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
                drag the card · ← → keys
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dispatch({ t, index, depth, dir, onFlick }: { t: Testimonial; index: number; depth: number; dir: number; onFlick: (d: number) => void }) {
  const top = depth === 0;
  const f = filed(t);
  const c = ink(t);
  const shown = Math.min(depth, 2);
  const words = t.quote.split(" ");

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onFlick(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <motion.article
      aria-hidden={!top}
      className={cn(
        "relative [grid-area:1/1] border bg-card p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-10",
        top ? "z-30 cursor-grab touch-pan-y active:cursor-grabbing" : depth === 1 ? "pointer-events-none z-20" : "pointer-events-none z-10",
      )}
      style={{ borderColor: top ? `color-mix(in srgb, ${c} 55%, transparent)` : "var(--input)" }}
      initial={false}
      animate={{
        y: shown * 22,
        x: shown * (dir > 0 ? 10 : -10),
        scale: 1 - shown * 0.045,
        rotate: top ? 0 : (index % 2 ? 1.6 : -1.8) * shown,
        opacity: depth > 2 ? 0 : 1 - shown * 0.28,
      }}
      transition={{ type: "spring", stiffness: 210, damping: 26 }}
      drag={top ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.55}
      whileDrag={{ rotate: 0, scale: 1.01 }}
      onDragEnd={onDragEnd}
    >
      {/* paper grain + ruled margin */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[54px] hidden w-px sm:block" style={{ background: `color-mix(in srgb, ${c} 30%, transparent)` }} />

      <header className="flex items-start justify-between gap-6 sm:pl-12">
        <div>
          <div className="map-label flex items-center gap-2 text-[9.5px]">
            <span style={{ color: c }}>◆</span> Field report Nº {no(index)}
          </div>
          <div className="mt-1.5 font-mono-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Filed from {f.place} · {f.coords}
          </div>
        </div>
        <Postmark org={t.org} n={no(index)} color={c} live={top} />
      </header>

      <blockquote key={top ? "on" : "off"} className="font-map relative mt-6 pl-7 text-[clamp(1.35rem,2.3vw,2.05rem)] leading-[1.28] text-foreground sm:pl-12">
          <span aria-hidden className="font-map absolute -top-1 left-0 text-[2.6em] leading-[0.9] sm:-left-1" style={{ color: c }}>
            “
          </span>
          {top
            ? words.map((w, k) => (
                <motion.span
                  key={k}
                  className="inline-block whitespace-pre"
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.15 + k * 0.018 }}
                >
                  {w}{" "}
                </motion.span>
              ))
            : t.quote}
        </blockquote>

      <footer className="mt-8 flex flex-wrap items-center gap-4 border-t border-dashed border-input pt-6 sm:pl-12">
        <span className="grid h-12 w-12 place-items-center rounded-full border-2 font-mono-tech text-sm" style={{ borderColor: c, color: c }}>
          {t.initials}
        </span>
        <div>
          <div className="font-map text-xl leading-tight text-foreground">{t.name}</div>
          <div className="text-[13px] text-slate-mid">
            {t.role} · {t.org}
          </div>
        </div>
        <a
          href={t.link.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={top ? 0 : -1}
          onPointerDownCapture={(e) => e.stopPropagation()}
          className="ml-auto inline-flex items-center gap-1 font-mono-tech text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.link.label} <ArrowUpRight className="h-3 w-3" />
        </a>
      </footer>
    </motion.article>
  );
}

/** A circular postmark with the org name around the rim; it thumps down when its card comes to the top. */
function Postmark({ org, n, color, live }: { org: string; n: string; color: string; live: boolean }) {
  const id = `pm-${n}`;
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
      style={{ color }}
      initial={false}
      animate={live ? { scale: [1.7, 0.94, 1], rotate: [-30, -10, -12], opacity: [0, 0.95, 0.85] } : { scale: 1, rotate: -12, opacity: 0.35 }}
      transition={live ? { duration: 0.55, times: [0, 0.7, 1], ease: "easeOut", delay: 0.25 } : { duration: 0.3 }}
      aria-hidden
    >
      <defs>
        <path id={id} d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
      </defs>
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2.5" />
      <text fontFamily="'JetBrains Mono', monospace" fontSize="9.5" letterSpacing="2.2" fill="currentColor">
        <textPath href={`#${id}`} startOffset="0">
          {`${org.toUpperCase()} · FIELD REPORT · `}
        </textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" fontFamily="'Instrument Serif', Georgia, serif" fontSize="22" fill="currentColor">
        Nº {n}
      </text>
      <text x="60" y="74" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="7.5" letterSpacing="2" fill="currentColor">
        RECEIVED
      </text>
      {/* cancellation waves */}
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M2 ${50 + k * 9} q 6 -4 12 0 t 12 0 t 12 0`} fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".55" />
      ))}
    </motion.svg>
  );
}
