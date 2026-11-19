/**
 * Field console — a small, real shell for the atlas.
 *
 * Commands read from the same data as the page (so they never go stale), can drive the
 * page (`cd route`, `open vigil`, `theme light`) and hand questions to the guide
 * (`ask …`). History with ↑/↓, Tab completion, and ` (backtick) toggles it anywhere.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { experiences, projects, stacks } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { topo } from "./atlas/TopoField";
import { HOME, RESUME_URL, SECTIONS, SOCIALS, fmtLat, fmtLon } from "./atlas/shared";

type Tone = "fg" | "muted" | "accent" | "err" | "water";
type Line = { id: number; text: ReactNode; tone?: Tone };

let lineId = 0;
const L = (text: ReactNode, tone?: Tone): Line => ({ id: ++lineId, text, tone });

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

const SECTION_ALIASES: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap((s) => [
    [s.id, s.id],
    [slug(s.label), s.id],
  ]),
);
Object.assign(SECTION_ALIASES, {
  home: "top",
  projects: "landmarks",
  work: "landmarks",
  experience: "route",
  skills: "legend",
  about: "notes",
  education: "notes",
  testimonials: "reports",
  contact: "destination",
});

const HELP: [string, string][] = [
  ["help", "this list"],
  ["whoami", "who drew this map"],
  ["ls", "sections on this sheet"],
  ["cd <section>", "fly to a section — cd route"],
  ["projects", "every landmark"],
  ["open <project>", "open a project record — open vigil"],
  ["route", "the career, as a route"],
  ["skills", "the legend"],
  ["whereami", "coordinates under your cursor"],
  ["map", "render the terrain under this page"],
  ["ask <question>", "hand a question to the guide"],
  ["contact", "ways to reach me"],
  ["resume", "open the résumé"],
  ["theme dark|light", "switch the sheet"],
  ["clear", "clear the console"],
];
const COMMANDS = HELP.map(([c]) => c.split(" ")[0]);

const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined")
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

function asciiMap(cols = 54, rows = 15): string[] {
  const ramp = " .,:;-=+*#%@";
  const out: string[] = [];
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const v = topo.heightAt((c / (cols - 1)) * w, (r / (rows - 1)) * h);
      const band = Math.floor(v * 24) % 5 === 0 ? "~" : ramp[Math.min(ramp.length - 1, Math.max(0, Math.floor(v * ramp.length)))];
      line += band;
    }
    out.push(line);
  }
  return out;
}

export function TerminalConsole() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(() => [
    L("atlas field console · v3.0", "accent"),
    L(`station ${fmtLat(HOME.lat)} ${fmtLon(HOME.lon)} · elev ${HOME.elev} m`, "muted"),
    L('type "help" — tab completes, ↑ ↓ for history', "muted"),
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const completions = useMemo(
    () => [
      ...COMMANDS,
      ...Object.keys(SECTION_ALIASES).map((s) => `cd ${s}`),
      ...projects.map((p) => `open ${slug(p.title)}`),
      "theme dark",
      "theme light",
      "sudo hire-me",
    ],
    [],
  );

  // backtick toggles the console from anywhere (not while typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if (e.key === "`" && (!typing || t === inputRef.current)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = useCallback((...ls: Line[]) => setLines((prev) => [...prev, ...ls]), []);

  const run = (raw: string) => {
    const cmdline = raw.trim();
    const echo = L(
      <>
        <span className="text-cyber">lisan@atlas</span>
        <span className="text-muted-foreground">:~$ </span>
        {cmdline}
      </>,
      "fg",
    );
    if (!cmdline) return print(echo);
    setHistory((h) => [cmdline, ...h.filter((x) => x !== cmdline)].slice(0, 40));
    setCursor(-1);
    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    const out: Line[] = [];

    switch (cmd.toLowerCase()) {
      case "help":
        out.push(L("commands", "accent"));
        HELP.forEach(([c, d]) => out.push(L(`  ${c.padEnd(18)} ${d}`, "muted")));
        break;
      case "whoami":
        out.push(L("Lisanegebriel Abay", "fg"));
        out.push(L("Full-Stack & AI Engineer · Addis Ababa, Ethiopia", "muted"));
        out.push(L(`${projects.length} landmarks · ${experiences.length} waypoints · open to work`, "accent"));
        break;
      case "ls":
        SECTIONS.forEach((s, i) => out.push(L(`  0${i + 1}  ${s.id.padEnd(12)} ${s.label}`, "muted")));
        break;
      case "cd": {
        const id = SECTION_ALIASES[slug(arg)];
        if (!id) {
          out.push(L(`cd: no such section: ${arg || "(none)"} — try ls`, "err"));
          break;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        out.push(L(`flying to ${id}…`, "accent"));
        break;
      }
      case "projects":
        projects.forEach((p, i) =>
          out.push(L(`  ${String(i + 1).padStart(2, "0")}  ${slug(p.title).padEnd(16)} ${p.metric}`, i === 0 ? "accent" : "muted")),
        );
        out.push(L('open one: open <name>', "muted"));
        break;
      case "open": {
        const p = projects.find((x) => slug(x.title) === slug(arg) || slug(x.title).startsWith(slug(arg)));
        if (!arg || !p) {
          out.push(L(`open: unknown landmark "${arg}" — try projects`, "err"));
          break;
        }
        window.dispatchEvent(new CustomEvent("atlas:open-project", { detail: p.title }));
        out.push(L(`opening the ${titleCase(p.title)} record…`, "accent"));
        setTimeout(() => setOpen(false), 350);
        break;
      }
      case "route": {
        const stops = [...experiences].reverse();
        out.push(L("  ◉ depart · AAU & A2SV", "muted"));
        stops.forEach((e, i) => {
          out.push(L("  │", "muted"));
          out.push(L(`  ${i === stops.length - 1 ? "◆" : "◇"} ${e.company.padEnd(24)} ${e.period}`, i === stops.length - 1 ? "accent" : "fg"));
          out.push(L(`  │   ${e.role}`, "muted"));
        });
        out.push(L("  ┊", "muted"));
        out.push(L("  ◎ next stop · yours?", "accent"));
        break;
      }
      case "skills":
        stacks.forEach((s) => {
          out.push(L(s.label, "accent"));
          out.push(L(`  ${s.items.join(" · ")}`, "muted"));
        });
        break;
      case "whereami": {
        const k = 0.00011;
        const lat = HOME.lat + (innerHeight / 2 - (pointer.y + scrollY * 0.55)) * k;
        const lon = HOME.lon + (pointer.x - innerWidth / 2) * k;
        const elev = Math.round(HOME.elev + (topo.heightAt(pointer.x, pointer.y) - 0.5) * 900);
        out.push(L(`${fmtLat(lat)}  ${fmtLon(lon)}  elev ${elev.toLocaleString()} m`, "fg"));
        out.push(L(`section: ${document.querySelector("section:hover")?.id ?? "between sheets"}`, "muted"));
        break;
      }
      case "map":
        out.push(L("terrain under this viewport, live:", "muted"));
        asciiMap().forEach((row) => out.push(L(row, "water")));
        break;
      case "ask":
        if (!arg) {
          out.push(L('ask: what would you like to know? e.g. ask "what is vigil?"', "err"));
          break;
        }
        window.dispatchEvent(new CustomEvent("atlas:ask", { detail: args.join(" ").replace(/^["']|["']$/g, "") }));
        out.push(L("handing that to the guide…", "accent"));
        setTimeout(() => setOpen(false), 300);
        break;
      case "contact":
      case "social":
        SOCIALS.forEach((s) =>
          out.push(
            L(
              <>
                {`  ${s.label.padEnd(10)} `}
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-cyber hover:underline">
                  {s.href.replace(/^mailto:|^https?:\/\//, "")}
                </a>
              </>,
              "muted",
            ),
          ),
        );
        out.push(L("  Phone      +251 96 401 1087", "muted"));
        break;
      case "resume":
        window.open(RESUME_URL, "_blank", "noopener");
        out.push(L("opening the résumé in a new tab…", "accent"));
        break;
      case "theme": {
        const light = arg === "light" ? true : arg === "dark" ? false : !document.documentElement.classList.contains("light");
        document.documentElement.classList.toggle("light", light);
        localStorage.setItem("theme", light ? "light" : "dark");
        window.dispatchEvent(new Event("atlas:theme"));
        out.push(L(`sheet switched to ${light ? "survey paper" : "night survey"}`, "accent"));
        break;
      }
      case "sudo":
        if (slug(arg) === "hire-me") {
          out.push(L("[sudo] password for recruiter: ********", "muted"));
          out.push(L("access granted. plotting a route to the contact form…", "accent"));
          setTimeout(() => document.getElementById("destination")?.scrollIntoView({ behavior: "smooth" }), 600);
        } else out.push(L("nice try.", "err"));
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
        setOpen(false);
        return print(echo);
      default:
        out.push(L(`${cmd}: command not found — try help`, "err"));
    }
    print(echo, ...out, L("", "muted"));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(history.length - 1, cursor + 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setInput(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = completions.filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) setInput(matches[0] + " ");
      else if (matches.length > 1) print(L(matches.slice(0, 12).join("   "), "muted"));
    }
  };

  const toneClass: Record<Tone, string> = {
    fg: "text-foreground",
    muted: "text-muted-foreground",
    accent: "text-cyber",
    err: "text-destructive",
    water: "text-[var(--water)]",
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chip"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="group fixed bottom-4 left-4 z-[100] flex items-center gap-2.5 border border-input bg-background/85 px-3 py-2 font-mono-tech text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-md transition-colors hover:border-cyber hover:text-foreground sm:bottom-6 sm:left-6"
            aria-label="Open the field console"
          >
            <span className="text-cyber">&gt;_</span>
            console
            <span className="hidden border border-border px-1 text-[9px] text-muted-foreground sm:inline">`</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="Field console"
            initial={{ opacity: 0, y: 24, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
            exit={{ opacity: 0, y: 16, clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-3 z-[100] flex max-h-[78svh] flex-col border border-input bg-background/92 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[560px]"
          >
            {/* corner ticks */}
            {["-left-px -top-px border-l-2 border-t-2", "-right-px -top-px border-r-2 border-t-2", "-bottom-px -left-px border-b-2 border-l-2", "-bottom-px -right-px border-b-2 border-r-2"].map((c) => (
              <span key={c} className={cn("pointer-events-none absolute h-3 w-3 border-cyber", c)} />
            ))}
            <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="relative grid h-2.5 w-2.5 place-items-center">
                  <span className="absolute inset-0 animate-ping-ring rounded-full border border-cyber" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber" />
                </span>
                <span className="map-label text-[9.5px] text-foreground">field console</span>
                <span className="map-label hidden text-[9px] sm:inline">lisan@atlas:~</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-cyber"
              >
                esc ✕
              </button>
            </header>

            <div
              ref={scrollRef}
              className="h-72 overflow-y-auto px-4 py-3 font-mono-tech text-[11.5px] leading-[1.65] sm:h-80"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((l, i) => (
                <motion.div
                  key={l.id}
                  className={cn("whitespace-pre-wrap break-words", toneClass[l.tone ?? "muted"])}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(0.5, (i % 40) * 0.012) }}
                >
                  {l.text || " "}
                </motion.div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
                setInput("");
              }}
              className="flex items-center gap-2 border-t border-border px-4 py-3 font-mono-tech text-[12px]"
            >
              <span className="text-cyber">lisan@atlas</span>
              <span className="text-muted-foreground">:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="min-w-0 flex-1 border-none bg-transparent text-foreground caret-[var(--cyber)] outline-none placeholder:text-muted-foreground/60"
                placeholder="help"
                autoComplete="off"
                spellCheck={false}
                aria-label="Console input"
              />
            </form>
            <div className="flex gap-1.5 overflow-x-auto border-t border-border px-4 py-2">
              {["help", "projects", "route", "map", "open vigil", "sudo hire-me"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => run(c)}
                  className="shrink-0 border border-border px-2 py-0.5 font-mono-tech text-[10px] text-muted-foreground transition-colors hover:border-cyber hover:text-foreground"
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
