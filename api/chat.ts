import { handleChatRequest } from "../src/server/chat-handler";

/**
 * Deployed entry point for the site assistant.
 *
 * Vercel serves files in /api as functions before applying the SPA rewrite in
 * vercel.json, so POST /api/chat lands here while every other path still falls
 * through to the client shell. Set GEMINI_API_KEY in the project's
 * environment variables.
 */
export const config = { runtime: "edge" };

export default function handler(request: Request): Promise<Response> {
  return handleChatRequest(request);
}
