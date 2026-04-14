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
          I bridge the gap between robust software engineering and applied Artificial Intelligence. 
          With a foundational background in competitive programming—solving over{" "}
          <span className="font-mono-tech font-semibold text-foreground">1,000</span> algorithmic challenges—I 
          build production-grade systems where performance is a feature, not an afterthought.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 text-base leading-[1.8] text-slate-mid">
          My experience spans national-scale health platforms to AI-assisted logistics, always with 
          a focus on reducing latency, improving maintainability, and delivering measurable ROI.
        </motion.p>

        {/* Animated stats bar */}
        <motion.div variants={fadeUp} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Years Building", value: "3+" },
            { label: "Production Systems", value: "10+" },
            { label: "Team Collaboration", value: "Global" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="border border-border bg-card/30 p-4 text-center backdrop-blur-sm transition-colors hover:border-cyber/30"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="font-mono-tech text-xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1 font-mono-tech text-[9px] tracking-[0.15em] text-muted-foreground">{stat.label.toUpperCase()}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
