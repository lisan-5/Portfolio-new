import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Code2, Download, Github, Linkedin, Mail, Phone, Send, Twitter } from "lucide-react";

const transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition },
};

const heroSocials = [
  { label: "GitHub", hint: "Code", href: "https://github.com/lisan-5", external: true, icon: Github, accent: "hover:border-violet-600 hover:bg-violet-600/10 hover:text-violet-700 dark:hover:border-violet-300 dark:hover:bg-violet-300/10 dark:hover:text-violet-100" },
  { label: "LinkedIn", hint: "Profile", href: "https://linkedin.com/in/lisanegebriel-abay", external: true, icon: Linkedin, accent: "hover:border-sky-600 hover:bg-sky-600/10 hover:text-sky-700 dark:hover:border-sky-300 dark:hover:bg-sky-300/10 dark:hover:text-sky-100" },
  { label: "Email", hint: "Contact", href: "mailto:lisan5abay@gmail.com", external: false, icon: Mail, accent: "hover:border-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-700 dark:hover:border-emerald-300 dark:hover:bg-emerald-300/10 dark:hover:text-emerald-100" },
  { label: "Telegram", hint: "Chat", href: "https://t.me/ligator", external: true, icon: Send, accent: "hover:border-cyan-600 hover:bg-cyan-600/10 hover:text-cyan-700 dark:hover:border-cyan-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100" },
  { label: "LeetCode", hint: "DSA", href: "https://leetcode.com/u/lisanx/", external: true, icon: Code2, accent: "hover:border-amber-600 hover:bg-amber-600/10 hover:text-amber-700 dark:hover:border-amber-300 dark:hover:bg-amber-300/10 dark:hover:text-amber-100" },
  { label: "X", hint: "Updates", href: "https://x.com/lisanabay", external: true, icon: Twitter, accent: "hover:border-slate-700 hover:bg-slate-700/10 hover:text-slate-900 dark:hover:border-slate-200 dark:hover:bg-slate-200/10 dark:hover:text-white" },
  { label: "Phone", hint: "Call", href: "tel:+251964011087", external: false, icon: Phone, accent: "hover:border-rose-600 hover:bg-rose-600/10 hover:text-rose-700 dark:hover:border-rose-300 dark:hover:bg-rose-300/10 dark:hover:text-rose-100" },
] as const;

export function HeroSection() {
  const [isLightTheme, setIsLightTheme] = useState(() => document.documentElement.classList.contains("light"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightTheme(document.documentElement.classList.contains("light"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-16"
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 18, 0], opacity: [0.35, 0.65, 0.35] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(125,211,252,0.10),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.08),transparent_36%)]" />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl text-left"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="font-mono-tech text-[10px] tracking-[0.2em] text-cyan-700/85 dark:text-cyan-200/75"
          >
            // FULL-STACK & AI ENGINEER
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-3 font-mono-tech text-sm tracking-[0.14em] text-foreground sm:text-base lg:text-lg"
          >
            I&apos;M{" "}
            <span
              className={`text-3xl font-bold sm:text-4xl ${isLightTheme ? "text-black" : "text-white"}`}
            >
              LISANEGEBRIEL ABAY
            </span>
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-3xl text-[clamp(1.9rem,7vw,4rem)] font-bold leading-[1.04] tracking-tight sm:text-[clamp(2.2rem,6vw,4rem)]"
          >
            <span className="bg-gradient-to-br from-slate-950 via-cyan-800 to-cyan-600 bg-clip-text text-transparent dark:from-white dark:via-sky-100 dark:to-cyan-300">
              FULL-STACK DEVELOPER
            </span>{" "}
            <span className="text-foreground/85">&</span>{" "}
            <span className="bg-gradient-to-br from-cyan-700 via-blue-700 to-slate-950 bg-clip-text text-transparent dark:from-cyan-100 dark:via-blue-200 dark:to-white">
              AI ENGINEER
            </span>
            <span className="text-cyber">.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl font-mono-tech text-sm leading-relaxed text-slate-mid dark:text-cyan-50/70 sm:text-[15px]"
          >
            Software Engineer | Full-Stack & AI Developer focused on scalable
           Systems,
            <br />
            LLM applications, intelligent automation, and high-performance
            platforms
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-start gap-4"
          >
            <motion.button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative w-full overflow-hidden rounded-xl border border-cyan-700/70 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 px-6 py-4 font-mono-tech text-xs font-black tracking-[0.18em] text-white shadow-[0_14px_40px_rgba(14,116,144,0.22)] transition-all duration-300 hover:border-cyan-500 hover:shadow-[0_18px_48px_rgba(14,116,144,0.28)] focus:outline-none focus:ring-4 focus:ring-cyan-300/35 dark:border-cyan-100/45 dark:from-cyan-200 dark:via-cyan-100 dark:to-sky-200 dark:text-slate-950 dark:shadow-[0_14px_40px_rgba(125,211,252,0.14)] sm:w-auto sm:px-9"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/55 dark:bg-white/80" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  {"\u2192"}
                </span>
                VIEW PROJECTS
              </span>
            </motion.button>
            <motion.a
              href="https://drive.google.com/file/d/1YuVKDNcG2NE4Xr_lJsZkHIBEF9SBDV41/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full overflow-hidden rounded-xl border border-cyan-700/45 bg-cyan-50 px-6 py-4 font-mono-tech text-xs font-black tracking-[0.18em] text-cyan-950 shadow-[0_14px_40px_rgba(14,116,144,0.18)] ring-1 ring-cyan-900/5 transition-all duration-300 hover:border-cyan-600/70 hover:bg-white hover:shadow-[0_18px_48px_rgba(14,116,144,0.22)] focus:outline-none focus:ring-4 focus:ring-cyan-300/35 dark:border-cyan-100/55 dark:bg-cyan-50 dark:text-slate-950 dark:shadow-[0_14px_40px_rgba(125,211,252,0.14)] dark:hover:bg-white sm:w-auto sm:px-9"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/80" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                {"\u2192"} DOWNLOAD RESUME
              </span>
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={fadeUp}
            className="mt-8 grid max-w-4xl grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-7"
          >
            {heroSocials.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`group flex items-center justify-center gap-3 border border-border bg-card/40 px-2 py-2 text-left text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(120,200,220,0.08)] sm:justify-start sm:px-3 sm:py-3 ${link.accent}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 text-center sm:text-left">
                  <span className="hidden font-mono-tech text-[11px] font-bold tracking-[0.14em] text-foreground group-hover:text-inherit sm:block">
                    {link.label}
                  </span>
                  <span className="hidden font-mono-tech text-[9px] tracking-[0.16em] text-muted-foreground sm:block">
                    {link.hint}
                  </span>
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>
    </section>
  );
}




