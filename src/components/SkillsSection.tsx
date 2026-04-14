import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const stacks = [
  {
    label: "THE AI STACK",
    items: ["LLM Integration", "Prompt Engineering", "NLP Pipelines", "FastAPI", "Scikit-learn", "OCI Gen AI"],
  },
  {
    label: "THE CORE STACK",
    items: ["TypeScript", "Next.js", "Node.js", "Laravel", "Python", "Java", "PostgreSQL"],
  },
  {
    label: "ENGINEERING & DEVOPS",
    items: ["System Design", "Docker", "CI/CD", "DB Optimization", "Linux/Unix"],
  },
  {
    label: "FOUNDATIONS",
    items: ["Advanced Algorithms", "Graph Theory", "Neural Networks", "Real-time Systems"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // TECHNICAL ARSENAL
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          STACK<span className="text-cyber">.</span>
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2">
          {stacks.map((stack) => (
            <motion.div
              key={stack.label}
              variants={fadeUp}
              className="group border border-border bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyber/30 hover:shadow-[0_0_30px_rgba(120,200,220,0.03)]"
              whileHover={{ y: -2 }}
            >
              <div className="mb-4 font-mono-tech text-[10px] tracking-[0.2em] text-cyber">
                {stack.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {stack.items.map((item) => (
                  <motion.span
                    key={item}
                    className="border border-border px-3 py-1.5 font-mono-tech text-[11px] tracking-wider text-slate-mid transition-all duration-200 hover:border-cyber/50 hover:text-foreground"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
