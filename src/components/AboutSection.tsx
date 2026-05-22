import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const slideWide = {
  hidden: { opacity: 0, x: -28, filter: "blur(8px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-16 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber/40 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-cyber/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-56 w-56 rounded-full bg-cyber/5 blur-3xl" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-2 font-mono-tech text-[10px] tracking-[0.2em] text-muted-foreground">
          // EXECUTIVE SUMMARY
        </motion.div>
        <motion.h2 variants={slideWide} className="mb-8 text-3xl font-bold tracking-tight text-foreground">
          ABOUT<span className="text-cyber">.</span>
        </motion.h2>
        <motion.p variants={slideWide} className="max-w-4xl text-base leading-[1.9] text-slate-mid">
          I&apos;m a Full-Stack & AI Engineer focused on building scalable backend systems, AI-powered applications, and high-performance web platforms that turn ambitious ideas into reliable production software.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-base leading-[1.9] text-slate-mid">
          My work spans API design, LLM integrations, intelligent automation, real-time platforms, logistics systems, healthcare products, and scalable data-driven applications using Python, TypeScript, FastAPI, Node.js, Laravel, React, and Next.js.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-base leading-[1.9] text-slate-mid">
          I enjoy solving complex engineering problems, optimizing architectures, and building tools that improve efficiency, user experience, and long-term maintainability.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "EXPERIENCE", text: "Production systems across startups, AI teams, healthcare, logistics, and geospatial platforms." },
            { title: "FOCUS", text: "Scalable backend systems, LLM applications, REST APIs, automation, and full-stack products." },
            { title: "APPROACH", text: "Performance-first architecture, reliability, maintainability, and measurable real-world impact." },
          ].map((item) => (
            <motion.div
              key={item.title}
              className="border border-border bg-card/30 p-6 backdrop-blur-sm"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-mono-tech text-[10px] tracking-[0.18em] text-cyber">{item.title}</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-mid">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
