import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function FooterSection() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6 sm:py-12 lg:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6 sm:gap-8">
            <div>
              <span className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">GPA</span>
              <div className="font-mono-tech text-sm text-foreground">3.8/4.0</div>
            </div>
            <div>
              <span className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">CHALLENGES</span>
              <div className="font-mono-tech text-sm text-foreground">1,000+ (A2SV)</div>
            </div>
            <div>
              <span className="font-mono-tech text-[9px] tracking-[0.2em] text-muted-foreground">CERT</span>
              <div className="font-mono-tech text-sm text-foreground">OCI Gen AI Professional</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="font-mono-tech text-[10px] tracking-wider text-muted-foreground">
              (c) 2026 LISANEGEBRIEL ABAY KEBEDEW
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
