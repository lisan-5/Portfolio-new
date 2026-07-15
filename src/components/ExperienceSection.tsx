import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const experiences = [
  {
    role: "Software Engineer",
    company: "Theseus Group",
    href: "https://adaptwith.us/",
    period: "01/2026 - Present",
    stack: ["LLMOps", "Docker", "APIs", "Automation"],
    highlights: [
      "Built scalable AI-powered backend systems and automation workflows supporting internal business operations and intelligent decision-making processes.",
      "Developed high-performance APIs and asynchronous backend services, improving processing efficiency and reducing workflow execution times by ~40%.",
      "Integrated LLM-powered automation pipelines and AI-assisted tooling, streamlining repetitive operational tasks and improving system scalability.",
      "Collaborated across engineering and strategy teams to deliver production-ready backend solutions focused on reliability, maintainability, and long-term scalability.",
    ],
  },
  {
    role: "AI & Full-Stack Engineer",
    company: "Spotter AI",
    href: "https://spotter.ai/",
    period: "08/2025 - 04/2026",
    stack: ["Laravel", "React", "REST APIs", "Routing"],
    highlights: [
      "Built Spotter Atlas, an AI-assisted freight routing platform with 100% HOS compliance across routing and scheduling workflows.",
      "Developed scalable RESTful APIs and synchronized backend systems across 4+ core operational modules in real time.",
      "Reduced route calculation and planning time by ~50% through intelligent routing logic and optimized backend workflows.",
      "Delivered live route visualization, itinerary generation, compliance snapshots, and PDF export functionality, reducing manual planning effort by ~60%.",
    ],
  },
  {
    role: "Full-stack Developer",
    company: "Haddis Art",
    href: "https://haddisart.com/",
    period: "07/2025 - 01/2026",
    stack: ["Laravel", "React", "REST APIs", "CI/CD"],
    highlights: [
      "Developed scalable web applications for Teninete, a national-level healthcare platform, using React and Laravel, supporting thousands of daily users.",
      "Re-architected database schemas and CI/CD deployment workflows, reducing data access latency by ~50% and improving long-term maintainability.",
      "Collaborated with cross-functional engineering and product teams to deliver high-traffic platform features with 99.9% uptime and strong system reliability.",
      "Optimized frontend/backend integration and rendering performance, significantly improving responsiveness and overall user experience across core workflows.",
    ],
  },
  {
    role: "Full-stack Developer",
    company: "Brana Software Solution",
    href: "https://et.linkedin.com/company/brana-tech",
    period: "06/2024 - 07/2025",
    stack: ["React", "JavaScript", "REST APIs", "Geospatial"],
    highlights: [
      "Contributed to production-ready geospatial software solutions supporting 1,000+ mapped entities and location-based workflows.",
      "Developed and maintained RESTful APIs and scalable database systems powering interactive mapping and visualization features.",
      "Improved data handling and backend query performance, helping optimize application responsiveness and usability.",
      "Collaborated with senior engineers on full-stack development tasks, deployment workflows, and production system improvements.",
    ],
  },
  {
    role: "Back End Developer",
    company: "Ambalay Maps",
    href: "https://www.ambalaymaps.com",
    period: "11/2022 - 12/2024",
    stack: ["REST APIs", "Geospatial", "Databases", "Routing"],
    highlights: [
      "Developed scalable backend services and RESTful APIs powering geocoding, routing, trip tracking, and location intelligence features.",
      "Designed and optimized database schemas and backend logic to efficiently process geospatial data and support high-performance API requests.",
      "Built secure, maintainable backend systems that enabled real-time location services, route optimization, and travel-time calculations.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="mx-auto w-full max-w-6xl">
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // PROFESSIONAL EXPERIENCE
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          EXPERIENCE<span className="text-cyber">.</span>
        </motion.h2>
        <div className="relative">
          <div className="absolute left-3 top-0 hidden h-full w-px bg-gradient-to-b from-cyber/70 via-border to-transparent md:block" />
          <div className="space-y-6 md:space-y-8">
            {experiences.map((exp, i) => (
              <motion.a key={i} href={exp.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 48, scale: 0.96, rotateX: -8 }} whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55, delay: i * 0.06, ease: "easeOut" as const }} className="group relative block md:pl-12" style={{ zIndex: experiences.length - i }} whileHover={{ y: -8, scale: 1.015 }}>
                <motion.div className="absolute left-[5px] top-8 hidden h-[12px] w-[12px] border border-cyber bg-background shadow-[0_0_18px_rgba(120,200,220,0.35)] md:block" whileInView={{ scale: [0.7, 1.35, 1], backgroundColor: ["transparent", "var(--cyber)", "var(--background)"] }} viewport={{ once: true }} transition={{ duration: 0.2 }} />
                <div className="absolute left-[11px] top-[38px] hidden h-px w-8 bg-border transition-colors group-hover:bg-cyber md:block" />
                <div className="relative overflow-hidden border border-border bg-card/45 p-5 backdrop-blur-sm transition-all duration-300 group-hover:border-cyber/60 group-hover:bg-card/70 group-hover:shadow-[0_18px_60px_rgba(120,200,220,0.08)] sm:p-6 md:p-7">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyber/10 blur-3xl" /></div>
                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div><div className="flex flex-wrap items-baseline gap-3"><h3 className="text-xl font-bold text-foreground">{exp.role}</h3><span className="font-mono-tech text-[11px] tracking-wider text-cyber">@ {exp.company}</span></div><div className="mt-1 font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">{exp.period}</div></div>
                    <span className="border border-border px-3 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-muted-foreground transition-colors group-hover:border-cyber group-hover:text-cyber">VISIT COMPANY {"\u2197"}</span>
                  </div>
                  <div className="relative mt-5 flex flex-wrap gap-2">{exp.stack.map((tech) => <span key={tech} className="border border-border/60 bg-background/40 px-2.5 py-1 font-mono-tech text-[10px] tracking-wider text-slate-mid transition-colors group-hover:border-cyber/40 group-hover:text-foreground">{tech}</span>)}</div>
                  <ul className="relative mt-5 grid gap-2 md:grid-cols-2">{exp.highlights.map((h, j) => <li key={j} className="flex items-start gap-2 text-sm text-slate-mid"><span className="mt-2 inline-block h-1 w-1 flex-shrink-0 bg-cyber/50" />{h}</li>)}</ul>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
