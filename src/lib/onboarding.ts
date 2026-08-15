import "server-only";
import type { OnboardingPayload } from "./validation";
import { RAPID_FIRE_PROMPTS } from "./validation";
import type { MemoryType } from "./types";

export type MemoryDraft = {
  type: MemoryType;
  title: string;
  description: string;
  peopleInvolved: string[];
  seasonOrYear?: string;
  importance: number;
  source: string;
  screenshotDataUrl?: string;
};

const LORE_META: Record<
  keyof OnboardingPayload["lore"],
  { type: MemoryType; title: string }
> = {
  bestStory: { type: "OTHER", title: "The Story Everyone Still Talks About" },
  worstDecision: { type: "OTHER", title: "The Worst Fantasy Decision Ever Made" },
  painfulLoss: { type: "COLLAPSE", title: "The Most Painful Loss in League History" },
  runningJoke: { type: "RUNNING_JOKE", title: "The League's Longest-Running Joke" },
  insiderThing: { type: "OTHER", title: "You Had to Be There" },
};

/**
 * Turns a validated onboarding payload into flat LeagueMemory drafts, using
 * a clientId -> real Owner.id map (owners must already be persisted).
 * Screenshot memories carry their data URL for the caller to upload and
 * attach as `imageUrl` separately (keeps this function synchronous/pure).
 */
export function buildMemoryDrafts(
  payload: OnboardingPayload,
  ownerIdByClientId: Map<string, string>,
): MemoryDraft[] {
  const resolve = (clientId: string) => ownerIdByClientId.get(clientId);
  const drafts: MemoryDraft[] = [];

  for (const [key, value] of Object.entries(payload.lore) as [
    keyof OnboardingPayload["lore"],
    string | undefined,
  ][]) {
    if (!value || !value.trim()) continue;
    const meta = LORE_META[key];
    drafts.push({
      type: meta.type,
      title: meta.title,
      description: value.trim(),
      peopleInvolved: [],
      importance: 3,
      source: "onboarding",
    });
  }

  for (const rivalry of payload.rivalries) {
    const a = resolve(rivalry.ownerAClientId);
    const b = resolve(rivalry.ownerBClientId);
    if (!a || !b) continue;
    drafts.push({
      type: "RIVALRY",
      title: "Rivalry",
      description: rivalry.reason?.trim() || "A rivalry the league takes seriously.",
      peopleInvolved: [a, b],
      importance: 2,
      source: "onboarding",
    });
  }

  for (const [key, ownerClientId] of Object.entries(payload.rapidFire)) {
    if (!ownerClientId) continue;
    const ownerId = resolve(ownerClientId);
    if (!ownerId) continue;
    drafts.push({
      type: "PREDICTION",
      title: RAPID_FIRE_PROMPTS[key as keyof typeof RAPID_FIRE_PROMPTS] ?? "Prediction",
      description: RAPID_FIRE_PROMPTS[key as keyof typeof RAPID_FIRE_PROMPTS] ?? "Prediction",
      peopleInvolved: [ownerId],
      importance: 1,
      source: "onboarding_rapid_fire",
    });
  }

  for (const receipt of payload.receipts) {
    if (receipt.kind === "quote" && receipt.quoteText?.trim()) {
      drafts.push({
        type: "QUOTE",
        title: receipt.quoteBy ? `Quote — ${receipt.quoteBy}` : "Quote",
        description: receipt.quoteText.trim(),
        peopleInvolved: [],
        seasonOrYear: receipt.quoteDate || undefined,
        importance: 2,
        source: receipt.quoteContext || "onboarding",
      });
    } else if (receipt.kind === "moment" && receipt.momentTitle?.trim()) {
      drafts.push({
        type: "OTHER",
        title: receipt.momentTitle.trim(),
        description: receipt.momentDescription?.trim() || receipt.momentTitle.trim(),
        peopleInvolved: [],
        importance: 2,
        source: "onboarding",
      });
    } else if (receipt.kind === "screenshot" && receipt.screenshotDataUrl) {
      drafts.push({
        type: "OTHER",
        title: receipt.screenshotCaption?.trim() || "Screenshot receipt",
        description: receipt.screenshotCaption?.trim() || "A screenshot submitted as a receipt.",
        peopleInvolved: [],
        importance: 2,
        source: "onboarding",
        screenshotDataUrl: receipt.screenshotDataUrl,
      });
    }
  }

  return drafts;
}
