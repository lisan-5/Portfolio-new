import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const liftCard = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const coursework = ["Data Structures & Algorithms", "Advanced Python", "AI & Machine Learning", "Operating Systems", "Database Systems", "Networking", "Computer Organization"];

const certifications = [
  "Machine Learning Foundations — Udemy",
  "Oracle Cloud Infrastructure 2025 Generative AI Professional",
  "Future Talent Development Bootcamp 2025",
];

export function EducationSection() {
  return (
    <section id="education" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber/30 to-transparent" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-4 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // EDUCATION & CERTIFICATIONS
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          EDUCATION<span className="text-cyber">.</span>
        </motion.h2>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr_0.9fr]">
          <motion.div variants={liftCard} className="border-glow p-6" whileHover={{ y: -6, scale: 1.02 }}>
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">DEGREE</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">BSc. in Computer Science</h3>
            <p className="mt-1 text-sm text-slate-mid">Addis Ababa University</p>
            <div className="mt-3 font-mono-tech text-sm text-muted-foreground">09/2022 - 06/2026 · Addis Ababa, Ethiopia</div>
            <p className="mt-4 text-sm leading-relaxed text-slate-mid">
              Built a strong foundation in algorithms, systems, databases, networking, and end-to-end software design through hands-on coursework and engineering projects.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {coursework.map((item) => (
                <span key={item} className="max-w-full break-words border border-border/60 bg-background/40 px-2.5 py-1 font-mono-tech text-[10px] tracking-wider text-slate-mid">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={liftCard} className="border-glow p-6" whileHover={{ y: -6, scale: 1.02 }}>
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">A2SV</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">Africa To Silicon Valley</h3>
            <p className="mt-1 text-sm text-slate-mid">Backed by Google</p>
            <div className="mt-3 font-mono-tech text-sm text-muted-foreground">03/2024 - 01/2025 · 1,000+ algorithmic challenges</div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-mid">
              <li>• Strengthened graph, dynamic programming, recursion, and advanced algorithmic problem solving.</li>
              <li>• Ranked among top performers while applying competitive-programming thinking to engineering problems.</li>
            </ul>
          </motion.div>

          <motion.div variants={liftCard} className="border-glow p-6" whileHover={{ y: -6, scale: 1.02 }}>
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">CERTIFICATION</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">AI & Cloud Credentials</h3>
            <p className="mt-1 text-sm text-slate-mid">Continuous learning across ML, generative AI, and engineering readiness.</p>
            <div className="mt-4 space-y-2">
              {certifications.map((item) => (
                <div key={item} className="border-l border-cyber/40 pl-3 text-sm leading-relaxed text-slate-mid">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={liftCard} className="mt-6 border border-border bg-card/30 p-6 backdrop-blur-sm" whileHover={{ y: -4 }}>
          <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">CAPSTONE PROJECT</div>
          <h3 className="mt-2 text-lg font-bold text-foreground">Intelligent Code Analysis System</h3>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-mid">
            Designed and implemented a Python-based system that evaluates algorithm efficiency and suggests optimizations using static analysis and rule-based heuristics.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
