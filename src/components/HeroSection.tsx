import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition },
};

const heroSocials = [
  { label: "GitHub", href: "https://github.com/lisan-5", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/lisanegebriel-abay", external: true },
  { label: "Email", href: "mailto:lisan5abay@gmail.com", external: false },
  { label: "Telegram", href: "https://t.me/ligator", external: true },
  { label: "LeetCode", href: "https://leetcode.com/u/lisanx/", external: true },
  { label: "X", href: "https://x.com/lisanabay", external: true },
  { label: "Phone", href: "tel:+251964011087", external: false },
] as const;

export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-24 sm:px-6 lg:px-16">
      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 text-left lg:grid-cols-[minmax(0,1fr)_300px]"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground"
          >
            ADDIS ABABA // BUILDING SYSTEMS THAT SCALE
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-3 font-mono-tech text-sm tracking-[0.12em] text-foreground"
          >
            I&apos;M LISANEGEBRIEL ABAY
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-4xl text-[clamp(2.4rem,6.8vw,5.6rem)] font-bold leading-[0.95] tracking-tight text-foreground"
          >
            I DESIGN AND BUILD
            <br />
            <span className="text-gradient-cyber">HIGH-PERFORMANCE SOFTWARE</span>
            <br />
            SYSTEMS<span className="text-cyber">.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl font-mono-tech text-sm leading-relaxed text-slate-mid"
          >
            Full-stack engineer focused on AI-powered systems,
            <br />
            real-time architectures, and performance-critical applications.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-start gap-4">
            <motion.button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full border border-foreground bg-foreground px-5 py-3.5 font-mono-tech text-xs tracking-[0.15em] text-primary-foreground transition-all duration-200 hover:bg-transparent hover:text-foreground sm:w-auto sm:px-8"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              → VIEW PROJECTS
            </motion.button>
            <motion.a
              href="https://drive.google.com/file/d/1btRjzUlrhZ5pcyDA1fpfHC-3uJymNGKR/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-border px-5 py-3.5 font-mono-tech text-xs tracking-[0.15em] text-muted-foreground transition-all duration-200 hover:border-cyber hover:text-cyber sm:w-auto sm:px-8"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              → DOWNLOAD RESUME
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={fadeUp} className="mt-8 flex max-w-4xl flex-wrap items-center gap-3">
            {heroSocials.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 border border-border px-3 py-2 font-mono-tech text-[10px] tracking-[0.14em] text-muted-foreground transition-all duration-200 hover:border-cyber hover:text-cyber"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{link.label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Technical metadata */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex max-w-2xl flex-wrap justify-start gap-8 border-t border-border pt-6"
          >
            {[
              { label: "CHALLENGES SOLVED", value: "1,000+" },
              { label: "LATENCY REDUCTION", value: "50%" },
              { label: "SYSTEM UPTIME", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="text-left">
                <div className="font-mono-tech text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.aside
          variants={fadeUp}
          className="hidden self-center border border-border bg-card/25 p-6 backdrop-blur-sm lg:block"
        >
          <div className="font-mono-tech text-[10px] tracking-[0.18em] text-muted-foreground">// RIGHT PANEL</div>
          <div className="mt-4 space-y-4">
            <div className="border border-border/70 p-4">
              <div className="font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">ACHIEVEMENTS</div>
              <div className="mt-2 font-mono-tech text-sm text-foreground">1,000+ Algorithmic Challenges</div>
            </div>
            <div className="border border-border/70 p-4">
              <div className="font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">CURRENT FOCUS</div>
              <div className="mt-2 font-mono-tech text-sm text-foreground">LLM Orchestration and Runtime Reliability</div>
            </div>
            <div className="border border-border/70 p-4">
              <div className="font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">PRIMARY STACK</div>
              <div className="mt-2 font-mono-tech text-sm text-foreground">React, TypeScript, Python, Cloud APIs</div>
            </div>
          </div>
        </motion.aside>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
