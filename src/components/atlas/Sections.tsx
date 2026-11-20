/** Legend (skills), Field notes (about + education), Field reports (testimonials), Destination (contact + footer). */
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { certifications, coursework, footerStats, projects, stacks } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { EASE, HOME, RESUME_URL, Reveal, SOCIALS, SheetHead, fmtLat, fmtLon } from "./shared";

/* ───────────────────────── legend ───────────────────────── */

const SYMBOLS: ReactNode[] = [
  // backend: a triangulation pillar
  <svg key="a" viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 3 L21 20 H3 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="14" r="2" fill="currentColor" /></svg>,
  // AI: a summit
  <svg key="b" viewBox="0 0 24 24" className="h-6 w-6"><path d="M2 20 L9 8 L13 14 L16 10 L22 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M9 8 L10.5 10.5 L7.5 10.5 Z" fill="currentColor" /></svg>,
  // tools: a building / station
  <svg key="c" viewBox="0 0 24 24" className="h-6 w-6"><rect x="5" y="8" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5 8 L12 3 L19 8" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="10" y="13" width="4" height="7" fill="currentColor" /></svg>,
  // foundations: bedrock hatching
  <svg key="d" viewBox="0 0 24 24" className="h-6 w-6"><rect x="3" y="5" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M3 11 L9 5 M3 17 L15 5 M7 19 L21 5 M13 19 L21 11" stroke="currentColor" strokeWidth="1" /></svg>,
];

