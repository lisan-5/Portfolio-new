/**
 * Flyover — "from Addis to the world". A pinned scroll scene between the hero and the
 * projects: the live terrain zooms out (the shader's zoom is driven from here), the map
 * scale climbs from 1:25 000 to 1:50 000 000, and a survey globe rises with real
 * coastlines and turns from Addis Ababa toward the Americas while great-circle routes draw
 * out to every team Lisan has worked with.
 *
 * Once the routes are drawn the globe is live: drag to spin it, hover or tap a pin for the
 * company and role, or pick a stop from the list to fly there. The current post — CTO at
 * Spirit Hero — gets its own spirit-wear treatment: a pennant pin, a stitched route in
 * varsity purple and gold.
 */
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import countriesUrl from "world-atlas/countries-110m.json?url";
import { experiences, projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { topo } from "./TopoField";
import { EASE, HOME } from "./shared";

type Exp = (typeof experiences)[number];
type Site = {
  id: string;
  place: string;
  lat: number;
  lon: number;
  label: Label;
  companies: { company: string; roles: Exp[] }[];
  current: boolean;
  spirit: boolean;
};

/** Where each team sits on the globe. The Addis teams share the home pin. */
type Label = "right" | "left" | "below" | "above";
const PLACES: Record<string, { place: string; lat: number; lon: number; label: Label }> = {
  "Spirit Hero": { place: "United States", lat: 38.5, lon: -97, label: "above" },
  "Theseus Group": { place: "Los Angeles", lat: 34.05, lon: -118.24, label: "left" },
  "Spotter AI": { place: "Wilmington", lat: 39.74, lon: -75.55, label: "below" },
};
const HOME_PLACE = { place: "Addis Ababa", lat: HOME.lat, lon: HOME.lon, label: "right" as Label };

function buildSites(): Site[] {
  const byPlace = new Map<string, Site>();
  for (const e of experiences) {
    const loc = PLACES[e.company] ?? HOME_PLACE;
    let site = byPlace.get(loc.place);
    if (!site) {
      site = { id: loc.place, ...loc, companies: [], current: false, spirit: false };
      byPlace.set(loc.place, site);
    }
    let entry = site.companies.find((c) => c.company === e.company);
    if (!entry) site.companies.push((entry = { company: e.company, roles: [] }));
    entry.roles.push(e);
    if (/present/i.test(e.period)) site.current = true;
    if (e.company === "Spirit Hero") site.spirit = true;
  }
  return [...byPlace.values()];
}

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
const wrapLon = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

const SCALES = [25_000, 250_000, 2_500_000, 50_000_000];
const fmtScale = (n: number) => `1 : ${Math.round(n).toLocaleString("en-US").replace(/,/g, " ")}`;
const LIVE_AT = 0.66;

const CAPTIONS = [
  { at: 0, k: "i", text: <>Every landmark on this map was built from <em className="text-cyber">one desk</em> in Addis Ababa.</> },
  { at: 0.34, k: "ii", text: <>Zoom out, and the routes run <em className="text-cyber">across time zones.</em></> },
  {
    at: LIVE_AT,
    k: "iii",
    text: (
      <>
        Remote-first from UTC+3 — and now leading engineering as <em className="text-spirit-gold">CTO at Spirit Hero.</em>
      </>
    ),
  },
];

type Lines = number[][][];

export function Flyover() {
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, 0.25, 0.45, 0.7], SCALES);
  const [scaleText, setScaleText] = useState(fmtScale(SCALES[0]));
  const [caption, setCaption] = useState(0);
  const sites = useMemo(buildSites, []);
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const live = caption === 2;

  // state the canvas loop reads without re-subscribing
  const ui = useRef({ hover: null as string | null, focus: null as string | null, live: false });
  ui.current = { hover, focus, live };

  useMotionValueEvent(scale, "change", (v) => setScaleText(fmtScale(v)));
  useMotionValueEvent(p, "change", (v) => {
    setCaption(v >= CAPTIONS[2].at ? 2 : v >= CAPTIONS[1].at ? 1 : 0);
    // drive the terrain: zoom out over the first half of the scene
    topo.zoom = 1 + Math.min(1, Math.max(0, v / 0.5)) ** 1.6 * 7;
  });
  useEffect(() => () => void (topo.zoom = 1), []);
  useEffect(() => {
    if (!live) {
      setHover(null);
      setFocus(null);
    }
  }, [live]);

  const teams = new Set(experiences.map((e) => e.company)).size;
  const remote = new Set(experiences.filter((e) => PLACES[e.company]).map((e) => e.company)).size;

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
      const v = (k: string) => s.getPropertyValue(k).trim();
      return {
        fg: v("--foreground"),
        muted: v("--muted-foreground"),
        line: v("--contour-index"),
        accent: v("--accent"),
        water: v("--water"),
        bg: v("--background"),
        spirit: v("--spirit"),
        gold: v("--spirit-gold"),
      };
    };
    let col = css();
    const mo = new MutationObserver(() => (col = css()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // coastlines + borders, loaded after first paint and never blocking it
    let coast: Lines = [];
    let borders: Lines = [];
    let dead = false;
    (async () => {
      try {
        const [{ mesh }, res] = await Promise.all([import("topojson-client"), fetch(countriesUrl)]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const world = (await res.json()) as any;
        if (dead) return;
        coast = mesh(world, world.objects.countries, (a: unknown, b: unknown) => a === b).coordinates as Lines;
        borders = mesh(world, world.objects.countries, (a: unknown, b: unknown) => a !== b).coordinates as Lines;
      } catch {
        /* graticule-only globe is a fine fallback */
      }
    })();

    // view: where the globe is looking, eased toward a target every frame
    const view = { lon: HOME.lon, lat: 12 };
    const drag = { on: false, x: 0, y: 0, dLon: 0, dLat: 0 };
    let pinsOnScreen: { id: string; x: number; y: number; vis: boolean }[] = [];
    let globe = { cx: 0, cy: 0, R: 0 };

    const onDown = (e: PointerEvent) => {
      if (!ui.current.live) return;
      drag.on = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      c.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!ui.current.live) return;
      const r = c.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      if (drag.on) {
        const k = 90 / Math.max(120, globe.R);
        drag.dLon -= (e.clientX - drag.x) * k;
        drag.dLat = Math.max(-50, Math.min(50, drag.dLat + (e.clientY - drag.y) * k));
        drag.x = e.clientX;
        drag.y = e.clientY;
        return;
      }
      let best: string | null = null;
      let bestD = 22;
      for (const q of pinsOnScreen) {
        if (!q.vis) continue;
        const d = Math.hypot(q.x - mx, q.y - my);
        if (d < bestD) {
          bestD = d;
          best = q.id;
        }
      }
      c.style.cursor = best ? "pointer" : "grab";
      if (best !== ui.current.hover) setHover(best);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.on) return;
      drag.on = false;
      c.releasePointerCapture(e.pointerId);
      // a tap on a pin focuses it (touch has no hover)
      const r = c.getBoundingClientRect();
      const hit = pinsOnScreen.find((q) => q.vis && Math.hypot(q.x - (e.clientX - r.left), q.y - (e.clientY - r.top)) < 22);
      if (hit) {
        drag.dLon = 0;
        drag.dLat = 0;
        setFocus(hit.id);
        setHover(hit.id);
      }
    };
    const onLeave = () => ui.current.hover && setHover(null);
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const draw = (now: number) => {
      const v = p.get();
      const appear = Math.min(1, Math.max(0, (v - 0.18) / 0.3));
      ctx.clearRect(0, 0, w, h);
      if (appear > 0) {
        const ease = 1 - (1 - appear) ** 3;
        const wide = w >= 1024;
        const R = Math.min(w * (wide ? 0.62 : 1), h) * 0.36 * (0.55 + 0.45 * ease);
        const cx = wide ? w * 0.58 : w / 2;
        const cy = h / 2 + (1 - ease) * h * 0.25;
        globe = { cx, cy, R };
        const turn = Math.min(1, Math.max(0, (v - 0.3) / 0.5));

        // target view: scroll-driven, or the focused pin, plus whatever the visitor dragged
        const { focus: f, hover: hv, live: isLive } = ui.current;
        const fSite = f ? sites.find((s) => s.id === f) : null;
        let tLon = HOME.lon + (-62 - HOME.lon) * (1 - (1 - turn) ** 2) + (drag.on || !isLive ? Math.sin(now / 4000) * 2 : 0);
        let tLat = 12 + 14 * turn;
        if (fSite) {
          tLon = fSite.lon;
          tLat = Math.max(-30, Math.min(45, fSite.lat));
        }
        if (isLive) {
          tLon += drag.dLon;
          tLat += drag.dLat;
        } else {
          drag.dLon = drag.dLat = 0;
        }
        const k = drag.on ? 0.35 : 0.07;
        view.lon += wrapLon(tLon - view.lon) * k;
        view.lat += (tLat - view.lat) * k;

        const lam0 = view.lon * rad;
        const phi0 = view.lat * rad;
        const sp0 = Math.sin(phi0);
        const cp0 = Math.cos(phi0);
        const project = (lat: number, lon: number) => {
          const phi = lat * rad;
          const lam = lon * rad;
          const cphi = Math.cos(phi);
          const cosc = sp0 * Math.sin(phi) + cp0 * cphi * Math.cos(lam - lam0);
          return {
            x: cx + R * cphi * Math.sin(lam - lam0),
            y: cy - R * (cp0 * Math.sin(phi) - sp0 * cphi * Math.cos(lam - lam0)),
            vis: cosc > 0,
          };
        };
        const stroke = (pts: { x: number; y: number; vis: boolean }[]) => {
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
        const strokeLines = (lines: Lines) => {
          ctx.beginPath();
          for (const line of lines) {
            let pen = false;
            for (const [lon, lat] of line) {
              const q = project(lat, lon);
              if (!q.vis) {
                pen = false;
                continue;
              }
              if (pen) ctx.lineTo(q.x, q.y);
              else ctx.moveTo(q.x, q.y);
              pen = true;
            }
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
        ctx.lineWidth = 0.6;
        for (let lat = -75; lat <= 75; lat += 15) {
          ctx.globalAlpha = ease * (lat === 0 ? 0.7 : 0.28);
          stroke(Array.from({ length: 121 }, (_, i) => project(lat, -180 + i * 3)));
        }
        for (let lon = -180; lon < 180; lon += 15) {
          ctx.globalAlpha = ease * 0.28;
          stroke(Array.from({ length: 61 }, (_, i) => project(-90 + i * 3, lon)));
        }

        // land: coastlines in ink, borders as faint survey lines
        if (coast.length) {
          ctx.setLineDash([2, 3]);
          ctx.strokeStyle = col.muted;
          ctx.globalAlpha = ease * 0.35;
          ctx.lineWidth = 0.6;
          strokeLines(borders);
          ctx.setLineDash([]);
          ctx.strokeStyle = col.fg;
          ctx.globalAlpha = ease * 0.7;
          ctx.lineWidth = 1;
          strokeLines(coast);
        }

        // routes from home to every abroad site
        const reveal = Math.min(1, Math.max(0, (v - 0.45) / 0.22));
        const o = toVec(HOME.lat, HOME.lon);
        const abroad = sites.filter((s) => s.id !== HOME_PLACE.place);
        abroad.forEach((site, k2) => {
          const t = Math.min(1, Math.max(0, reveal * 1.6 - k2 * 0.3));
          if (t <= 0) return;
          const b = toVec(site.lat, site.lon);
          const pts = Array.from({ length: 90 }, (_, i) => {
            const [la, lo] = toLatLon(slerp(o, b, (i / 89) * t));
            return project(la, lo);
          });
          const lit = hv === site.id || f === site.id;
          ctx.globalAlpha = ease * (hv && !lit ? 0.45 : 1);
          if (site.spirit) {
            // a stitched seam: purple tape with gold running stitches
            ctx.strokeStyle = col.spirit;
            ctx.lineWidth = lit ? 5 : 4;
            ctx.setLineDash([]);
            stroke(pts);
            ctx.strokeStyle = col.gold;
            ctx.lineWidth = 1.4;
            ctx.setLineDash([5, 4]);
            ctx.lineDashOffset = -now / 60;
            stroke(pts);
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;
          } else {
            ctx.strokeStyle = col.accent;
            ctx.lineWidth = lit ? 2.6 : 1.8;
            stroke(pts);
          }
        });

        // pins
        const shown: typeof pinsOnScreen = [];
        for (const site of sites) {
          const q = project(site.lat, site.lon);
          shown.push({ id: site.id, x: q.x, y: q.y, vis: q.vis });
          const isHome = site.id === HOME_PLACE.place;
          const idx = abroad.indexOf(site);
          const arrived = isHome || Math.min(1, Math.max(0, reveal * 1.6 - idx * 0.3)) > 0.99;
          if (!q.vis || !arrived) continue;
          const lit = hv === site.id || f === site.id;
          ctx.globalAlpha = ease;

          if (site.spirit) {
            // pennant on a pole, gold star, a gold pulse
            const pulse = (now / 1600) % 1;
            ctx.strokeStyle = col.gold;
            ctx.globalAlpha = ease * (1 - pulse);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(q.x, q.y, 5 + pulse * 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = ease;
            const s = lit ? 1.25 : 1;
            const wave = Math.sin(now / 380) * 2.5;
            ctx.strokeStyle = col.fg;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(q.x, q.y);
            ctx.lineTo(q.x, q.y - 30 * s);
            ctx.stroke();
            ctx.fillStyle = col.spirit;
            ctx.beginPath();
            ctx.moveTo(q.x, q.y - 30 * s);
            ctx.quadraticCurveTo(q.x + 14 * s, q.y - (26 + wave) * s, q.x + 30 * s, q.y - (23 + wave) * s);
            ctx.quadraticCurveTo(q.x + 14 * s, q.y - (19 + wave * 0.5) * s, q.x, q.y - 16 * s);
            ctx.closePath();
            ctx.fill();
            star(ctx, q.x + 9 * s, q.y - 23 * s, 3.6 * s, col.gold);
            ctx.fillStyle = col.gold;
            ctx.beginPath();
            ctx.arc(q.x, q.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            if (isHome) {
              const pulse = (now / 1400) % 1;
              ctx.globalAlpha = ease * (1 - pulse);
              ctx.strokeStyle = col.accent;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(q.x, q.y, 4 + pulse * 18, 0, Math.PI * 2);
              ctx.stroke();
              ctx.globalAlpha = ease;
            }
            ctx.fillStyle = col.accent;
            ctx.beginPath();
            ctx.arc(q.x, q.y, lit ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fill();
            if (lit) {
              ctx.strokeStyle = col.accent;
              ctx.beginPath();
              ctx.arc(q.x, q.y, 9, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // label
          ctx.font = "11px 'JetBrains Mono', monospace";
          const sub = isHome
            ? `you are here · ${site.companies.length} teams`
            : site.companies.map((x) => x.company).join(" · ") + (site.current ? " · now" : "");
          const lw = Math.max(ctx.measureText(site.place.toUpperCase()).width, ctx.measureText(sub).width);
          const [lx, ly] =
            site.label === "left"
              ? [q.x - 12 - lw, q.y - 4]
              : site.label === "below"
                ? [q.x + 10, q.y + 18]
                : site.label === "above"
                  ? [q.x + 30, q.y - 62]
                  : [q.x + 10, q.y - 4];
          // a halo in the page colour keeps labels readable over routes and coastlines
          ctx.lineJoin = "round";
          ctx.lineWidth = 4;
          ctx.strokeStyle = col.bg;
          ctx.strokeText(site.place.toUpperCase(), lx, ly);
          ctx.strokeText(sub, lx, ly + 14);
          ctx.fillStyle = col.fg;
          ctx.fillText(site.place.toUpperCase(), lx, ly);
          ctx.fillStyle = site.spirit ? col.gold : col.accent;
          ctx.fillText(sub, lx, ly + 14);
        }
        pinsOnScreen = shown;

        // keep the hover card glued to its pin
        const el = tip.current;
        const active = hv ?? f;
        const at = active ? shown.find((s) => s.id === active) : null;
        if (el) {
          if (at && at.vis) {
            const left = Math.min(w - 300, Math.max(12, at.x + 18));
            const top = Math.min(h - 220, Math.max(70, at.y + 18));
            el.style.transform = `translate(${left}px, ${top}px)`;
            el.style.opacity = "1";
          } else el.style.opacity = "0";
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerup", onUp);
      c.removeEventListener("pointerleave", onLeave);
    };
  }, [p, sites]);

  const activeSite = sites.find((s) => s.id === (hover ?? focus)) ?? null;

  return (
    <section ref={ref} aria-label="From Addis Ababa to the world" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pb-10 pt-24 sm:px-10 lg:px-20">
        <canvas
          ref={canvas}
          aria-hidden
          className={cn("absolute inset-0 h-full w-full touch-pan-y", live ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none")}
        />

        {/* hover / tap card, positioned by the canvas loop */}
        <div
          ref={tip}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 w-[280px] opacity-0 transition-opacity duration-200"
        >
          {activeSite && <SiteCard site={activeSite} />}
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between">
          <span className="map-label">
            <span className="text-cyber">◆</span> Interlude · {live ? "drag the globe · hover a pin" : "zooming out"}
          </span>
          <span className="font-mono-tech text-[11px] tracking-[0.14em] text-foreground">{scaleText}</span>
        </div>

        <div className="pointer-events-none relative mx-auto mt-auto w-full max-w-7xl pb-12">
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
                <span className="mr-3 align-middle font-mono-tech text-[11px] tracking-[0.2em] text-muted-foreground">
                  {CAPTIONS[caption].k}.
                </span>
                {CAPTIONS[caption].text}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {live && (
              <motion.div
                className="pointer-events-auto mt-8 flex max-w-xl flex-col gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              >
                <dl className="grid grid-cols-3 gap-px border border-border bg-border">
                  {[
                    [projects.length, "landmarks"],
                    [teams, "teams"],
                    [remote, "remote, abroad"],
                  ].map(([n, label]) => (
                    <div key={label} className="bg-background/85 p-3 backdrop-blur-sm">
                      <dt className="map-label text-[9px]">{label}</dt>
                      <dd className="font-map mt-0.5 text-3xl text-foreground">{n}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="flex flex-wrap gap-1.5" aria-label="Stops on the globe">
                  {sites.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHover(s.id)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(s.id)}
                        onBlur={() => setHover(null)}
                        onClick={() => setFocus((cur) => (cur === s.id ? null : s.id))}
                        aria-pressed={focus === s.id}
                        className={cn(
                          "border px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm transition-colors",
                          s.spirit
                            ? "border-spirit bg-spirit-deep/70 text-spirit-gold hover:bg-spirit hover:text-white"
                            : "border-border bg-background/80 text-muted-foreground hover:border-cyber hover:text-foreground",
                          focus === s.id && (s.spirit ? "bg-spirit text-white" : "border-cyber text-foreground"),
                        )}
                      >
                        {s.spirit && <span aria-hidden>★ </span>}
                        {s.place}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SiteCard({ site }: { site: Site }) {
  if (site.spirit) return <SpiritCard site={site} />;
  return (
    <div className="border border-input bg-card/95 p-4 shadow-xl backdrop-blur">
      <div className="map-label text-[9px]">
        {site.place} · {site.lat.toFixed(2)}°, {site.lon.toFixed(2)}°
      </div>
      <ul className="mt-2 space-y-2.5">
        {site.companies.map((c) => (
          <li key={c.company}>
            <div className="font-map text-xl leading-tight text-foreground">{c.company}</div>
            {c.roles.map((r) => (
              <div key={r.role} className="font-mono-tech text-[10.5px] text-muted-foreground">
                <span className="text-cyber">{r.role}</span> · {r.period}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The current post, dressed like spirit wear: stitched patch, pennant, varsity letters. */
function SpiritCard({ site }: { site: Site }) {
  const roles = site.companies[0].roles;
  return (
    <div className="relative border-2 border-spirit bg-spirit-deep/95 p-1 shadow-2xl backdrop-blur">
      <div className="border border-dashed border-spirit-gold/70 p-3.5">
        <div className="flex items-center justify-between font-mono-tech text-[9px] uppercase tracking-[0.2em] text-spirit-gold">
          <span>★ Current post</span>
          <span>{site.place}</span>
        </div>
        <div className="font-map mt-1.5 text-2xl leading-none text-foreground">Spirit Hero</div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-foreground/75">
          Online stores for school spirit wear and fundraising — flash sales and on-demand printing.
        </p>
        <ol className="mt-3 space-y-1.5">
          {roles.map((r) => (
            <li key={r.role} className="flex items-baseline justify-between gap-3 font-mono-tech text-[10.5px]">
              <span className={/present/i.test(r.period) ? "text-spirit-gold" : "text-foreground/70"}>{r.role}</span>
              <span className="shrink-0 text-foreground/55">{r.period}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
