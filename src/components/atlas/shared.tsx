import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Home base: Addis Ababa. Everything on the sheet is measured from here. */
export const HOME = { lat: 9.03, lon: 38.74, elev: 2355 };

export const RESUME_URL =
  "https://drive.google.com/file/d/1sZyjxk_ByVfn66EWzgaWsMHMoNVkYu5q/view?usp=sharing";

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/lisan-5" },
  { label: "LinkedIn", href: "https://linkedin.com/in/lisanegebriel-abay" },
  { label: "Email", href: "mailto:lisan5abay@gmail.com" },
  { label: "Telegram", href: "https://t.me/ligator" },
  { label: "LeetCode", href: "https://leetcode.com/u/lisanx/" },
  { label: "X", href: "https://x.com/lisanabay" },
] as const;

export const SECTIONS = [
  { id: "top", label: "Base camp" },
  { id: "landmarks", label: "Landmarks" },
  { id: "route", label: "The route" },
  { id: "legend", label: "Legend" },
  { id: "notes", label: "Field notes" },
  { id: "reports", label: "Field reports" },
  { id: "destination", label: "Destination" },
] as const;

export function fmtLat(v: number) {
  return `${Math.abs(v).toFixed(4)}° ${v >= 0 ? "N" : "S"}`;
}
export function fmtLon(v: number) {
  return `${Math.abs(v).toFixed(4)}° ${v >= 0 ? "E" : "W"}`;
}

export function Reveal({
  delay = 0,
  y = 28,
  x = 0,
  className,
  children,
  ...rest
}: { delay?: number; y?: number; x?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Section title set like a map sheet heading: sheet number, serif title, grid reference. */
export function SheetHead({
  sheet,
  title,
  italic,
  grid,
  aside,
  className,
}: {
  sheet: string;
  title: string;
  italic?: string;
  grid: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end", className)}>
      <Reveal className="md:col-span-8">
        <div className="map-label flex items-center gap-3">
          <span className="text-cyber">◆</span> Sheet {sheet}
          <span className="h-px w-10 bg-border" />
          <span>grid {grid}</span>
        </div>
        <h2 className="font-map mt-4 text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.01em] text-foreground">
          {title}
          {italic && <em className="text-cyber"> {italic}</em>}
        </h2>
      </Reveal>
      {aside && (
        <Reveal delay={0.1} className="text-sm leading-relaxed text-slate-mid md:col-span-4">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
