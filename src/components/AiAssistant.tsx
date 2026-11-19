import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X, RotateCcw } from "lucide-react";
import { SUGGESTED_PROMPTS } from "../lib/assistant-profile";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string };
type Status = "idle" | "streaming" | "offline";

const GREETING =
  "Ask me anything about Lisan — his experience, any landmark on this map, or how to reach him.";

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const busy = status === "streaming";

  useEffect(() => {
    if (open) {
      setUnseen(false);
      // Don't steal focus on touch devices — it yanks the keyboard open.
      if (window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      const history = [...messages, { id: nextId(), role: "user" as const, content: trimmed }];
      const replyId = nextId();

      setMessages([...history, { id: replyId, role: "assistant", content: "" }]);
      setInput("");
      setError(null);
      setStatus("streaming");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok || !res.body) {
          const payload = await res.json().catch(() => null);
          const message =
            payload?.message ?? "The assistant is unreachable right now.";
          setMessages(history);
          setError(message);
          setStatus(payload?.code === "not_configured" ? "offline" : "idle");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamError: string | null = null;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;

            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;

            try {
              const event = JSON.parse(payload) as {
                type: string;
                text?: string;
                message?: string;
              };
              if (event.type === "delta" && event.text) {
                const chunk = event.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === replyId ? { ...m, content: m.content + chunk } : m,
                  ),
                );
              } else if (event.type === "error") {
                streamError = event.message ?? "Something went wrong.";
              }
            } catch {
              // Ignore a partial frame; the next read completes it.
            }
          }
        }

        if (streamError) setError(streamError);
        // Drop empty assistant bubbles so a failed turn is easy to retry.
        setMessages((prev) => prev.filter((m) => m.id !== replyId || m.content));
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setMessages((prev) => prev.filter((m) => m.id !== replyId || m.content));
        } else {
          setMessages(history);
          setError("Connection dropped. Try that again.");
        }
      } finally {
        abortRef.current = null;
        // Never keep the composer locked after a transient Gemini failure —
        // "offline" is only for a missing server key (not_configured).
        setStatus((s) => (s === "offline" ? s : "idle"));
        if (!open) setUnseen(true);
      }
    },
    [busy, messages, open],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStatus("idle");
    inputRef.current?.focus();
  };


  // The field console can hand questions over: `ask what is vigil?`
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    const onAsk = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      setOpen(true);
      if (q) setTimeout(() => sendRef.current(q), 250);
    };
    window.addEventListener("atlas:ask", onAsk);
    return () => window.removeEventListener("atlas:ask", onAsk);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="guide-chip"
            onClick={() => setOpen(true)}
            aria-label="Open the guide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="group fixed bottom-4 right-16 z-[100] flex items-center gap-3 border border-cyber/60 bg-background/90 py-2 pl-2 pr-4 backdrop-blur-md transition-colors hover:border-cyber sm:bottom-6 sm:right-20"
          >
            <span className="relative grid h-8 w-8 place-items-center bg-cyber text-cyber-foreground">
              <CompassGlyph spinning={false} className="h-5 w-5 transition-transform duration-700 group-hover:rotate-[200deg]" />
              {unseen && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--water)] ring-2 ring-background" />}
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-map text-[17px] text-foreground">Ask the guide</span>
              <span className="mt-1 font-mono-tech text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground">
                ai · about lisan
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[99] bg-background/55 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            <motion.section
              aria-label="The guide"
              initial={{ opacity: 0, x: 40, clipPath: "inset(0 0 0 100%)" }}
              animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }}
              exit={{ opacity: 0, x: 30, clipPath: "inset(0 0 0 100%)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 bottom-3 top-20 z-[100] flex flex-col border border-input bg-background/95 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(640px,82svh)] sm:w-[460px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* faint contour study behind the notebook */}
              <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none" viewBox="0 0 460 640">
                {Array.from({ length: 9 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx={430}
                    cy={40}
                    rx={40 + i * 46}
                    ry={30 + i * 38}
                    fill="none"
                    stroke={i % 5 === 0 ? "var(--contour-index)" : "var(--contour)"}
                    strokeWidth={i % 5 === 0 ? 1.4 : 0.8}
                  />
                ))}
              </svg>
              {["-left-px -top-px border-l-2 border-t-2", "-right-px -top-px border-r-2 border-t-2", "-bottom-px -left-px border-b-2 border-l-2", "-bottom-px -right-px border-b-2 border-r-2"].map((c) => (
                <span key={c} className={`pointer-events-none absolute h-3 w-3 border-cyber ${c}`} />
              ))}

              {/* Header */}
              <header className="relative flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 pb-4 pt-5">
                <div className="flex items-center gap-3.5">
                  <span className="grid h-11 w-11 place-items-center border border-input text-cyber">
                    <CompassGlyph spinning={busy} className="h-7 w-7" />
                  </span>
                  <div>
                    <div className="font-map text-[26px] leading-none text-foreground">The guide</div>
                    <div className="mt-1.5 flex items-center gap-2 font-mono-tech text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span
                        className={
                          status === "offline" ? "h-1.5 w-1.5 rounded-full bg-muted-foreground" : "h-1.5 w-1.5 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)]"
                        }
                      />
                      {status === "offline" ? "offline" : busy ? "taking a bearing…" : "knows every landmark on this map"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      onClick={reset}
                      aria-label="Clear conversation"
                      title="New page"
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-cyber"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close the guide"
                    className="grid h-8 w-8 place-items-center text-muted-foreground transition-colors hover:text-cyber"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </header>

              {/* Transcript */}
              <div ref={scrollRef} className="relative min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {messages.length === 0 ? (
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="font-map text-[22px] leading-snug text-foreground"
                    >
                      {GREETING}
                    </motion.p>
                    <div className="map-label mt-7 text-[9px]">suggested waypoints</div>
                    <ol className="relative mt-3 space-y-1 border-l border-dashed border-input pl-5">
                      {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <motion.li
                          key={prompt}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
                          className="relative"
                        >
                          <span className="absolute -left-[25px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border border-cyber bg-background" />
                          <button
                            onClick={() => send(prompt)}
                            className="group flex w-full items-center justify-between gap-3 py-2 text-left text-[14px] text-slate-mid transition-colors hover:text-foreground"
                          >
                            <span>{prompt}</span>
                            <span className="font-mono-tech text-[10px] text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-cyber">
                              ↗
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  messages.map((message, i) => (
                    <MessageRow key={message.id} message={message} index={i} active={busy && i === messages.length - 1} />
                  ))
                )}

                {error && (
                  <div className="border border-destructive/40 bg-destructive/5 px-3.5 py-2.5 font-mono-tech text-[11px] leading-relaxed text-destructive">
                    {error}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                className="relative shrink-0 border-t border-border px-5 pb-4 pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <div className="flex items-end gap-3 border-b border-input pb-2 transition-colors focus-within:border-cyber">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    disabled={status === "offline"}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder={status === "offline" ? "the guide is offline" : "Ask about his work, a project, availability…"}
                    className="max-h-24 flex-1 resize-none border-none bg-transparent py-1.5 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || busy || status === "offline"}
                    aria-label="Send"
                    whileTap={{ scale: 0.92 }}
                    className="flex h-9 shrink-0 items-center gap-1.5 bg-cyber px-3 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-cyber-foreground transition-opacity disabled:opacity-30"
                  >
                    Plot <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </motion.button>
                </div>
                <div className="mt-2 flex justify-between font-mono-tech text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  <span>ai-generated · verify what matters</span>
                  <span className="hidden sm:inline">↵ send · esc close</span>
                </div>
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function CompassGlyph({ spinning, className }: { spinning: boolean; className?: string }) {
  return (
    <motion.svg
      viewBox="-12 -12 24 24"
      className={className}
      animate={spinning ? { rotate: [0, 40, -25, 360] } : { rotate: 0 }}
      transition={spinning ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
      aria-hidden
    >
      <circle r="10.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <path d="M0 -8 L2.4 0 L0 1.5 L-2.4 0 Z" fill="currentColor" />
      <path d="M0 8 L2.4 0 L0 -1.5 L-2.4 0 Z" fill="currentColor" fillOpacity="0.35" />
    </motion.svg>
  );
}

function MessageRow({ message, active, index }: { message: Message; active: boolean; index: number }) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="ml-8 border-l-2 border-cyber pl-3"
      >
        <div className="font-mono-tech text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          query {String(Math.floor(index / 2) + 1).padStart(2, "0")}
        </div>
        <div className="mt-1 text-[14px] leading-relaxed text-foreground">{message.content}</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mb-2 flex items-center gap-2 font-mono-tech text-[9px] uppercase tracking-[0.18em] text-cyber">
        <CompassGlyph spinning={active} className="h-3.5 w-3.5" />
        field note
      </div>
      <div className="text-[14px] leading-[1.75] text-slate-mid">
        {active && !message.content ? <Bearing /> : <RichText text={message.content} caret={active} />}
      </div>
    </motion.div>
  );
}

/** "Thinking" as concentric survey rings sweeping out. */
function Bearing() {
  return (
    <span className="relative inline-flex h-6 w-24 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-2 h-3 w-3 rotate-45 border border-cyber"
          animate={{ scale: [0.4, 2.2], opacity: [0.9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
        />
      ))}
      <span className="ml-8 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        taking a bearing
      </span>
    </span>
  );
}

function Caret() {
  return <span className="cursor-blink ml-0.5 text-cyber">|</span>;
}

type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };

/** The assistant only emits "- " bullets, **bold** and `code`, so parse that
 *  much by hand rather than shipping a markdown library to the browser. */
function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];

  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const last = blocks[blocks.length - 1];

    if (bullet) {
      if (last?.kind === "ul") last.items.push(bullet[1]);
      else blocks.push({ kind: "ul", items: [bullet[1]] });
    } else if (line.trim()) {
      blocks.push({ kind: "p", text: line });
    }
  }

  return blocks;
}

function RichText({ text, caret }: { text: string; caret?: boolean }) {
  const blocks = parseBlocks(text);

  return (
    <>
      {blocks.map((block, i) => {
        // The caret trails the very last glyph, so it rides along while text
        // streams in and disappears the moment the turn finishes.
        const isLast = i === blocks.length - 1;

        if (block.kind === "ul") {
          return (
            <ul key={i} className="my-1.5 space-y-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[0.55rem] inline-block h-1 w-1 shrink-0 bg-cyber/60" />
                  <span>
                    {inline(item)}
                    {caret && isLast && j === block.items.length - 1 && <Caret />}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="[&+p]:mt-2">
            {inline(block.text)}
            {caret && isLast && <Caret />}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string): React.ReactNode[] {
  // Split on **bold** and `code`, keeping the delimiters as capture groups.
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={i}
          className="rounded border border-border/70 bg-background/60 px-1 py-px font-mono-tech text-[11px] text-cyber"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
