import "server-only";
import { getAnthropicClient } from "./client";
import { leagueProfileDataSchema, previewIssueDataSchema } from "./schemas";
import {
  mockLeagueProfile,
  mockPowerRankings,
  mockPreviewIssue,
  mockReceipt,
  mockRivalryPreview,
  mockWeeklyStory,
} from "./mock";
import type {
  LeagueProfileData,
  LeagueProfileInput,
  PowerRankingsInput,
  PreviewIssueData,
  PreviewIssueInput,
  ReceiptInput,
  RivalryPreviewInput,
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

/** Strips a ```json fence if the model wrapped its answer in one, despite being asked not to. */
function stripCodeFence(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : text).trim();
}

/**
 * Same contract as `complete`, but asks for — and validates — structured
 * JSON against a zod schema. Returns null (triggering the mock fallback)
 * on a missing key, a refusal, or output that doesn't parse/validate, so a
 * malformed AI response can never reach the database or the page.
 */
async function completeJson<T>(
  system: string,
  user: string,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
  maxTokens = 900,
): Promise<T | null> {
  const jsonSystem = `${system}\n\nRespond with ONLY a single valid JSON object matching the requested shape. No markdown code fences, no preamble, no trailing commentary.`;
  const raw = await complete(jsonSystem, user, maxTokens);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(stripCodeFence(raw));
    const result = schema.safeParse(parsed);
    return result.success ? (result.data as T) : null;
  } catch {
    return null;
  }
}

function boundariesLine(boundaries?: string | null) {
  return boundaries
    ? `Off-limits — never joke about or reference: ${boundaries}.`
    : "No off-limits topics were specified, but stay tasteful.";
}

function leagueContextBlock(input: LeagueProfileInput): string {
  const ownerLines = input.owners
    .slice(0, 16)
    .map((o) => {
      const tags = o.archetypes.length ? ` [${o.archetypes.join(", ")}]` : "";
      const desc = o.managerDescription ? ` — ${o.managerDescription}` : "";
      const extra = o.extraNotes ? ` (also: ${o.extraNotes})` : "";
      return `- ${o.ownerName}${o.teamName ? ` ("${o.teamName}")` : ""}${o.favoriteNflTeam ? ` [fan of ${o.favoriteNflTeam}]` : ""}${tags}${desc}${extra}`;
    })
    .join("\n");

  const memoryLines = input.memories
    .slice(0, 12)
    .map((m) => `- [${m.type}] ${m.title}: ${m.description}`)
    .join("\n");

  const rivalryLines = input.rivalries
    .slice(0, 8)
    .map((r) => `- ${r.ownerA} vs. ${r.ownerB}${r.reason ? `: ${r.reason}` : ""}`)
    .join("\n");

  return `LEAGUE: ${input.leagueName}
AGE: ${input.leagueAge}
SERIOUSNESS (0=casual, 100=we have problems): ${input.seriousness}

MANAGERS:
${ownerLines || "(none provided yet)"}

LORE / MEMORIES:
${memoryLines || "(none provided yet)"}

RIVALRIES:
${rivalryLines || "(none provided yet)"}

${input.fitInAnswer ? `WHAT WOULD MAKE US FIT IN: ${input.fitInAnswer}` : ""}`;
}

/**
 * The internal "what we know about this league" profile. Structured, not
 * prose — this is what gets rendered as the onboarding-completion moment
 * and is the primary context fed into generatePreviewIssue. Regenerable at
 * any time as more owners/memories/rivalries come in.
 */
export async function generateLeagueProfile(input: LeagueProfileInput): Promise<LeagueProfileData> {
  const tone = input.tone === "custom" && input.toneCustom ? input.toneCustom : input.tone;
  const toneGuidance = TONE_GUIDANCE[input.tone] ?? TONE_GUIDANCE.custom;

  const system = `You are Sunday Stories, a sports-media brand that covers fantasy football leagues the way ESPN covers real sports — but personal, funny, and built entirely from what this specific league told you about itself. You are building a structured internal profile of this league: the first proof a commissioner sees that you were paying attention.

Tone: ${toneGuidance} (League-selected tone label: "${tone}".)
${boundariesLine(input.boundaries)}
Never invent specific facts, scores, or events that weren't provided — you may draw connections and add color, but every concrete claim should trace back to the input.

Return a JSON object with exactly these keys:
- leagueArchetype: a punchy 2-5 word label for this league's personality (e.g. "Grudge Match Energy")
- openingLine: 2-4 short punchy sentences, dramatic-teaser voice, no markdown
- titleContender: {ownerName, blurb} or null if no manager stands out for this
- darkHorse: {ownerName, blurb} or null
- chaosAgent: {ownerName, blurb} or null
- rivalrySpotlight: {matchup, blurb} or null if no rivalry was provided
- boldPrediction: one punchy sentence
- superlatives: array of 2-4 {label, ownerName, blurb} — label is a specific, funny superlative title (e.g. "Most Likely to Rage-Trade by Week 3"), grounded in what was said about that manager`;

  const user = `${leagueContextBlock(input)}\n\nBuild the league profile now.`;

  const live = await completeJson(system, user, leagueProfileDataSchema, 900);
  return live ?? mockLeagueProfile(input);
}

/**
 * The outward-facing, shareable content product: a Preseason / Draft Night
 * Preview issue. Editorial voice, meant to be read and shared, not just
 * skimmed by the commissioner. `profile`, if provided, keeps the issue
 * consistent with whatever the internal profile already concluded.
 */
export async function generatePreviewIssue(input: PreviewIssueInput): Promise<PreviewIssueData> {
  const tone = input.tone === "custom" && input.toneCustom ? input.toneCustom : input.tone;
  const toneGuidance = TONE_GUIDANCE[input.tone] ?? TONE_GUIDANCE.custom;

  const system = `You are Sunday Stories, writing a shareable "Preseason Preview" issue for a fantasy football league — the kind of thing a commissioner drops straight into the league group chat because it's genuinely funny and specific to their league. Nobody has played a game yet, so treat every ranking and prediction as confident preseason speculation, not a claim about real results.

Tone: ${toneGuidance} (League-selected tone label: "${tone}".)
${boundariesLine(input.boundaries)}
Never invent specific facts, scores, or events that weren't provided.

Return a JSON object with exactly these keys:
- issueLabel: "PRESEASON PREVIEW" or "DRAFT NIGHT PREVIEW"
- headline: one punchy, all-caps-worthy headline for the whole issue
- dek: one sub-headline sentence
- powerRankings: array covering every manager provided, {rank (1 = best), ownerName, blurb} — order by preseason vibes/reputation from the input, not anything invented
- superlatives: array of 3-4 {label, ownerName, blurb}
- rivalryToWatch: {matchup, blurb} or null if no rivalry was provided
- boldPredictions: array of 3 short punchy prediction sentences
- closingLine: one short sign-off line`;

  const profileContext = input.profile
    ? `\n\nINTERNAL PROFILE ALREADY ESTABLISHED (stay consistent with this):\n${JSON.stringify(input.profile)}`
    : "";
  const user = `${leagueContextBlock(input)}${profileContext}\n\nWrite the issue now.`;

  const live = await completeJson(system, user, previewIssueDataSchema, 1400);
  return live ?? mockPreviewIssue(input);
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

/** Future: turn a saved quote into a punchy "receipts" callout. */
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
