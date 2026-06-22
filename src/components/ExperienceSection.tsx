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
    period: "11/2025 - Present",
    stack: ["Python", "FastAPI", "LLMs", "Automation"],
    highlights: [
      "Built scalable AI-powered backend systems and automation workflows for internal business operations and intelligent decision-making.",
      "Designed high-performance REST APIs and asynchronous services using Python and FastAPI, improving execution efficiency by ~40%.",
      "Integrated LLM-based automation pipelines to reduce repetitive tasks and improve system scalability.",
      "Collaborated with engineering and strategy teams to deliver production-ready backend systems focused on reliability and maintainability.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Haddis Art",
    href: "https://haddisart.com/",
    period: "09/2025 - 2026",
    stack: ["React", "Laravel", "CI/CD", "Healthcare"],
    highlights: [
      "Developed and maintained Teninete, a national healthcare platform serving thousands of daily users using React and Laravel.",
      "Re-architected database schemas and CI/CD workflows, reducing data access latency by ~50% and improving maintainability.",
      "Delivered high-traffic features with 99.9% uptime across production systems.",
      "Optimized frontend-backend integration, significantly improving performance and user experience.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Spotter AI",
    href: "https://spotter.ai/",
    period: "10/2025 - 02/2026",
    stack: ["Routing", "APIs", "Maps", "Compliance"],
    highlights: [
      "Developed scalable applications for a national health platform, improving system reliability and performance.",
      "Re-architected database schemas and deployment workflows, reducing data latency by 50%.",
      "Delivered high-traffic features with 99.9% uptime.",
      "Improved frontend-backend integration for better performance and UX.",
    ],
  },
  {
    role: "Backend Developer",
    company: "Kuraztech",
    href: "https://kuraztechnologies.com/",
    period: "06/2025 - 09/2025",
    stack: ["Laravel", "Auctions", "Payments", "Realtime"],
    highlights: [
      "Developed backend services for an auction platform handling products, bids, payments, and transactions.",
      "Optimized database queries and backend logic for high-performance and scalable operations.",
      "Integrated real-time bidding updates with frontend systems, improving responsiveness and UX.",
      "Ensured data consistency and secure transactional workflows.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Brana Software Solution",
    href: "https://et.linkedin.com/company/brana-tech",
    period: "08/2024 - 05/2025",
    stack: ["Node.js", "Express", "Geospatial", "Databases"],
    highlights: [
      "Built scalable Node.js and Express backend services for production-ready applications.",
      "Developed and maintained RESTful APIs and database systems for geospatial applications.",
      "Improved database query performance by ~3× through optimization and indexing strategies.",
      "Collaborated with senior engineers on deployment and full-stack feature development.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto w-full max-w-6xl"
      >
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
              <motion.a
                key={i}
                href={exp.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 48, scale: 0.96, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: "easeOut" as const }}
                className="group relative block md:pl-12"
                style={{ zIndex: experiences.length - i }}
                whileHover={{ y: -8, scale: 1.015 }}
              >
                <motion.div
                  className="absolute left-[5px] top-8 hidden h-[12px] w-[12px] border border-cyber bg-background shadow-[0_0_18px_rgba(120,200,220,0.35)] md:block"
                  whileInView={{ scale: [0.7, 1.35, 1], backgroundColor: ["transparent", "var(--cyber)", "var(--background)"] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2 }}
                />
                <div className="absolute left-[11px] top-[38px] hidden h-px w-8 bg-border transition-colors group-hover:bg-cyber md:block" />

                <div className="relative overflow-hidden border border-border bg-card/45 p-5 backdrop-blur-sm transition-all duration-300 group-hover:border-cyber/60 group-hover:bg-card/70 group-hover:shadow-[0_18px_60px_rgba(120,200,220,0.08)] sm:p-6 md:p-7">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyber/10 blur-3xl" />
                  </div>
                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                        <span className="font-mono-tech text-[11px] tracking-wider text-cyber">@ {exp.company}</span>
                      </div>
                      <div className="mt-1 font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">
                        {exp.period}
                      </div>
                    </div>
                    <span className="border border-border px-3 py-1.5 font-mono-tech text-[10px] tracking-[0.16em] text-muted-foreground transition-colors group-hover:border-cyber group-hover:text-cyber">
                      VISIT COMPANY ↗
                    </span>
                  </div>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {exp.stack.map((tech) => (
                      <span key={tech} className="border border-border/60 bg-background/40 px-2.5 py-1 font-mono-tech text-[10px] tracking-wider text-slate-mid transition-colors group-hover:border-cyber/40 group-hover:text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <ul className="relative mt-5 grid gap-2 md:grid-cols-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-mid">
                        <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 bg-cyber/50" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
