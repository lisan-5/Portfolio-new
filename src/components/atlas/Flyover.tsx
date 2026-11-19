/**
 * Flyover — "from Addis to the world". A pinned scroll scene between the hero and the
 * projects: the live terrain zooms out (the shader's zoom is driven from here), the map
 * scale climbs from 1:25 000 to 1:50 000 000, and a wireframe survey globe rises and
 * turns from Addis Ababa toward the Americas while great-circle routes draw out to the
 * teams Lisan has shipped for remotely.
 */
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { experiences, projects } from "@/data/portfolio";
import { topo } from "./TopoField";
import { EASE, HOME } from "./shared";

type Pin = { name: string; lat: number; lon: number; note: string };
const ORIGIN: Pin = { name: "Addis Ababa", lat: HOME.lat, lon: HOME.lon, note: "home desk" };
const PINS: Pin[] = [
  { name: "Los Angeles", lat: 34.05, lon: -118.24, note: "Theseus Group" },
  { name: "Wilmington", lat: 39.74, lon: -75.55, note: "Spotter AI" },
];

const rad = Math.PI / 180;
const toVec = (lat: number, lon: number) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];
const toLatLon = (v: number[]) => [Math.asin(Math.max(-1, Math.min(1, v[2]))) / rad, Math.atan2(v[1], v[0]) / rad];
function slerp(a: number[], b: number[], t: number) {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-6) return a;
  const s = Math.sin(om);
  const ka = Math.sin((1 - t) * om) / s;
  const kb = Math.sin(t * om) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

const SCALES = [25_000, 250_000, 2_500_000, 50_000_000];
const fmtScale = (n: number) => `1 : ${Math.round(n).toLocaleString("en-US").replace(/,/g, " ")}`;

const CAPTIONS = [
  { at: 0, k: "i", text: <>Every landmark on this map was built from <em className="text-cyber">one desk</em> in Addis Ababa.</> },
  { at: 0.34, k: "ii", text: <>Zoom out, and the routes run <em className="text-cyber">across time zones.</em></> },
  { at: 0.66, k: "iii", text: <>Remote-first: shipping for teams in <em className="text-cyber">Los Angeles</em> and <em className="text-cyber">Wilmington</em> from UTC+3.</> },
];

