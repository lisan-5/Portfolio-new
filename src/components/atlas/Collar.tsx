/**
 * The map collar: everything printed around the edge of the sheet.
 * - TopBar: name, section links, résumé (a menu sheet on phones).
 * - Neatline: the thin frame with graticule ticks around the viewport.
 * - Readout: live latitude / longitude / elevation under the pointer.
 * - Locator: an inset map of the page — sections are places on a route, the current
 *   one lit up.
 */
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { topo } from "./TopoField";
import { EASE, HOME, RESUME_URL, SECTIONS, fmtLat, fmtLon } from "./shared";

function useActiveSection() {
  const [active, setActive] = useState<string>("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = SECTIONS.slice(1);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent",
        )}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-6 border-b border-border px-5 sm:px-10">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-map text-2xl leading-none text-foreground">L. Abay</span>
            <span className="map-label hidden sm:inline">atlas of work</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
            {links.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden border border-input px-3.5 py-1.5 font-mono-tech text-[10.5px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-cyber hover:text-cyber sm:inline-block"
            >
              Résumé ↗
            </a>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center border border-input lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open sections"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-background/95 px-6 py-6 backdrop-blur-lg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="map-label">Sections</span>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center border border-input"
                onClick={() => setOpen(false)}
                aria-label="Close sections"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2">
              {SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="font-map flex items-baseline gap-4 border-b border-border py-3 text-4xl text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, ease: EASE, duration: 0.5 }}
                >
                  <span className="font-mono-tech text-[11px] text-cyber">0{i + 1}</span>
                  {s.label}
                </motion.a>
              ))}
            </nav>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto bg-cyber py-4 text-center font-mono-tech text-xs uppercase tracking-[0.18em] text-cyber-foreground"
            >
              Résumé ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Thin frame with graticule ticks — the whole site is one map sheet. */
export function Neatline() {
  const ticks = Array.from({ length: 13 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-2 z-40 hidden border border-border md:block">
      {ticks.map((i) => (
        <span
          key={`t${i}`}
          className="absolute top-0 h-2 w-px bg-foreground/30"
          style={{ left: `${(i / 12) * 100}%` }}
        />
      ))}
      {ticks.map((i) => (
        <span
          key={`l${i}`}
          className="absolute left-0 h-px w-2 bg-foreground/30"
          style={{ top: `${(i / 12) * 100}%` }}
        />
      ))}
      <span className="map-label absolute -top-[3px] left-1/2 -translate-x-1/2 bg-background px-2 text-[8.5px]">
        38°44′E
      </span>
      <span className="map-label absolute -left-[3px] top-1/2 origin-left -translate-y-1/2 -rotate-90 bg-background px-2 text-[8.5px]">
        9°02′N
      </span>
    </div>
  );
}

/** Live coordinates and elevation under the pointer. */
export function Readout() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      const el = ref.current;
      if (el) {
        const k = 0.00011;
        const lat = HOME.lat + (innerHeight / 2 - (y + window.scrollY * 0.55)) * k;
        const lon = HOME.lon + (x - innerWidth / 2) * k;
        const elev = Math.round(HOME.elev + (topo.heightAt(x, y) - 0.5) * 900);
        el.textContent = `LAT ${fmtLat(lat)}   LON ${fmtLon(lon)}   ELEV ${elev.toLocaleString()} m`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-[72px] z-40 hidden -translate-x-1/2 whitespace-pre bg-background/70 px-3 py-1 font-mono-tech backdrop-blur-sm text-[10px] tracking-[0.12em] text-muted-foreground [@media(pointer:fine)]:md:block"
    />
  );
}

/** Inset locator map: the page as a route, current section lit. */
export function Locator() {
  const active = useActiveSection();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <nav
      aria-label="Page locator"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1680px]:block"
    >
      <div className="relative border border-border bg-background/70 py-4 pl-4 pr-5 backdrop-blur-sm">
        <div className="map-label mb-3 text-[8.5px]">Locator</div>
        <div className="absolute bottom-4 left-[21px] top-10 w-px bg-border">
          <motion.div className="absolute inset-x-0 top-0 origin-top bg-cyber" style={{ scaleY: progress, height: "100%" }} />
        </div>
        <ul className="relative space-y-3">
          {SECTIONS.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group flex items-center gap-3">
                  <span
                    className={cn(
                      "relative h-[11px] w-[11px] rotate-45 border transition-colors",
                      on ? "border-cyber bg-cyber" : "border-muted-foreground bg-background",
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono-tech text-[10px] uppercase tracking-[0.14em] transition-colors",
                      on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
