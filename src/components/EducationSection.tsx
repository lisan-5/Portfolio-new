import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function EducationSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-4 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // EDUCATIONAL & ALGORITHMIC FOUNDATION
        </motion.div>
        <motion.h2 variants={fadeUp} className="mb-12 text-3xl font-bold tracking-tight text-foreground">
          FOUNDATION<span className="text-cyber">.</span>
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div variants={fadeUp} className="border-glow p-6">
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">DEGREE</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">BSc. Computer Science</h3>
            <p className="mt-1 text-sm text-slate-mid">Addis Ababa University</p>
            <div className="mt-3 font-mono-tech text-2xl font-bold text-foreground">3.8<span className="text-sm text-muted-foreground">/4.0</span></div>
          </motion.div>

          <motion.div variants={fadeUp} className="border-glow p-6">
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">A2SV</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">Africa To Silicon Valley</h3>
            <p className="mt-1 text-sm text-slate-mid">Mastered DSA, solving 1,000+ challenges</p>
            <div className="mt-3 font-mono-tech text-sm text-muted-foreground">LeetCode // Codeforces</div>
          </motion.div>

          <motion.div variants={fadeUp} className="border-glow p-6">
            <div className="font-mono-tech text-[10px] tracking-[0.2em] text-cyber">CERTIFICATION</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">OCI Generative AI</h3>
            <p className="mt-1 text-sm text-slate-mid">Oracle Cloud Infrastructure — 2025 Certified</p>
            <div className="mt-3 font-mono-tech text-sm text-muted-foreground">Professional Level</div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
