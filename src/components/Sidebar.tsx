import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { num: "01", label: "INDEX", target: "hero" },
  { num: "02", label: "ABOUT", target: "about" },
  { num: "03", label: "STACK", target: "skills" },
  { num: "04", label: "LOGS", target: "projects" },
  { num: "05", label: "EXPERIENCE", target: "experience" },
  { num: "06", label: "CONTACT", target: "contact" },
];

export function Sidebar() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);

      // Scroll spy
      const sections = navItems.map((n) => n.target);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < 200) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (target: string) => {
    setActive(target);
    const el = document.getElementById(target);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="fixed left-0 top-0 z-50 hidden h-screen w-16 flex-col items-center justify-between border-r border-border bg-background/80 py-8 backdrop-blur-md lg:flex"
        >
          {/* Name mark */}
          <div className="font-mono-tech text-[10px] tracking-widest text-muted-foreground" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            LISANEGEBRIEL.DEV
          </div>

          {/* Navigation */}
          <nav className="flex flex-col items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                className="group relative flex flex-col items-center gap-0.5"
                title={item.label}
              >
                <span className={`font-mono-tech text-[9px] tracking-wider transition-colors duration-200 ${active === item.target ? "text-cyber" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {item.num}
                </span>
                <span
                  className={`font-mono-tech text-[7px] tracking-[0.2em] transition-colors duration-200 ${active === item.target ? "text-cyber" : "text-muted-foreground group-hover:text-foreground"}`}
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  {item.label}
                </span>
                {active === item.target && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute -right-[17px] top-0 h-full w-px bg-cyber"
                    transition={{ duration: 0.2, ease: "easeOut" as const }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex flex-col items-center gap-3">
            <a href="https://github.com/lisan-5" target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[9px] tracking-wider text-muted-foreground transition-colors duration-200 hover:text-cyber" style={{ writingMode: "vertical-rl" }}>
              GH
            </a>
            <a href="https://linkedin.com/in/lisanegebriel-abay" target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[9px] tracking-wider text-muted-foreground transition-colors duration-200 hover:text-cyber" style={{ writingMode: "vertical-rl" }}>
              LI
            </a>
            <a href="https://t.me/ligator" target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[9px] tracking-wider text-muted-foreground transition-colors duration-200 hover:text-cyber" style={{ writingMode: "vertical-rl" }}>
              TG
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
