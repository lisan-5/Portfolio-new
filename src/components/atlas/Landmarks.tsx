/**
 * Landmarks: the projects, surveyed. Vigil is the featured sheet; the rest are map
 * sheets in duotone that develop into colour on hover. Opening one morphs the card
 * into a full survey record (shared-layout animation).
 */
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE, Reveal, SheetHead } from "./shared";

type Project = (typeof projects)[number];

const gridRef = (i: number) => `${String.fromCharCode(65 + (i % 6))}${Math.floor(i / 6) + 1}`;
const repoOf = (p: Project) => ("repo" in p ? (p.repo as string) : undefined);
const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export function Landmarks() {
  const [featured, ...rest] = projects;
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <section id="landmarks" className="relative px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <SheetHead
          sheet="02"
          grid="A1–C3"
          title="Landmarks"
          italic="surveyed."
          aside={
            <>
              {projects.length} things I have built and shipped — from a national healthcare platform to
              freight routing and real-time observability. Start with the newest survey.
            </>
          }
        />
        <LayoutGroup>
          <Featured project={featured} onOpen={() => setOpen(featured)} />
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.08} y={40}>
                <SheetCard project={p} index={i + 1} onOpen={() => setOpen(p)} />
              </Reveal>
            ))}
          </ul>
          <AnimatePresence>
            {open && <Record project={open} index={projects.indexOf(open)} onClose={() => setOpen(null)} />}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

function Featured({ project: p, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const repo = repoOf(p);
  return (
    <Reveal y={60}>
      <div ref={ref} className="group relative grid border border-input bg-card/60 backdrop-blur-sm lg:grid-cols-12">
        {/* frame ticks */}
        <Ticks />
        <button
          type="button"
          onClick={onOpen}
          className="relative overflow-hidden lg:col-span-8"
          aria-label={`Open ${p.title}`}
        >
          <motion.div layoutId={`img-${p.title}`} className="aspect-[16/10] overflow-hidden">
            <motion.img
              src={p.image}
              alt={`${titleCase(p.title)} screenshot`}
              style={{ y, scale: 1.14 }}
              className="h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-125"
              loading="lazy"
            />
          </motion.div>
          <span className="absolute left-4 top-4 bg-background/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-cyber backdrop-blur">
            ◆ newest survey · {p.metric}
          </span>
        </button>
        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-4">
          <div>
            <div className="map-label">Sheet 01 · grid A1</div>
            <h3 className="font-map mt-3 text-6xl leading-none text-foreground sm:text-7xl">
              {titleCase(p.title)}
            </h3>
            <p className="mt-3 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-cyber">{p.subtitle}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-slate-mid">{p.challenge}</p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="border border-border px-2 py-1 font-mono-tech text-[9.5px] tracking-[0.12em] text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cyber px-4 py-2.5 font-mono-tech text-[10.5px] uppercase tracking-[0.16em] text-cyber-foreground"
              >
                Visit site <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-input px-4 py-2.5 font-mono-tech text-[10.5px] uppercase tracking-[0.16em] text-foreground hover:border-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
              <button
                type="button"
                onClick={onOpen}
                className="px-2 font-mono-tech text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Full record →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function SheetCard({ project: p, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full border border-input bg-card/50 text-left backdrop-blur-sm transition-colors hover:border-cyber"
    >
      <motion.div layoutId={`img-${p.title}`} className="relative aspect-[16/10] overflow-hidden border-b border-input">
        {"image" in p && p.image ? (
          <>
            <img
              src={p.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:contrast-100"
            />
            <span className="absolute inset-0 bg-[var(--contour-index)] mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
          </>
        ) : (
          <ContourPlaceholder seed={index} />
        )}
        <span className="absolute left-3 top-3 bg-background/85 px-2 py-0.5 font-mono-tech text-[9.5px] tracking-[0.18em] text-muted-foreground backdrop-blur">
          {gridRef(index)}
        </span>
      </motion.div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-map text-3xl leading-none text-foreground">{titleCase(p.title)}</h3>
          <span className="font-mono-tech text-[10px] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-2 line-clamp-1 font-mono-tech text-[10px] uppercase tracking-[0.14em] text-cyber">{p.metric}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-mid">{p.challenge}</p>
        <span className="mt-4 inline-flex items-center gap-1 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-foreground">
          Open record <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

function Record({ project: p, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  const repo = repoOf(p);
  const rows: [string, string][] = [
    ["Challenge", p.challenge],
    ["Approach", p.solution],
    ["Outcome", p.outcome],
    ["Details", p.details],
  ];
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-md sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${titleCase(p.title)} details`}
    >
      <motion.article
        className="relative w-full max-w-5xl border border-input bg-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Ticks />
        <motion.div layoutId={`img-${p.title}`} className="relative aspect-[16/8] overflow-hidden border-b border-input">
          {"image" in p && p.image ? (
            <img src={p.image} alt={`${titleCase(p.title)} screenshot`} className="h-full w-full object-cover" />
          ) : (
            <ContourPlaceholder seed={index} />
          )}
        </motion.div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center border border-input bg-background/85 backdrop-blur"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="map-label">
              Sheet {String(index + 1).padStart(2, "0")} · grid {gridRef(index)}
            </div>
            <h3 className="font-map mt-3 text-6xl leading-[0.95] text-foreground">{titleCase(p.title)}</h3>
            <p className="mt-3 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-cyber">{p.subtitle}</p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="border border-border px-2 py-1 font-mono-tech text-[9.5px] tracking-[0.12em] text-muted-foreground">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cyber px-4 py-2.5 font-mono-tech text-[10.5px] uppercase tracking-[0.16em] text-cyber-foreground"
              >
                Visit <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-input px-4 py-2.5 font-mono-tech text-[10.5px] uppercase tracking-[0.16em]"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          </div>
          <dl className="space-y-6 lg:col-span-7">
            {rows.map(([k, v], i) => (
              <motion.div
                key={k}
                className="grid gap-1 border-t border-border pt-4 sm:grid-cols-[110px_1fr]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, ease: EASE, duration: 0.5 }}
              >
                <dt className="map-label pt-1">{k}</dt>
                <dd className="text-[15px] leading-relaxed text-slate-mid">{v}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.article>
    </motion.div>
  );
}

/** Corner registration ticks, like the trim marks on a printed sheet. */
function Ticks() {
  const c = "pointer-events-none absolute z-10 h-3 w-3 border-cyber";
  return (
    <>
      <span className={cn(c, "-left-px -top-px border-l-2 border-t-2")} />
      <span className={cn(c, "-right-px -top-px border-r-2 border-t-2")} />
      <span className={cn(c, "-bottom-px -left-px border-b-2 border-l-2")} />
      <span className={cn(c, "-bottom-px -right-px border-b-2 border-r-2")} />
    </>
  );
}

/** For projects without a screenshot: a little contour study. */
function ContourPlaceholder({ seed }: { seed: number }) {
  const rings = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full bg-card" aria-hidden>
      {rings.map((i) => (
        <ellipse
          key={i}
          cx={160 + Math.sin(seed + i * 0.6) * 18}
          cy={100 + Math.cos(seed * 1.3 + i * 0.5) * 10}
          rx={20 + i * 18}
          ry={12 + i * 11}
          fill="none"
          stroke={i % 5 === 0 ? "var(--contour-index)" : "var(--contour)"}
          strokeWidth={i % 5 === 0 ? 1.6 : 1}
          transform={`rotate(${seed * 17 + i * 3} 160 100)`}
        />
      ))}
      <circle cx="160" cy="100" r="3" fill="var(--cyber)" />
    </svg>
  );
}
