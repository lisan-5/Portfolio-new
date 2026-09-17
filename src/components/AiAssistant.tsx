import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUp, X, RotateCcw } from "lucide-react";
import { SUGGESTED_PROMPTS } from "../lib/assistant-profile";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string };
type Status = "idle" | "streaming" | "offline";

const GREETING =
  "Ask me anything about Lisan — his experience, the projects on this page, or how to get in touch.";

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

  return (
    <>
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          aria-label="Open the AI assistant"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          className="group fixed bottom-4 right-16 z-[100] overflow-hidden rounded-full border border-cyan-700/50 bg-gradient-to-r from-cyan-700 via-cyan-600 to-sky-600 p-[1px] shadow-[0_12px_36px_-8px_rgba(14,116,144,0.45)] transition-shadow duration-300 hover:shadow-[0_16px_44px_-6px_rgba(14,116,144,0.55)] sm:bottom-6 sm:right-20 dark:border-cyan-100/35 dark:from-cyan-200 dark:via-cyan-100 dark:to-sky-200 dark:shadow-[0_12px_36px_-8px_rgba(125,211,252,0.22)]"
        >
          <span className="relative flex items-center gap-2.5 rounded-full bg-obsidian/95 px-3.5 py-2.5 backdrop-blur-md sm:px-4 dark:bg-obsidian/90">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600/30 to-sky-500/10 dark:from-cyan-200/25 dark:to-sky-200/10">
              <Sparkles className="h-3.5 w-3.5 text-cyber transition-transform duration-300 group-hover:rotate-12" />
              <motion.span
                className="absolute inset-0 rounded-full border border-cyber/40"
                animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-mono-tech text-[10px] font-bold tracking-[0.18em] text-foreground sm:tracking-[0.2em]">
                ASK AI
              </span>
              <span className="mt-0.5 font-mono-tech text-[8px] tracking-[0.16em] text-muted-foreground">
                ABOUT LISAN
              </span>
            </span>
            {unseen && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-cyber shadow-[0_0_10px_var(--color-cyber)] ring-2 ring-obsidian" />
            )}
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99] bg-background/50 backdrop-blur-[3px] sm:bg-background/20 sm:backdrop-blur-[1px]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 bottom-4 z-[100] flex max-h-[80svh] flex-col overflow-hidden rounded-2xl border border-cyan-700/30 bg-obsidian/95 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(56,189,220,0.06)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:max-w-[calc(100vw-3rem)] dark:border-cyan-100/20 dark:shadow-[0_28px_90px_-20px_rgba(0,0,0,0.7),0_0_40px_-12px_rgba(56,189,220,0.12)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Soft atmosphere behind the UI */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,116,144,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(56,189,220,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(125,211,252,0.1),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(56,189,220,0.05),transparent_50%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber/70 to-transparent"
              />

              {/* Header */}
              <div className="relative flex shrink-0 items-center justify-between border-b border-border/70 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-700/35 bg-gradient-to-br from-cyan-700/25 via-cyan-600/10 to-transparent dark:border-cyan-100/25 dark:from-cyan-200/20">
                    <Sparkles className="h-4 w-4 text-cyber" />
                    <span
                      className={
                        status === "offline"
                          ? "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-muted-foreground ring-2 ring-obsidian"
                          : "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)] ring-2 ring-obsidian"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono-tech text-[11px] font-bold tracking-[0.18em] text-foreground">
                      ASK.AI
                    </div>
                    <div className="mt-0.5 font-mono-tech text-[9px] tracking-[0.14em] text-muted-foreground">
                      {status === "offline"
                        ? "OFFLINE"
                        : busy
                          ? "THINKING…"
                          : "LISAN'S PORTFOLIO GUIDE"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {messages.length > 0 && (
                    <button
                      onClick={reset}
                      aria-label="Clear conversation"
                      title="Clear conversation"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card/60 hover:text-cyber"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close the assistant"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card/60 hover:text-cyber"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Transcript */}
              <div
                ref={scrollRef}
                className="relative min-h-[14rem] flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:min-h-[16rem]"
              >
                {messages.length === 0 ? (
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[13px] leading-relaxed text-slate-mid"
                    >
                      {GREETING}
                    </motion.p>
                    <div className="mt-5 flex flex-col gap-2">
                      {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <motion.button
                          key={prompt}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.28, delay: 0.08 + i * 0.05 }}
                          onClick={() => send(prompt)}
                          className="group flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/25 px-3.5 py-2.5 text-left font-mono-tech text-[11px] text-slate-mid transition-all duration-200 hover:border-cyber/50 hover:bg-card/55 hover:text-foreground hover:shadow-[0_8px_24px_-12px_rgba(56,189,220,0.35)]"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background/40 font-mono-tech text-[10px] text-cyber/70 transition-colors group-hover:border-cyber/40 group-hover:text-cyber">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message, i) => (
                    <MessageRow
                      key={message.id}
                      message={message}
                      active={busy && i === messages.length - 1}
                    />
                  ))
                )}

                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 font-mono-tech text-[11px] leading-relaxed text-destructive">
                    {error}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                className="relative shrink-0 border-t border-border/70 bg-background/20 px-3 pb-3.5 pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <div className="flex items-end gap-2 rounded-xl border border-border/80 bg-card/40 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors focus-within:border-cyber/45 focus-within:bg-card/55">
                  <span className="pb-1.5 font-mono-tech text-[12px] text-cyber">&gt;</span>
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
                    placeholder={
                      status === "offline" ? "assistant offline" : "ask about his work..."
                    }
                    className="max-h-24 flex-1 resize-none border-none bg-transparent py-1.5 font-mono-tech text-[12px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    spellCheck={false}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || busy || status === "offline"}
                    aria-label="Send message"
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-700/50 bg-gradient-to-br from-cyan-700 via-cyan-600 to-sky-600 text-white shadow-[0_6px_16px_-4px_rgba(14,116,144,0.45)] transition-opacity enabled:hover:brightness-110 disabled:opacity-35 dark:border-cyan-100/40 dark:from-cyan-200 dark:via-cyan-100 dark:to-sky-200 dark:text-slate-950 dark:shadow-[0_6px_16px_-4px_rgba(125,211,252,0.3)]"
                  >
                    <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </motion.button>
                </div>
                <div className="mt-2 px-1 font-mono-tech text-[8px] tracking-[0.14em] text-muted-foreground/65">
                  AI-GENERATED — VERIFY ANYTHING THAT MATTERS
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageRow({ message, active }: { message: Message; active: boolean }) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-end"
      >
        <div className="max-w-[88%] rounded-2xl rounded-br-md border border-cyan-700/25 bg-gradient-to-br from-cyan-700/15 via-card/60 to-card/40 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground dark:border-cyan-100/20 dark:from-cyan-200/10">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-border/40 bg-card/20 px-3.5 py-3"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-cyber/15">
          <Sparkles className="h-2.5 w-2.5 text-cyber" />
        </span>
        <span className="font-mono-tech text-[9px] tracking-[0.18em] text-cyber/85">
          LISAN.AI
        </span>
      </div>
      <div className="text-[13px] leading-[1.75] text-slate-mid">
        {active && !message.content ? (
          <ThinkingDots />
        ) : (
          <RichText text={message.content} caret={active} />
        )}
      </div>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-cyber"
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.05, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
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
