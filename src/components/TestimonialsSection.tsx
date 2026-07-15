import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Globe, Linkedin, Mail, Quote } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

type Testimonial = {
  name: string;
  role: string;
  org: string;
  initials: string;
  tag: string;
  quote: string;
  link: { label: string; href: string; icon: "linkedin" | "mail" | "globe" };
};

const testimonials: Testimonial[] = [
  {
    name: "Adis Ojeda",
    role: "Director of Engineering",
    org: "Theseus Group",
    initials: "AO",
    tag: "AI - CLOUD - MIT EECS",
    quote:
      "Lisanegebriel is the rare engineer who pairs real backend rigor with genuine AI intuition. Working alongside him at Theseus Group, I watched him take ambiguous LLM problems and ship production-grade systems that actually hold up. He turns research into reliable infrastructure - exactly the instinct modern AI teams are built on.",
    link: { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/adis-ojeda/", icon: "linkedin" },
  },
  {
    name: "Samuel Getachew",
    role: "Final Project Advisor - Dept. of Computer Science",
    org: "Addis Ababa University",
    initials: "SG",
    tag: "ACADEMIC ADVISOR",
    quote:
      "As his advisor on Lingo-Abyssinia, I saw Lisanegebriel move from requirement analysis to a working interactive language-learning system with discipline and independence. He consistently proposed practical solutions, communicated clearly with his team, and applied classroom knowledge to real software. Among the students I have supervised, he stood out for his curiosity and reliability.",
    link: { label: "Email the advisor", href: "mailto:samuel.getachew34@aau.edu.et", icon: "mail" },
  },
  {
    name: "Binyam Dele",
    role: "Founder",
    org: "Ambalay Maps",
    initials: "BD",
    tag: "GEOSPATIAL - AFRICA",
    quote:
      "Building map infrastructure for how Ethiopians actually move takes engineers who understand both the technology and the local context. Lisanegebriel is exactly that - sharp with modern web stacks, thoughtful about real users, and relentless about shipping. He understands that local problems need local engineering, and he builds accordingly.",
    link: { label: "Visit ambalaymaps.com", href: "https://www.ambalaymaps.com", icon: "globe" },
  },
];

const linkIcons = { linkedin: Linkedin, mail: Mail, globe: Globe } as const;

const AUTOPLAY_MS = 6500;

const deckPose = (position: number, direction: number, reduceMotion: boolean | null) => {
  const depth = Math.min(position, 2);
  const side = direction < 0 ? -1 : 1;

  if (reduceMotion) {
    return {
      opacity: depth === 0 ? 1 : 0.62 - depth * 0.1,
      x: depth * 22,
      y: depth * 16,
      z: 0,
      scale: 1 - depth * 0.025,
      rotateX: 0,
      rotateY: 0,
      rotateZ: depth * 1.8,
      filter: "blur(0px)",
    };
  }

  return {
    opacity: [1, 0.68, 0.44][depth],
    x: [0, 44, 76][depth] * side,
    y: [0, 24, 46][depth],
    z: [70, -35, -120][depth],
    scale: [1, 0.98, 0.95][depth],
    rotateX: [0, 2.5, 5][depth],
    rotateY: [0, -12, -19][depth] * side,
    rotateZ: [0, 2.8, 5][depth] * side,
    filter: `blur(${depth * 0.15}px)`,
  };
};

function DeckCard({
  data,
  index,
  direction,
  count,
  stackPosition,
  isActive,
  onPaginate,
  onSelect,
  reduceMotion,
}: {
  data: Testimonial;
  index: number;
  direction: number;
  count: number;
  stackPosition: number;
  isActive: boolean;
  onPaginate: (dir: number) => void;
  onSelect: () => void;
  reduceMotion: boolean | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [11, -11]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 18 });
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const spotlight = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) => `radial-gradient(circle at ${x} ${y}, rgba(120,210,235,0.18), transparent 45%)`
  );

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !isActive) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isActive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  const ActiveIcon = linkIcons[data.link.icon];
  const pose = deckPose(stackPosition, direction, reduceMotion);

  return (
    <motion.article
      ref={ref}
      initial={false}
      animate={pose}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.16}
      onDragEnd={(_, info) => {
        if (!isActive) return;
        if (info.offset.x < -80) onPaginate(1);
        else if (info.offset.x > 80) onPaginate(-1);
      }}
      onClick={isActive ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      tabIndex={isActive ? -1 : 0}
      aria-label={isActive ? undefined : `Show testimonial from ${data.name}`}
      style={{ zIndex: count - stackPosition, transformStyle: "preserve-3d" }}
      className={`group absolute inset-0 will-change-transform ${isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
    >
      <motion.div
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        whileHover={isActive && !reduceMotion ? { scale: 1.018 } : undefined}
        className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-7 backdrop-blur-md transition-colors duration-300 sm:p-10 ${
          isActive
            ? "border-cyber/45 bg-card/90 shadow-[0_48px_100px_-28px_rgba(56,189,220,0.36)] hover:border-cyber/70"
            : "border-border/45 bg-card/20 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.7)] hover:border-cyber/25"
        }`}
      >
        {!reduceMotion && isActive && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_26%,transparent_72%,rgba(120,210,235,0.1))]" />
        <div className="pointer-events-none absolute -left-20 -top-24 h-48 w-48 rounded-full bg-cyber/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-8 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />

        <motion.div
          className="absolute left-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-cyber to-transparent"
          initial={false}
          animate={{ width: isActive ? "100%" : "45%" }}
          transition={{ duration: 0.55, ease: "easeOut" as const }}
        />

        <div style={{ transform: "translateZ(48px)" }} className="relative">
          <div className="mb-4 flex items-center justify-between">
            <motion.div
              style={{ transform: "translateZ(34px)" }}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyber/30 bg-cyber/8 shadow-[0_18px_42px_-20px_rgba(56,189,220,0.75)]"
            >
              <Quote className="h-5 w-5 text-cyber/75" strokeWidth={1.75} />
            </motion.div>
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>

          <blockquote className="text-base leading-relaxed text-foreground sm:text-lg">{data.quote}</blockquote>
        </div>

        <div
          style={{ transform: "translateZ(66px)" }}
          className="relative mt-8 flex flex-col gap-4 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div
              style={{ transform: "translateZ(28px)" }}
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyber/40 bg-gradient-to-br from-cyan-700/30 to-sky-600/10 font-mono-tech text-sm font-bold tracking-wide text-cyber shadow-[0_8px_20px_-6px_rgba(56,189,220,0.5)]"
            >
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-cyber/30"
                  animate={reduceMotion ? undefined : { scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" as const }}
                />
              )}
              {data.initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground">{data.name}</div>
              <div className="text-xs text-slate-mid">
                {data.role} - <span className="text-cyber">{data.org}</span>
              </div>
              <div className="mt-1 font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">{data.tag}</div>
            </div>
          </div>

          {isActive ? (
            <a
              href={data.link.href}
              target={data.link.icon === "mail" ? undefined : "_blank"}
              rel="noopener noreferrer"
              style={{ transform: "translateZ(38px)" }}
              className="group/link inline-flex items-center gap-2 self-start rounded-lg border border-border bg-background/55 px-4 py-2.5 font-mono-tech text-[10px] tracking-[0.15em] text-slate-mid transition-all duration-200 hover:border-cyber hover:bg-card/70 hover:text-cyber hover:shadow-[0_8px_24px_-8px_rgba(56,189,220,0.45)] sm:self-auto"
            >
              <ActiveIcon className="h-3.5 w-3.5" />
              {data.link.label}
              <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">-&gt;</span>
            </a>
          ) : (
            <span
              style={{ transform: "translateZ(26px)" }}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-border/70 bg-background/35 px-4 py-2.5 font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground sm:self-auto"
            >
              <ActiveIcon className="h-3.5 w-3.5" />
              {data.link.label}
            </span>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

export function TestimonialsSection() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = testimonials.length;

  const paginate = useCallback(
    (dir: number) => {
      setState(([prev]) => [(prev + dir + count) % count, dir]);
    },
    [count]
  );

  const goTo = useCallback(
    (target: number) => {
      setState(([prev]) => {
        if (target === prev) return [prev, 0];
        const forward = (target - prev + count) % count;
        const backward = (prev - target + count) % count;
        return [target, forward <= backward ? 1 : -1];
      });
    },
    [count]
  );

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) paginate(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paginate, reduceMotion]);

  return (
    <section id="testimonials" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,200,220,0.07),transparent_35%)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto w-full max-w-5xl"
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // SIGNAL FROM THE FIELD
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          TESTIMONIALS<span className="text-cyber">.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mb-12 max-w-lg text-sm leading-relaxed text-slate-mid">
          Words from the people I've built, shipped, and learned alongside.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="relative mx-auto max-w-4xl"
          style={{ perspective: 1400 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="relative min-h-[500px] [transform-style:preserve-3d] sm:min-h-[420px]">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_35%_15%,rgba(56,189,220,0.14),transparent_34%),radial-gradient(circle_at_75%_85%,rgba(125,211,252,0.08),transparent_38%)] blur-sm" />
            {testimonials.map((item, i) => {
              const stackPosition = (i - index + count) % count;

              return (
                <DeckCard
                  key={item.name}
                  data={item}
                  index={i}
                  direction={direction}
                  count={count}
                  stackPosition={stackPosition}
                  isActive={stackPosition === 0}
                  onPaginate={paginate}
                  onSelect={() => goTo(i)}
                  reduceMotion={reduceMotion}
                />
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/40 text-slate-mid backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyber hover:text-cyber hover:shadow-[0_10px_24px_-10px_rgba(56,189,220,0.5)]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>

            <div className="flex items-center gap-2.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="group relative h-2.5 py-1"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-cyber" : "w-1.5 bg-border group-hover:bg-cyber/50"
                    }`}
                  />
                  {i === index && !reduceMotion && !paused && (
                    <motion.span
                      key={index}
                      className="absolute left-0 top-1/2 block h-1.5 -translate-y-1/2 rounded-full bg-cyan-200/60"
                      initial={{ width: 0 }}
                      animate={{ width: "2rem" }}
                      transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/40 text-slate-mid backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyber hover:text-cyber hover:shadow-[0_10px_24px_-10px_rgba(56,189,220,0.5)]"
            >
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