export function Flyover() {
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, 0.25, 0.45, 0.7], SCALES);
  const [scaleText, setScaleText] = useState(fmtScale(SCALES[0]));
  const [caption, setCaption] = useState(0);
  useMotionValueEvent(scale, "change", (v) => setScaleText(fmtScale(v)));
  useMotionValueEvent(p, "change", (v) => {
    setCaption(v >= CAPTIONS[2].at ? 2 : v >= CAPTIONS[1].at ? 1 : 0);
    // drive the terrain: zoom out over the first half of the scene
    topo.zoom = 1 + Math.min(1, Math.max(0, v / 0.5)) ** 1.6 * 7;
  });
  useEffect(() => () => void (topo.zoom = 1), []);

  const remote = experiences.filter((e) => !/haddis|brana|ambalay/i.test(e.company)).length;

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const css = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        fg: s.getPropertyValue("--foreground").trim(),
        line: s.getPropertyValue("--contour-index").trim(),
        accent: s.getPropertyValue("--accent").trim(),
        water: s.getPropertyValue("--water").trim(),
        bg: s.getPropertyValue("--background").trim(),
      };
    };
    let col = css();
    const mo = new MutationObserver(() => (col = css()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let raf = 0;
    const draw = (now: number) => {
      const v = p.get();
      const appear = Math.min(1, Math.max(0, (v - 0.18) / 0.3));
      ctx.clearRect(0, 0, w, h);
      if (appear > 0) {
        const ease = 1 - (1 - appear) ** 3;
        const R = Math.min(w, h) * 0.36 * (0.55 + 0.45 * ease);
        const cx = w / 2;
        const cy = h / 2 + (1 - ease) * h * 0.25;
        const turn = Math.min(1, Math.max(0, (v - 0.3) / 0.5));
        const lam0 = (HOME.lon + (-62 - HOME.lon) * (1 - (1 - turn) ** 2) + Math.sin(now / 4000) * 2) * rad;
        const phi0 = (12 + 14 * turn) * rad;
        const project = (lat: number, lon: number) => {
          const phi = lat * rad;
          const lam = lon * rad;
          const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam - lam0);
          return {
            x: cx + R * Math.cos(phi) * Math.sin(lam - lam0),
            y: cy - R * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam - lam0)),
            vis: cosc > 0,
          };
        };
        const path = (pts: { x: number; y: number; vis: boolean }[]) => {
          ctx.beginPath();
          let pen = false;
          for (const q of pts) {
            if (!q.vis) {
              pen = false;
              continue;
            }
            if (pen) ctx.lineTo(q.x, q.y);
            else ctx.moveTo(q.x, q.y);
            pen = true;
          }
          ctx.stroke();
        };

        ctx.globalAlpha = ease;
        // horizon glow
        const g = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.35);
        g.addColorStop(0, "transparent");
        g.addColorStop(0.3, col.water + "33");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);
        // disc
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = col.bg + "e6";
        ctx.fill();
        ctx.strokeStyle = col.fg;
        ctx.globalAlpha = ease * 0.55;
        ctx.lineWidth = 1;
        ctx.stroke();

        // graticule
        ctx.strokeStyle = col.line;
        ctx.lineWidth = 0.8;
        for (let lat = -75; lat <= 75; lat += 15) {
          ctx.globalAlpha = ease * (lat === 0 ? 0.9 : 0.45);
          path(Array.from({ length: 121 }, (_, i) => project(lat, -180 + i * 3)));
        }
        for (let lon = -180; lon < 180; lon += 15) {
          ctx.globalAlpha = ease * 0.45;
          path(Array.from({ length: 61 }, (_, i) => project(-90 + i * 3, lon)));
        }

        // routes
        const reveal = Math.min(1, Math.max(0, (v - 0.45) / 0.22));
        const o = toVec(ORIGIN.lat, ORIGIN.lon);
        PINS.forEach((pin, k) => {
          const t = Math.min(1, Math.max(0, reveal * 1.4 - k * 0.4));
          if (t <= 0) return;
          const b = toVec(pin.lat, pin.lon);
          const pts = Array.from({ length: 80 }, (_, i) => {
            const s = (i / 79) * t;
            const [la, lo] = toLatLon(slerp(o, b, s));
            return project(la, lo);
          });
          ctx.globalAlpha = ease;
          ctx.strokeStyle = col.accent;
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          path(pts);
          const head = pts[pts.length - 1];
          if (head.vis) {
            ctx.fillStyle = col.accent;
            ctx.beginPath();
            ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          if (t > 0.99) {
            const q = project(pin.lat, pin.lon);
            if (q.vis) {
              ctx.font = "11px 'JetBrains Mono', monospace";
              ctx.fillStyle = col.fg;
              ctx.fillText(pin.name.toUpperCase(), q.x + 10, q.y - 4);
              ctx.fillStyle = col.accent;
              ctx.fillText(pin.note, q.x + 10, q.y + 10);
            }
          }
        });

        // origin
        const home = project(ORIGIN.lat, ORIGIN.lon);
        if (home.vis) {
          const pulse = (now / 1400) % 1;
          ctx.globalAlpha = ease * (1 - pulse);
          ctx.strokeStyle = col.accent;
          ctx.beginPath();
          ctx.arc(home.x, home.y, 4 + pulse * 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = ease;
          ctx.fillStyle = col.accent;
          ctx.beginPath();
          ctx.arc(home.x, home.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = "11px 'JetBrains Mono', monospace";
          ctx.fillStyle = col.fg;
          ctx.fillText("ADDIS ABABA", home.x + 10, home.y - 4);
          ctx.fillStyle = col.accent;
          ctx.fillText("you are here", home.x + 10, home.y + 10);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [p]);

  return (
    <section ref={ref} aria-label="From Addis Ababa to the world" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pb-10 pt-24 sm:px-10 lg:px-20">
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between">
          <span className="map-label">
            <span className="text-cyber">◆</span> Interlude · zooming out
          </span>
          <span className="font-mono-tech text-[11px] tracking-[0.14em] text-foreground">{scaleText}</span>
        </div>

        <div className="relative mx-auto mt-auto w-full max-w-7xl">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={caption}
                className="font-map text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.04] text-foreground"
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <span className="mr-3 font-mono-tech text-[11px] align-middle tracking-[0.2em] text-muted-foreground">
                  {CAPTIONS[caption].k}.
                </span>
                {CAPTIONS[caption].text}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {caption === 2 && (
              <motion.dl
                className="mt-8 grid max-w-xl grid-cols-3 gap-px border border-border bg-border"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              >
                {[
                  [projects.length, "landmarks"],
                  [experiences.length, "teams"],
                  [remote, "remote, abroad"],
                ].map(([n, label]) => (
                  <div key={label} className="bg-background/85 p-4 backdrop-blur-sm">
                    <dt className="map-label text-[9px]">{label}</dt>
                    <dd className="font-map mt-1 text-4xl text-foreground">{n}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
