import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { num: "01", label: "INDEX", target: "hero" },
  { num: "02", label: "ABOUT", target: "about" },
  { num: "03", label: "STACK", target: "skills" },
  { num: "04", label: "LOGS", target: "projects" },
  { num: "05", label: "EXPERIENCE", target: "experience" },
  { num: "06", label: "CONTACT", target: "contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const scrollTo = (target: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-[60] flex flex-col gap-1.5 rounded-lg border border-border bg-background/80 p-2.5 backdrop-blur-sm sm:right-6 sm:top-6"
      >
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-px w-5 bg-foreground transition-all duration-200 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.target}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => scrollTo(item.target)}
                  className="font-mono-tech text-lg tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-cyber">{item.num}</span> // {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
