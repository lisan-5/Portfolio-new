import { GoogleGenAI, ApiError } from "@google/genai";
import { SYSTEM_PROMPT } from "../lib/assistant-profile";

/**
 * Web-standard handler for the site assistant, backed by the Gemini API.
 * Shared by the deployed serverless function (api/chat.ts) and the local dev
 * server (vite-plugins).
 *
 * The API key is read from the server environment and never reaches the
 * browser — the client only ever talks to this endpoint.
 */

/** Flash-Lite is the default: a separate free-tier quota from full Flash, and
 *  the model Google still opens to new API keys. Free-tier Flash is capped at
 *  ~20 req/day, which a few local reloads burn through. Override with
 *  GEMINI_MODEL if you want a different primary. */
const DEFAULT_MODEL = "gemini-3.5-flash-lite";

/** Tried in order when the primary model returns a quota/rate 429 or is
 *  unavailable. Each model has its own free-tier counter. */
const FALLBACK_MODELS = ["gemini-2.5-flash"];

/** Google's capacity blips show up as 503/429 on the first call. Retrying twice
 *  before any tokens have streamed turns most of them into a normal answer
 *  instead of an error in the visitor's face. */
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRY_BACKOFF_MS = [400, 1200];

/** Generous on purpose: when the model thinks before answering, that reasoning
 *  is charged against this budget, and a tight cap can return empty text. The
 *  system prompt, not this number, is what keeps answers short. */
const MAX_OUTPUT_TOKENS = 8192;

/** Guard rails for a public, unauthenticated endpoint backed by a paid API. */
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

type Role = "user" | "assistant";
type IncomingMessage = { role: Role; content: string };

/**
 * Best-effort, per-instance rate limiting. Serverless instances don't share
 * memory, so this thins out casual abuse rather than guaranteeing a ceiling.
 * Swap in a KV/Redis store if the site ever needs a hard limit.
 */
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

function errorResponse(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ code, message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function parseMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  if (raw.length > MAX_MESSAGES) return null;

  const parsed: IncomingMessage[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (!trimmed) return null;
    if (trimmed.length > MAX_CHARS_PER_MESSAGE) return null;

    parsed.push({ role, content: trimmed });
  }

  // Gemini requires the conversation to open with a user turn.
  if (parsed[0].role !== "user") return null;
  return parsed;
}

function sse(event: Record<string, unknown>): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function buildStreamRequest(model: string, messages: IncomingMessage[]) {
  return {
    model,
    // Gemini calls the assistant role "model".
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : ("user" as const),
      parts: [{ text: m.content }],
    })),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: 0.6,
      // Gemini 2.5 spends thinking tokens even on trivial questions, which
      // costs about a second of latency this widget doesn't need. Gemini 3
      // models use thinkingLevel instead and reject this field, so only send
      // it to the family that accepts it.
      ...(model.includes("2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  };
}

function isQuotaExhausted(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.status !== 429) return false;
  const body = error.message.toLowerCase();
  return (
    body.includes("quota") ||
    body.includes("resource_exhausted") ||
    body.includes("exceeded your current quota")
  );
}

/**
 * Opens the model stream, retrying transient upstream failures and falling
 * through to alternate models when a free-tier daily quota is exhausted.
 * Only safe to retry here because nothing has been written to the client yet.
 */
async function startStream(
  ai: GoogleGenAI,
  primaryModel: string,
  messages: IncomingMessage[],
) {
  const models = [
    primaryModel,
    ...FALLBACK_MODELS.filter((m) => m !== primaryModel),
  ];

  let lastError: unknown;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
    const model = models[modelIndex];
    const request = buildStreamRequest(model, messages);

    for (let attempt = 0; ; attempt++) {
      try {
        if (modelIndex > 0 && attempt === 0) {
          console.warn(`[assistant] falling back to model ${model}`);
        }
        return await ai.models.generateContentStream(request);
      } catch (error) {
        lastError = error;

        if (modelIndex === 0 && attempt === 0) {
          const detail =
            error instanceof ApiError
              ? `${error.status}: ${error.message.slice(0, 240)}`
              : String(error);
          console.warn(`[assistant] primary model ${model} failed — ${detail}`);
        }

        // Daily/model quota: try the next model instead of waiting on this one.
        if (isQuotaExhausted(error) && modelIndex < models.length - 1) break;

        const retryable =
          error instanceof ApiError && RETRY_STATUSES.has(error.status);
        if (!retryable || attempt >= RETRY_BACKOFF_MS.length) {
          if (modelIndex < models.length - 1 && error instanceof ApiError) break;
          throw error;
        }
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS[attempt]));
      }
    }
  }

  throw lastError;
}

export async function handleChatRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return errorResponse(405, "method_not_allowed", "Use POST.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse(
      503,
      "not_configured",
      "The assistant isn't connected yet — GEMINI_API_KEY is not set.",
    );
  }

  if (isRateLimited(clientKey(request))) {
    return errorResponse(429, "rate_limited", "Too many messages. Give it a minute.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "bad_request", "Expected a JSON body.");
  }

  const messages = parseMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return errorResponse(400, "bad_request", "Malformed or oversized message history.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(sse(event)));

      try {
        const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

        const response = await startStream(ai, model, messages);

        let sentAnything = false;
        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            sentAnything = true;
            send({ type: "delta", text });
          }
        }

        if (!sentAnything) {
          // Usually a safety block or an empty candidate.
          send({
            type: "error",
            message: "That one I can't answer. Try asking about his work instead.",
          });
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        let message = "The assistant hit an error. Try again in a moment.";

        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403) {
            message = "The assistant's API key is invalid or lacks access.";
          } else if (isQuotaExhausted(error)) {
            message =
              "Gemini free-tier quota is used up for today. Try again tomorrow, or enable billing / set GEMINI_MODEL to another model.";
          } else if (error.status === 429) {
            message = "The assistant is rate limited right now. Try again shortly.";
          }
          console.error(`[assistant] Gemini error ${error.status}:`, error.message);
        } else {
          console.error("[assistant] unexpected error:", error);
        }

        send({ type: "error", message });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
