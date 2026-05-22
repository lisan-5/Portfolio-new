import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const floatIn = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stacks = [
  {
    label: "PROGRAMMING & BACKEND",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "PHP", "SQL", "Node.js", "Express.js", "FastAPI", "Laravel", "REST APIs", "System Design"],
  },
  {
    label: "AI / MACHINE LEARNING",
    items: ["Artificial Intelligence", "Machine Learning", "LLM Integration", "Prompt Engineering", "NLP Pipelines", "AI Automation", "NumPy", "Pandas", "Scikit-learn", "Model Evaluation"],
  },
  {
    label: "TOOLS & PLATFORMS",
    items: ["Docker", "Git", "GitHub", "Linux", "Bash", "Postman", "VS Code", "CI/CD", "PostgreSQL", "MySQL", "Firebase", "Jira", "Cloud Deployment"],
  },
  {
    label: "FOUNDATIONS",
    items: ["Data Structures", "Algorithms", "Graphs", "Dynamic Programming", "Recursion", "Operating Systems", "Databases", "Networking", "Competitive Programming"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,200,220,0.06),transparent_38%)]" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
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
              variants={floatIn}
              className="group border border-border bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyber/40 hover:shadow-[0_14px_40px_rgba(120,200,220,0.05)]"
              whileHover={{ y: -6, rotateX: 4 }}
            >
              <div className="mb-4 font-mono-tech text-[10px] tracking-[0.2em] text-cyber">
                {stack.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {stack.items.map((item) => (
                  <motion.span
                    key={item}
                    className="border border-border px-3 py-1.5 font-mono-tech text-[11px] tracking-wider text-slate-mid transition-all duration-200 hover:border-cyber/50 hover:text-foreground"
                    whileHover={{ scale: 1.06, y: -1 }}
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
