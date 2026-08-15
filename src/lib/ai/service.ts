import "server-only";
import { getAnthropicClient } from "./client";
import {
  mockPowerRankings,
  mockReceipt,
  mockRivalryPreview,
  mockScoutingReport,
  mockWeeklyStory,
} from "./mock";
import type {
  PowerRankingsInput,
  ReceiptInput,
  RivalryPreviewInput,
  ScoutingReportInput,
  WeeklyStoryInput,
} from "./types";

const MODEL = "claude-opus-5";

const TONE_GUIDANCE: Record<string, string> = {
  espn: "Clever but clean — witty like a national broadcast, never mean-spirited.",
  locker_room: "Sarcastic and familiar, like a friend group that's mostly affectionate.",
  savage: "Nobody is safe. Sharp, funny, a little ruthless — but never cruel about anything off-limits.",
  custom: "Match the league's stated custom tone.",
};

async function complete(system: string, user: string, maxTokens = 500): Promise<string | null> {
  const client = getAnthropicClient();
  if (!client) return null;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      thinking: { type: "disabled" },
      output_config: { effort: "medium" },
      system,
      messages: [{ role: "user", content: user }],
    });
    const block = response.content.find((b) => b.type === "text");
    if (response.stop_reason === "refusal" || !block || block.type !== "text") return null;
    return block.text.trim();
  } catch {
    return null;
  }
}

function boundariesLine(boundaries?: string | null) {
  return boundaries
    ? `Off-limits — never joke about or reference: ${boundaries}.`
    : "No off-limits topics were specified, but stay tasteful.";
}

/**
 * The centerpiece of onboarding completion: a short, personality-forward
 * "scouting report" on a freshly-onboarded league, written in the league's
 * chosen tone. Falls back to a deterministic mock when no API key is
 * configured or the live call fails/refuses.
 */
export async function generateLeagueScoutingReport(
  input: ScoutingReportInput,
): Promise<string> {
  const tone = input.tone === "custom" && input.toneCustom ? input.toneCustom : input.tone;
  const toneGuidance = TONE_GUIDANCE[input.tone] ?? TONE_GUIDANCE.custom;

  const ownerLines = input.owners
    .slice(0, 14)
    .map((o) => {
      const tags = o.archetypes.length ? ` [${o.archetypes.join(", ")}]` : "";
      const desc = o.managerDescription ? ` — ${o.managerDescription}` : "";
      return `- ${o.ownerName}${o.teamName ? ` ("${o.teamName}")` : ""}${tags}${desc}`;
    })
    .join("\n");

  const memoryLines = input.memories
    .slice(0, 10)
    .map((m) => `- [${m.type}] ${m.title}: ${m.description}`)
    .join("\n");

  const system = `You are Sunday Stories, a sports-media brand that covers fantasy football leagues the way ESPN covers real sports — but personal, funny, and built entirely from what this specific league told you about itself. You are writing the very first thing a commissioner sees after onboarding: a short "scouting report" that proves you were paying attention.

Tone: ${toneGuidance} (League-selected tone label: "${tone}".)
${boundariesLine(input.boundaries)}
Never invent specific facts, scores, or events that weren't provided — you may draw connections and add color, but every concrete claim should trace back to the input.
Output 3-5 short punchy sentences/lines, no preamble, no markdown headers, no quotation marks around the whole thing. It should read like a dramatic teaser, not a summary.`;

  const user = `LEAGUE: ${input.leagueName}
AGE: ${input.leagueAge}
SERIOUSNESS (0=casual, 100=we have problems): ${input.seriousness}

MANAGERS:
${ownerLines || "(none provided yet)"}

LORE / MEMORIES:
${memoryLines || "(none provided yet)"}

${input.fitInAnswer ? `WHAT WOULD MAKE US FIT IN: ${input.fitInAnswer}` : ""}

Write the scouting report now.`;

  const live = await complete(system, user, 400);
  return live ?? mockScoutingReport(input);
}

/** Future: weekly recap story generated from that week's stat/story inputs. */
export async function generateWeeklyStory(input: WeeklyStoryInput): Promise<string> {
  const system = `You are Sunday Stories, writing a short weekly recap in a ${input.tone} tone for a fantasy football league. Keep it to a punchy headline plus 2-3 sentences.`;
  const user = `League: ${input.leagueName}. Week ${input.week}, ${input.season} season. Notable facts: ${input.headlineFacts.join("; ")}.`;
  const live = await complete(system, user, 300);
  return live ?? mockWeeklyStory(input);
}

/** Future: weekly power rankings blurb. */
export async function generatePowerRankings(input: PowerRankingsInput): Promise<string> {
  const system = `You are Sunday Stories, writing brief power rankings commentary in a ${input.tone} tone.`;
  const user = `League: ${input.leagueName}. Standings:\n${input.standings
    .map((s, i) => `${i + 1}. ${s.ownerName} (${s.record})${s.note ? ` - ${s.note}` : ""}`)
    .join("\n")}`;
  const live = await complete(system, user, 400);
  return live ?? mockPowerRankings(input);
}

/** Future: turn a saved quote into a punchy "receipt" callout. */
export async function generateReceipt(input: ReceiptInput): Promise<string> {
  const system = `You are Sunday Stories, turning a saved quote into a short "receipts" callout in a ${input.tone} tone. 1-2 sentences of setup around the quote.`;
  const user = `Quote: "${input.quote}" — said by ${input.quoteBy}.${
    input.context ? ` Context: ${input.context}.` : ""
  }`;
  const live = await complete(system, user, 250);
  return live ?? mockReceipt(input);
}

/** Future: rivalry-week preview blurb. */
export async function generateRivalryPreview(input: RivalryPreviewInput): Promise<string> {
  const system = `You are Sunday Stories, writing a short rivalry-week preview in a ${input.tone} tone.`;
  const user = `League: ${input.leagueName}. Rivalry: ${input.ownerA} vs. ${input.ownerB}.${
    input.reason ? ` Why it's a rivalry: ${input.reason}.` : ""
  }`;
  const live = await complete(system, user, 300);
  return live ?? mockRivalryPreview(input);
}
