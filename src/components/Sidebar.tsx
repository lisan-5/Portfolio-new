import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { num: "01", label: "INDEX", target: "hero" },
  { num: "02", label: "ABOUT", target: "about" },
  { num: "03", label: "EXPERIENCE", target: "experience" },
  { num: "04", label: "STACK", target: "skills" },
  { num: "05", label: "PROJECTS", target: "projects" },
  { num: "06", label: "EDUCATION", target: "education" },
  { num: "07", label: "CONTACT", target: "contact" },
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
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.aside
          initial={{ x: -80, opacity: 0, filter: "blur(10px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ x: -80, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.45, ease: "easeOut" as const }}
          className="fixed left-0 top-0 z-50 hidden h-screen w-16 flex-col items-center justify-between border-r border-cyan-200/15 bg-background/75 py-8 backdrop-blur-xl lg:flex"
        >
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(125,211,252,0.08),transparent_18%,transparent_82%,rgba(125,211,252,0.08))]"
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/70 to-cyan-200/0"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
          />
          {/* Name mark */}
          <motion.div
            className="relative z-10 font-mono-tech text-[10px] tracking-widest text-cyan-100/70"
            animate={{ letterSpacing: ["0.2em", "0.35em", "0.2em"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            LISANEGEBRIEL.DEV
          </motion.div>

          {/* Navigation */}
          <nav className="relative z-10 flex flex-col items-center gap-5">
            {navItems.map((item) => (
              <motion.button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                className="group relative flex flex-col items-center gap-0.5"
                title={item.label}
                whileHover={{ scale: 1.08, x: 2 }}
              >
                <span className={`font-mono-tech text-[9px] tracking-wider transition-colors duration-200 ${active === item.target ? "text-cyan-100" : "text-cyan-100/45 group-hover:text-cyan-100"}`}>
                  {item.num}
                </span>
                <span
                  className={`font-mono-tech text-[7px] tracking-[0.2em] transition-colors duration-200 ${active === item.target ? "text-cyan-100" : "text-cyan-100/45 group-hover:text-cyan-100"}`}
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  {item.label}
                </span>
                {active === item.target && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute -right-[17px] top-0 h-full w-px bg-gradient-to-b from-cyan-100 via-cyan-300 to-transparent"
                    transition={{ duration: 0.25, ease: "easeOut" as const }}
                  />
                )}
                <motion.div className="absolute -right-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan-200/0 group-hover:bg-cyan-200" />
              </motion.button>
            ))}
          </nav>

          {/* Social links */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <a href="https://github.com/lisan-5" target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[9px] tracking-wider text-cyan-100/55 transition-all duration-200 hover:text-cyan-100" style={{ writingMode: "vertical-rl" }}>
              GH
            </a>
            <a href="https://linkedin.com/in/lisanegebriel-abay" target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[9px] tracking-wider text-cyan-100/55 transition-all duration-200 hover:text-cyan-100" style={{ writingMode: "vertical-rl" }}>
              LI
            </a>
            <a href="https://t.me/ligator" target="_blank" rel="noopener noreferrer" className="font-mono-tech text-[9px] tracking-wider text-cyan-100/55 transition-all duration-200 hover:text-cyan-100" style={{ writingMode: "vertical-rl" }}>
              TG
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