export function Legend() {
  return (
    <section id="legend" className="relative px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <SheetHead
          sheet="04"
          grid="E1–E4"
          title="Legend"
          italic="& symbols."
          aside="What the marks on this map mean — the languages, frameworks and foundations everything here is built with."
        />
        <div className="grid border-l border-t border-input md:grid-cols-2">
          {stacks.map((s, i) => (
            <Reveal key={s.label} delay={(i % 2) * 0.08} className="border-b border-r border-input bg-card/40 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-start gap-4">
                <span className="mt-1 text-cyber">{SYMBOLS[i % SYMBOLS.length]}</span>
                <div>
                  <h3 className="font-map text-3xl leading-none text-foreground">
                    {s.label
                      .toLowerCase()
                      .replace(/(^|\s|\/)\S/g, (c) => c.toUpperCase())
                      .replace(/\bAi\b/g, "AI")}
                  </h3>
                  <p className="map-label mt-2">{s.items.length} entries</p>
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-1.5 gap-y-2">
                {s.items.map((it, j) => (
                  <motion.li
                    key={it}
                    className="group flex items-center gap-1.5 border border-border px-2.5 py-1 font-mono-tech text-[11px] text-slate-mid transition-colors hover:border-cyber hover:text-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.02 * j, duration: 0.35, ease: EASE }}
                  >
                    <span className="h-1 w-1 rotate-45 bg-muted-foreground transition-colors group-hover:bg-cyber" />
                    {it}
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── field notes ───────────────────────── */

export function FieldNotes() {
  return (
    <section id="notes" className="relative px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <SheetHead sheet="05" grid="F1–F3" title="Field" italic="notes." />
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-map text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.15] text-foreground">
              I build scalable backend systems, AI-powered applications and high-performance web
              platforms that turn ambitious ideas into <em className="text-cyber">reliable production software.</em>
            </p>
            <div className="mt-8 space-y-4 text-[15px] leading-[1.85] text-slate-mid">
              <p>
                My work spans API design, LLM integrations, intelligent automation, real-time platforms,
                logistics systems, healthcare products and data-driven applications — in Python,
                TypeScript, FastAPI, Node.js, Laravel, React and Next.js.
              </p>
              <p>
                I enjoy hard engineering problems, optimising architectures, and building tools that make
                systems faster and people more effective. Away from the editor: competitive programming,
                system design, and whatever is new in AI.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
              {footerStats.map((s) => (
                <div key={s.label} className="bg-background/80 p-4">
                  <dt className="map-label text-[9px]">{s.label}</dt>
                  <dd className="mt-1 text-sm text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="space-y-5 lg:col-span-5">
            <Note n="i" title="BSc Computer Science" meta="Addis Ababa University">
              Algorithms, systems, databases, networking and end-to-end software design.
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {coursework.map((c) => (
                  <li key={c} className="border border-border px-2 py-0.5 font-mono-tech text-[9.5px] text-muted-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </Note>
            <Note n="ii" title="A2SV — Africa to Silicon Valley" meta="Backed by Google · 2024 – 2025">
              1,000+ algorithmic challenges; graphs, dynamic programming and recursion. Ranked among the top
              performers.
            </Note>
            <Note n="iii" title="Credentials" meta="AI & cloud">
              <ul className="space-y-1.5">
                {certifications.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 bg-cyber" />
                    {c}
                  </li>
                ))}
              </ul>
            </Note>
            <Note n="iv" title="Capstone: Intelligent Code Analysis" meta="Python · static analysis">
              Evaluates algorithm efficiency and suggests optimisations using static analysis and rule-based
              heuristics.
            </Note>
          </div>
        </div>
      </div>
    </section>
  );
}

function Note({ n, title, meta, children }: { n: string; title: string; meta: string; children: ReactNode }) {
  return (
    <Reveal x={30} y={0} className="relative border border-input bg-card/60 p-5 pl-14 backdrop-blur-sm">
      <span className="font-map absolute left-5 top-4 text-2xl italic text-cyber">{n}.</span>
      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="map-label mt-1 text-[9.5px]">{meta}</p>
      <div className="mt-3 text-sm leading-relaxed text-slate-mid">{children}</div>
    </Reveal>
  );
}

/* field reports live in ./Reports */
export { Reports } from "./Reports";

/* ───────────────────────── destination ───────────────────────── */

export function Destination() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("https://formspree.io/f/mnnqjkkb", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState("error");
    }
  };

  const field =
    "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-cyber";

  return (
    <section id="destination" className="relative px-5 pb-16 pt-28 sm:px-10 lg:px-20 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <SheetHead sheet="07" grid="H1" title="Set a" italic="destination." />
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <form onSubmit={submit} className="border border-input bg-card/60 p-6 backdrop-blur-sm sm:p-10">
              <div className="map-label flex justify-between">
                <span>new route</span>
                <span>
                  from {fmtLat(HOME.lat)} {fmtLon(HOME.lon)}
                </span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="map-label text-[9px]">Traveller</span>
                  <input required className={field} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="block">
                  <span className="map-label text-[9px]">Return address</span>
                  <input required type="email" className={field} placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
              </div>
              <label className="mt-6 block">
                <span className="map-label text-[9px]">Where are we going?</span>
                <textarea
                  required
                  rows={4}
                  className={cn(field, "resize-none")}
                  placeholder="A role, a project, an idea…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex items-center gap-2 bg-cyber px-7 py-4 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.18em] text-cyber-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "sent" ? <Check className="h-4 w-4" /> : null}
                  {state === "sent" ? "Route plotted" : "Plot the route"}
                </button>
                <span className="font-mono-tech text-[11px] text-muted-foreground" role="status">
                  {state === "sent" && "Message received — I'll reply within a day."}
                  {state === "error" && "Couldn't send. Email me directly instead."}
                </span>
              </div>
            </form>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="font-map text-4xl leading-tight text-foreground">
              Got a hard problem or an idea worth building? <em className="text-cyber">Let's map it out.</em>
            </p>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {[...SOCIALS, { label: "Phone", href: "tel:+251964011087" }, { label: "Résumé", href: RESUME_URL }].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3.5 font-mono-tech text-[12px] uppercase tracking-[0.16em] text-slate-mid transition-colors hover:text-cyber"
                  >
                    {s.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <footer className="mt-28 flex flex-wrap items-end justify-between gap-6 border-t border-input pt-6">
          <div>
            <div className="font-map text-3xl text-foreground">Lisanegebriel Abay</div>
            <p className="map-label mt-2">
              Surveyed &amp; drawn in Addis Ababa · {new Date().getFullYear()} · {projects.length} landmarks
            </p>
          </div>
          <div className="w-48">
            <div className="flex h-1.5 border border-foreground/60">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i % 2 ? "flex-1" : "flex-1 bg-foreground/70"} />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono-tech text-[9px] text-muted-foreground">
              <span>0</span>
              <span>scale 1:25 000</span>
              <span>1 km</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
