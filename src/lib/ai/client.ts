import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Lazy singleton. Returns null when no key is configured so callers can
// fall back to the mock generators — never throws on a missing key.
let cached: Anthropic | null | undefined;

export function getAnthropicClient(): Anthropic | null {
  if (cached !== undefined) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  cached = apiKey ? new Anthropic({ apiKey }) : null;
  return cached;
}
