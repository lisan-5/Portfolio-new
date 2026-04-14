import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function AboutSection() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // EXECUTIVE SUMMARY
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          ABOUT<span className="text-cyber">.</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="text-base leading-[1.8] text-slate-mid">
          I&apos;m a Full-Stack AI Engineer focused on building scalable, production-ready systems that combine software engineering with applied artificial intelligence.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 text-base leading-[1.8] text-slate-mid">
          I specialize in designing backend systems, APIs, and AI-driven workflows especially around LLM integration, real-time systems, and performance optimization.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 text-base leading-[1.8] text-slate-mid">
          Over the past 3+ years, I&apos;ve built and contributed to production systems across healthcare, logistics, and developer tools, focusing on reliability, scalability, and measurable impact.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 text-base leading-[1.8] text-slate-mid">
          My foundation in algorithms and problem-solving (1,000+ challenges solved) shapes how I design systems always optimized for performance, edge cases, and long-term maintainability.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 text-base leading-[1.8] text-slate-mid">
          Right now, I&apos;m focused on building intelligent systems that move beyond prototypes and actually work in real-world production environments.
        </motion.p>
      </motion.div>
    </section>
  );
}
