import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" as const } },
};

const footerStats = [
  { label: "FOCUS", value: "Backend + AI" },
  { label: "LOCATED IN", value: "Addis Ababa" },
  { label: "CONTACT", value: "Open via email" },
  { label: "STATUS", value: "Building & shipping" },
];

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-200/15 px-4 py-12 sm:px-6 sm:py-14 lg:px-16">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_28%)]"
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[120%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent"
        animate={{ x: ["-6%", "6%", "-6%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="relative mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-cyan-200/20 bg-cyan-200/5 px-3 py-1.5 font-mono-tech text-[10px] tracking-[0.22em] text-cyan-100/80">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(125,211,252,0.8)]" />
              AVAILABLE FOR SELECT PROJECTS
            </div>
            <h3 className="max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
              Building polished software with strong systems thinking and AI-native execution.
            </h3>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-mid dark:text-cyan-50/65">
              If you need backend systems, LLM workflows, product engineering, or scalable full-stack delivery, I&apos;m open to the right collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {footerStats.map((item, index) => (
              <motion.div
                key={item.label}
                className="border border-border/70 bg-card/30 p-4 backdrop-blur-sm"
                whileHover={{ y: -4, scale: 1.02 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" as const }}
              >
                <div className="font-mono-tech text-[9px] tracking-[0.2em] text-cyan-200/70">{item.label}</div>
                <div className="mt-2 text-sm font-medium text-foreground">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-cyan-200/10 pt-5 sm:flex-row sm:items-center sm:gap-4">
          <div className="font-mono-tech text-[10px] tracking-[0.18em] text-cyan-100/45">
            © 2026 LISANEGEBRIEL ABAY
          </div>
          <div className="font-mono-tech text-[10px] tracking-[0.18em] text-cyan-100/45">
            AI ENGINEER · FULL-STACK DEVELOPER
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
