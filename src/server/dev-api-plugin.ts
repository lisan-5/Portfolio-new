import type { Plugin } from "vite";
import { loadEnv } from "vite";

/**
 * Serves /api/chat during `vite dev`.
 *
 * In production Vercel runs api/chat.ts as a function; the dev server has no
 * such layer, so this bridges Node's req/res to the same Web-standard handler.
 * The handler is loaded through ssrLoadModule so edits to it hot-reload.
 */
export function devApiPlugin(): Plugin {
  return {
    name: "assistant-dev-api",
    apply: "serve",

    config(_config, { mode }) {
      loadServerEnv(mode);
    },

    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          // Re-read .env on each request. Reading it only at startup meant a
          // key pasted into .env while the dev server was already running was
          // silently ignored, and the endpoint kept reporting "not set".
          loadServerEnv(server.config.mode);

          const body = await readBody(req);
          const request = new Request("http://localhost/api/chat", {
            method: req.method ?? "POST",
            headers: toHeaders(req.headers),
            // Buffer is a Uint8Array at runtime, but only the latter is a BodyInit.
            body: body.length > 0 ? new Uint8Array(body) : undefined,
          });

          const mod = (await server.ssrLoadModule("/src/server/chat-handler.ts")) as {
            handleChatRequest: (request: Request) => Promise<Response>;
          };
          const response = await mod.handleChatRequest(request);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));

          if (!response.body) {
            res.end();
            return;
          }

          const reader = response.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (error) {
          server.config.logger.error(`[assistant-dev-api] ${String(error)}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
          }
          res.end(
            JSON.stringify({ code: "dev_error", message: "Dev API handler failed." }),
          );
        }
      });
    },
  };
}

/**
 * Vite only exposes VITE_* vars to the client and never populates process.env.
 * Load the unprefixed ones so server code reads the key from .env locally the
 * same way it reads it from Vercel's environment in production.
 */
function loadServerEnv(mode: string): void {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["GEMINI_API_KEY", "GEMINI_MODEL"]) {
    // Only overwrite from a non-empty .env value, so a var exported in the
    // shell still wins over a blank line in the file.
    if (env[key]) process.env[key] = env[key];
  }
}

function readBody(req: { on: NodeJS.ReadableStream["on"] }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function toHeaders(nodeHeaders: Record<string, string | string[] | undefined>): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else if (value !== undefined) headers.set(key, value);
  }
  return headers;
}
