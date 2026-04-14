import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

const COMMANDS: Record<string, string[]> = {
  help: ["Available commands:", "  contact    - Show contact info", "  projects   - List featured projects", "  skills     - Show tech stack", "  about      - Brief summary", "  social     - Social links", "  clear      - Clear terminal"],
  contact: [
    "// CONTACT INFO",
    "Email:    lisan5abay@gmail.com",
    "Phone:    +251964011087",
    "GitHub:   github.com/lisan-5",
    "LinkedIn: linkedin.com/in/lisanegebriel-abay",
    "Telegram: @ligator",
    "X:        @lisanabay",
  ],
  social: [
    "// SOCIAL LINKS",
    "LinkedIn:  linkedin.com/in/lisanegebriel-abay",
    "GitHub:    github.com/lisan-5",
    "Telegram:  t.me/ligator",
    "LeetCode:  leetcode.com/u/lisanx",
    "X:         x.com/lisanabay",
  ],
  projects: [
    "// FEATURED PROJECTS",
    "[01] Snowlink    - AI Agent | Snowflake Sync",
    "[02] Spotter     - AI Logistics & Routing",
    "[03] Teninete    - National Health Platform",
  ],
  skills: [
    "// LOADED MODULES",
    "AI:   LLM Integration, Prompt Engineering, NLP",
    "Core: TypeScript, Next.js, Node.js, Python, Java",
    "Ops:  Docker, CI/CD, System Design, PostgreSQL",
  ],
  about: [
    "// LISANEGEBRIEL ABAY",
    "AI-Driven Full-Stack Engineer",
    "1,000+ algorithmic challenges solved",
    "BSc CS @ Addis Ababa University (3.8/4.0)",
  ],
};

export function TerminalConsole() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(["lisanegebriel.dev v1.0.0", 'Type "help" for available commands.', ""]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newLines = [...lines, `> ${input}`];

    if (cmd === "clear") {
      setLines([""]);
    } else if (COMMANDS[cmd]) {
      setLines([...newLines, ...COMMANDS[cmd], ""]);
    } else if (cmd) {
      setLines([...newLines, `Command not found: ${cmd}`, ""]);
    }
    setInput("");
  };

  return (
    <>
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-[100] flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-cyber hover:text-cyber sm:bottom-6 sm:left-6 lg:left-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Terminal className="h-3.5 w-3.5" />
          TERMINAL
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[99] bg-transparent"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              className="fixed bottom-4 left-4 z-[100] w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-obsidian/95 backdrop-blur-md sm:bottom-6 sm:left-6 sm:max-w-[calc(100vw-3rem)] lg:left-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <button onClick={() => setOpen(false)} className="h-3 w-3 rounded-full bg-red-500/80 transition-colors hover:bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-2 font-mono-tech text-[10px] tracking-[0.15em] text-muted-foreground">
                    terminal - lisanegebriel.dev
                  </span>
                </div>
              </div>

              <div ref={scrollRef} className="h-52 overflow-y-auto p-3">
                {lines.map((line, i) => (
                  <div key={i} className="font-mono-tech text-[11px] leading-5 text-slate-mid">
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex border-t border-border px-3 py-2.5">
                <span className="font-mono-tech text-[11px] text-cyber">&gt;</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="ml-2 flex-1 border-none bg-transparent font-mono-tech text-[11px] text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="type a command..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="cursor-blink font-mono-tech text-[11px] text-cyber">|</span>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
