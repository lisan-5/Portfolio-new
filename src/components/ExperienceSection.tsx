import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Haddis Art",
    period: "09/2025 – PRESENT",
    highlights: [
      "Lead developer for 'Teninete' (National Health Platform), implementing scalable architectures.",
      "Optimized backend integration, reducing system maintenance overhead.",
      "Achieved 50% reduction in data access latency, maintained 99.9% uptime.",
    ],
  },
  {
    role: "AI & Full-Stack Engineer",
    company: "Spotter AI",
    period: "09/2025 – 01/2026",
    highlights: [
      "Architected RESTful APIs and backend logic to sync 4+ core modules in real-time.",
      "Delivered live route visualization and compliance snapshots for freight management.",
      "Cut operational friction through HOS compliance systems.",
    ],
  },
  {
    role: "AI Trainer (Python & LLM Evaluation)",
    company: "Eaglepoint",
    period: "01/2025 – 10/2025",
    highlights: [
      "Refined AI-generated Python logic for efficiency and algorithmic correctness.",
      "Authored optimized reference solutions for complex data structures and graph-based challenges.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Tewanay Engineering",
    period: "05/2025 – 09/2025",
    highlights: [
      "Accelerated feature delivery by 40% through optimized UI/Backend integration.",
      "Reduced page load times by 50% by refining UI rendering and data handling.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32 px-8 lg:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // PROFESSIONAL TRAJECTORY
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          EXPERIENCE<span className="text-cyber">.</span>
        </motion.h2>

        <div className="relative">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyber/50 via-border to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative pl-10"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Branch node */}
                <motion.div
                  className="absolute left-[5px] top-1.5 h-[12px] w-[12px] border border-cyber bg-background"
                  whileHover={{ scale: 1.3, backgroundColor: "var(--cyber)" }}
                  transition={{ duration: 0.2 }}
                />
                <div className="absolute left-[11px] top-[10px] h-px w-5 bg-border" />

                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                    <span className="font-mono-tech text-[11px] tracking-wider text-cyber">@ {exp.company}</span>
                  </div>
                  <div className="mt-1 font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">
                    {exp.period}
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-mid">
                        <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 bg-cyber/50" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
