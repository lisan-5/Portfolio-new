/**
 * Base camp. The hero is set as a map sheet: the name engraved along a curve like a
 * region label, "Abay" lettered along a river (it is the Ethiopian name of the Blue
 * Nile), a pulsing "you are here" marker at Addis Ababa, a compass that leans toward
 * the pointer and a cartouche with the scale bar.
 */
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { projects } from "@/data/portfolio";
import { EASE, HOME, RESUME_URL, SOCIALS, fmtLat, fmtLon } from "./shared";

const NAME = "LISANEGEBRIEL";
const NAME_PATH = "M 20 210 C 300 120, 640 110, 1180 175";
const RIVER_PATH =
  "M -40 120 C 120 60, 220 150, 380 110 S 640 30, 800 95 S 1060 160, 1240 70";

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rot = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 60, damping: 14 });
  const tilt = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 60, damping: 14 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / innerWidth) * 2 - 1);
      my.set((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-24 pt-24 sm:px-10 lg:px-20">
      {/* compass rose */}
      <motion.div
        aria-hidden
        className="absolute right-6 top-24 hidden h-28 w-28 sm:block lg:right-20 lg:top-28 lg:h-36 lg:w-36"
        style={{ rotate: rot, rotateX: tilt }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 1.2 }}
      >
        <Compass />
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          className="map-label flex flex-wrap items-center gap-x-4 gap-y-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span>Sheet 01</span>
          <span className="h-px w-8 bg-border" />
          <span>Addis Ababa, Ethiopia</span>
          <span className="h-px w-8 bg-border" />
          <span>1 : 25 000</span>
        </motion.div>

        {/* the name, engraved along a curve */}
        <h1 className="sr-only">Lisanegebriel Abay — Full-Stack & AI Engineer</h1>
        <div className="relative -mx-2 mt-6 sm:mt-2" aria-hidden>
          <svg viewBox="0 0 1200 260" className="w-full overflow-visible">
            <path id="name-curve" d={NAME_PATH} fill="none" />
            <motion.text
              className="font-map fill-foreground"
              style={{ fontSize: 124 }}
              textLength={1150}
              lengthAdjust="spacing"
              initial={{ opacity: 0, strokeDashoffset: 900 }}
              animate={{ opacity: 1, strokeDashoffset: 0 }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.3 }}
              stroke="currentColor"
              strokeWidth={0.6}
              strokeDasharray="900"
            >
              <textPath href="#name-curve" startOffset="0">
                {NAME}
              </textPath>
            </motion.text>
          </svg>

          {/* you are here — at the start of the name */}
          <motion.div
            className="absolute left-[2%] top-[78%] flex items-center gap-3 sm:top-[80%]"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.6 }}
          >
            <span className="relative grid h-4 w-4 place-items-center">
              <span className="absolute inset-0 animate-ping-ring rounded-full border border-cyber" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyber shadow-[0_0_14px_var(--color-cyber)]" />
            </span>
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-slate-mid">
              you are here
              <span className="hidden sm:inline">
                {" "}
                · {fmtLat(HOME.lat)} {fmtLon(HOME.lon)} · {HOME.elev.toLocaleString()} m
              </span>
            </span>
          </motion.div>
        </div>

        {/* the river Abay */}
        <div className="relative -mx-5 -mt-2 sm:-mx-10 lg:-mx-20" aria-hidden>
          <svg viewBox="0 0 1200 180" className="h-24 w-full overflow-visible sm:h-32" preserveAspectRatio="none">
            <motion.path
              d={RIVER_PATH}
              fill="none"
              stroke="var(--water)"
              strokeWidth={10}
              strokeOpacity={0.14}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.4, ease: EASE, delay: 0.9 }}
            />
            <motion.path
              d={RIVER_PATH}
              fill="none"
              stroke="var(--water)"
              strokeWidth={1.6}
              strokeDasharray="10 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, strokeDashoffset: [0, -170] }}
              transition={{
                pathLength: { duration: 2.4, ease: EASE, delay: 0.9 },
                strokeDashoffset: { duration: 6, repeat: Infinity, ease: "linear" },
              }}
            />
            <path id="river-curve" d={RIVER_PATH} fill="none" />
            <motion.text
              fill="var(--water)"
              className="font-map italic"
              style={{ fontSize: 44, letterSpacing: "0.35em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 2 }}
              dy={-14}
            >
              <textPath href="#river-curve" startOffset="47%">
                Abay
              </textPath>
            </motion.text>
          </svg>
        </div>

        <div className="mt-2 grid gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.4 }}
          >
            <p className="font-map text-[clamp(1.8rem,3.4vw,2.9rem)] leading-[1.04] text-foreground">
              Full-stack <em className="text-cyber">&amp;</em> AI engineer,
              <br className="hidden sm:block" /> charting backend systems,
              <br className="hidden sm:block" /> LLM products and the occasional map.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#landmarks"
                className="group inline-flex items-center gap-2 bg-cyber px-6 py-3.5 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.18em] text-cyber-foreground transition-transform hover:-translate-y-0.5"
              >
                Explore the work
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-input px-6 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground"
              >
                Résumé
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="underline-offset-4 transition-colors hover:text-cyber hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="lg:col-span-4 lg:col-start-9"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.7 }}
          >
            <Cartouche />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Cartouche() {
  return (
    <div className="border border-input bg-background/70 p-5 backdrop-blur-sm">
      <div className="map-label">Atlas of work · Vol. {new Date().getFullYear()}</div>
      <div className="font-map mt-2 text-3xl leading-none text-foreground">Lisanegebriel Abay</div>
      <div className="mt-1 text-sm text-slate-mid">Full-Stack &amp; AI Engineer</div>
      <dl className="mt-4 grid grid-cols-2 gap-y-1.5 font-mono-tech text-[10.5px] text-muted-foreground">
        <dt>Surveyed</dt>
        <dd className="text-right text-foreground">2022 — present</dd>
        <dt>Landmarks</dt>
        <dd className="text-right text-foreground">{projects.length} projects</dd>
        <dt>Contour interval</dt>
        <dd className="text-right text-foreground">20 m</dd>
        <dt>Status</dt>
        <dd className="text-right text-cyber">open to work</dd>
      </dl>
      {/* scale bar */}
      <div className="mt-4">
        <div className="flex h-1.5 border border-foreground/60">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i % 2 ? "flex-1" : "flex-1 bg-foreground/70"} />
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono-tech text-[9px] text-muted-foreground">
          <span>0</span>
          <span>500 m</span>
          <span>1 km</span>
        </div>
      </div>
    </div>
  );
}

function Compass() {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full text-foreground">
      <circle r="54" fill="none" stroke="currentColor" strokeOpacity="0.25" />
      <circle r="44" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="1 3" />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const long = i % 9 === 0;
        return (
          <line
            key={i}
            x1={Math.sin(a) * 54}
            y1={-Math.cos(a) * 54}
            x2={Math.sin(a) * (long ? 46 : 50)}
            y2={-Math.cos(a) * (long ? 46 : 50)}
            stroke="currentColor"
            strokeOpacity={long ? 0.6 : 0.25}
          />
        );
      })}
      <path d="M0 -40 L7 0 L0 6 L-7 0 Z" fill="var(--color-cyber)" />
      <path d="M0 40 L7 0 L0 -6 L-7 0 Z" fill="currentColor" fillOpacity="0.35" />
      <path d="M-40 0 L0 -4 L0 4 Z M40 0 L0 -4 L0 4 Z" fill="currentColor" fillOpacity="0.25" />
      <text y="-46" textAnchor="middle" className="font-map" fontSize="14" fill="currentColor" dy="-4">
        N
      </text>
    </svg>
  );
}
